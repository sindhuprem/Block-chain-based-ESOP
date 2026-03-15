from flask import Blueprint, jsonify, request
from models import Employee, db
from blockchain import contract, w3, get_connection_status
import traceback

main = Blueprint("main", __name__)

# ─────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────
@main.route("/")
def home():
    return jsonify({
        "status": "Backend Running",
        "blockchain_connected": get_connection_status()
    })

# ─────────────────────────────────────────
# AUTH — LOGIN
# ─────────────────────────────────────────
@main.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    role = data.get("role")
    employee = Employee.query.filter_by(email=email, role=role).first()
    if not employee:
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful", "user": employee.to_dict()})

# ─────────────────────────────────────────
# EMPLOYEES
# ─────────────────────────────────────────
@main.route("/api/employees", methods=["GET"])
def get_employees():
    employees = Employee.query.all()
    return jsonify([e.to_dict() for e in employees])

@main.route("/api/employees/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    emp = Employee.query.get_or_404(emp_id)
    return jsonify(emp.to_dict())

@main.route("/api/employees", methods=["POST"])
def create_employee():
    data = request.get_json()
    emp = Employee(
        name=data["name"],
        email=data["email"],
        role=data.get("role", "employee"),
        department=data.get("department"),
        wallet_address=data.get("wallet_address"),
        status=data.get("status", "active")
    )
    db.session.add(emp)
    db.session.commit()
    return jsonify(emp.to_dict()), 201

# ─────────────────────────────────────────
# ALL GRANTS — must be ABOVE /<wallet_address>
# ─────────────────────────────────────────
@main.route("/api/grants/all", methods=["GET"])
def get_all_grants():
    try:
        employees = Employee.query.filter(
            Employee.wallet_address != None,
            Employee.role == "employee"
        ).all()
        all_grants = []
        for emp in employees:
            try:
                address = w3.to_checksum_address(emp.wallet_address)
                grant_ids = contract.functions.getEmployeeGrants(address).call()
                for gid in grant_ids:
                    g = contract.functions.getGrantDetails(gid).call()
                    # g[0]=employeeAddress, g[1]=employeeName, g[2]=totalShares,
                    # g[3]=vestedShares, g[4]=exercisedShares, g[5]=grantDate, g[6]=isActive
                    all_grants.append({
                        "grantId": gid,
                        "employeeName": emp.name,
                        "department": emp.department,
                        "employeeAddress": g[0],
                        "totalShares": g[2],
                        "vestedShares": g[3],
                        "exercisedShares": g[4],
                        "grantDate": g[5],
                        "isActive": g[6]
                    })
            except Exception as inner_e:
                print(f"Error fetching grants for {emp.name}: {inner_e}")
                continue
        return jsonify(all_grants)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────
# GRANTS — Create (ADMIN_ROLE required)
# ─────────────────────────────────────────
@main.route("/api/grants", methods=["POST"])
def create_grant():
    try:
        data = request.get_json()
        employee_address = w3.to_checksum_address(data["employeeAddress"])
        total_shares = int(data["totalShares"])
        cliff_period = int(data.get("cliffPeriod", 365))
        vesting_duration = int(data.get("vestingDuration", 1460))
        employee_name = data["employeeName"]

        # account[0] is the deployer — has ADMIN_ROLE by default
        sender = w3.eth.accounts[0]

        # Grant ADMIN_ROLE to sender just in case
        try:
            admin_role = contract.functions.ADMIN_ROLE().call()
            contract.functions.grantRole(
                admin_role, sender
            ).transact({"from": sender})
        except:
            pass

        # Correct order: address, string name, uint256 shares, uint256 cliff, uint256 vesting
        tx_hash = contract.functions.createGrant(
            employee_address,
            employee_name,
            total_shares,
            cliff_period,
            vesting_duration
        ).transact({"from": sender, "gas": 500000})

        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return jsonify({
            "message": "Grant created successfully",
            "txHash": receipt.transactionHash.hex()
        }), 201

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────
# GRANTS — Read by wallet address
# ─────────────────────────────────────────
@main.route("/api/grants/<string:wallet_address>", methods=["GET"])
def get_employee_grants(wallet_address):
    try:
        address = w3.to_checksum_address(wallet_address)
        grant_ids = contract.functions.getEmployeeGrants(address).call()
        grants = []
        for gid in grant_ids:
            g = contract.functions.getGrantDetails(gid).call()
            # g[0]=employeeAddress, g[1]=employeeName, g[2]=totalShares,
            # g[3]=vestedShares, g[4]=exercisedShares, g[5]=grantDate, g[6]=isActive
            grants.append({
                "grantId": gid,
                "employeeAddress": g[0],
                "employeeName": g[1],
                "totalShares": g[2],
                "vestedShares": g[3],
                "exercisedShares": g[4],
                "grantDate": g[5],
                "isActive": g[6]
            })
        return jsonify(grants)
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────
# EXERCISE SHARES
# ─────────────────────────────────────────
@main.route("/api/grants/<int:grant_id>/exercise", methods=["POST"])
def exercise_shares(grant_id):
    try:
        data = request.get_json()
        shares_to_exercise = int(data["shares"])
        wallet_address = w3.to_checksum_address(data["walletAddress"])
        tx_hash = contract.functions.exerciseShares(
            grant_id, shares_to_exercise
        ).transact({"from": wallet_address, "gas": 300000})
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return jsonify({
            "message": "Shares exercised successfully",
            "txHash": receipt.transactionHash.hex()
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────
# UPDATE VESTING
# ─────────────────────────────────────────
@main.route("/api/grants/<int:grant_id>/update-vesting", methods=["POST"])
def update_vesting(grant_id):
    try:
        sender = w3.eth.accounts[0]
        tx_hash = contract.functions.updateVesting(grant_id).transact(
            {"from": sender, "gas": 300000}
        )
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return jsonify({
            "message": "Vesting updated",
            "txHash": receipt.transactionHash.hex()
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────
# REVOKE GRANT
# ─────────────────────────────────────────
@main.route("/api/grants/<int:grant_id>/revoke", methods=["POST"])
def revoke_grant(grant_id):
    try:
        sender = w3.eth.accounts[0]
        tx_hash = contract.functions.revokeGrant(grant_id).transact(
            {"from": sender, "gas": 300000}
        )
        receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
        return jsonify({
            "message": "Grant revoked",
            "txHash": receipt.transactionHash.hex()
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────
# ESOP POOL INFO
# ─────────────────────────────────────────
@main.route("/api/pool", methods=["GET"])
def get_pool():
    try:
        available = contract.functions.getAvailablePool().call()
        return jsonify({"availablePool": available})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
from flask import request, jsonify
from app import app, db
from models import ESOPGrant
from blockchain import contract, w3


@app.route("/api/create-grant", methods=["POST"])
def create_grant():

    data = request.json

    employee_id = data["employee_id"]
    shares = data["shares"]

    account = w3.eth.accounts[0]

    tx = contract.functions.createGrant(
        employee_id,
        shares
    ).transact({"from": account})

    tx_hash = w3.to_hex(tx)

    grant = ESOPGrant(
        employee_id=employee_id,
        shares=shares,
        transaction_hash=tx_hash
    )

    db.session.add(grant)
    db.session.commit()

    return jsonify({
        "message": "Grant created",
        "tx_hash": tx_hash
    })
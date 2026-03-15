const ESOPManagement = artifacts.require("ESOPManagement");

module.exports = async function(callback) {
  try {
    console.log("\n🔗 Interacting with deployed contracts...\n");
    
    const accounts = await web3.eth.getAccounts();
    const admin = accounts[0];
    const employee = accounts[1];

    console.log("Admin account:", admin);
    console.log("Employee account:", employee);

    // Get deployed contract
    const esop = await ESOPManagement.deployed();
    console.log("\n📄 Contract address:", esop.address);

    // Get initial state
    console.log("\n📊 Initial State:");
    const initialPool = await esop.totalESOPPool();
    const initialAllocated = await esop.allocatedShares();
    const initialAvailable = await esop.getAvailablePool();
    
    console.log("Total Pool:", initialPool.toString());
    console.log("Allocated:", initialAllocated.toString());
    console.log("Available:", initialAvailable.toString());

    // Create a grant
    console.log("\n📝 Creating grant for employee...");
    const tx = await esop.createGrant(
      employee,
      "Alice Smith",
      5000,   // 5000 shares
      365,    // 1 year cliff (days)
      1460,   // 4 years vesting (days)
      { from: admin }
    );
    
    console.log("✅ Grant created!");
    console.log("Transaction hash:", tx.tx);
    console.log("Gas used:", tx.receipt.gasUsed);

    // Get grant details
    console.log("\n📋 Grant Details:");
    const details = await esop.getGrantDetails(1);
    console.log("Employee:", details.employee);
    console.log("Employee Name:", details.employeeName);
    console.log("Total Shares:", details.totalShares.toString());
    console.log("Vested Shares:", details.vestedShares.toString());
    console.log("Exercised Shares:", details.exercisedShares.toString());
    console.log("Grant Date:", new Date(details.grantDate.toNumber() * 1000).toLocaleString());
    console.log("Is Active:", details.isActive);

    // Check employee grants
    console.log("\n📂 Employee Grants:");
    const employeeGrantIds = await esop.getEmployeeGrants(employee);
    console.log("Grant IDs:", employeeGrantIds.map(id => id.toString()));

    // Get updated pool info
    console.log("\n💰 Updated Pool Information:");
    const updatedAllocated = await esop.allocatedShares();
    const updatedAvailable = await esop.getAvailablePool();
    
    console.log("Allocated Shares:", updatedAllocated.toString());
    console.log("Available Shares:", updatedAvailable.toString());
    console.log("Pool Utilization:", ((updatedAllocated / initialPool) * 100).toFixed(2) + "%");

    // Check roles
    console.log("\n🔐 Role Verification:");
    const ADMIN_ROLE = await esop.ADMIN_ROLE();
    const EMPLOYEE_ROLE = await esop.EMPLOYEE_ROLE();
    
    const adminHasRole = await esop.hasRole(ADMIN_ROLE, admin);
    const employeeHasRole = await esop.hasRole(EMPLOYEE_ROLE, employee);
    
    console.log("Admin has ADMIN_ROLE:", adminHasRole);
    console.log("Employee has EMPLOYEE_ROLE:", employeeHasRole);

    // Calculate vesting
    console.log("\n⏰ Vesting Calculation:");
    const vestedNow = await esop.calculateVestedShares(1);
    console.log("Currently vested shares:", vestedNow.toString());
    console.log("(This will be 0 since cliff period hasn't passed yet)");

    console.log("\n✅ Interaction completed successfully!\n");

    callback();
  } catch (error) {
    console.error("\n❌ Interaction failed:");
    console.error(error);
    callback(error);
  }
};
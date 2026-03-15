const ESOPManagement = artifacts.require("ESOPManagement");
const AccessControl = artifacts.require("AccessControl");

module.exports = async function(callback) {
  try {
    console.log("\n📦 Starting deployment...\n");
    
    const accounts = await web3.eth.getAccounts();
    console.log("Deploying from account:", accounts[0]);
    console.log("Account balance:", web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether'), "ETH\n");

    // Deploy AccessControl
    console.log("Deploying AccessControl...");
    const accessControl = await AccessControl.new({ from: accounts[0] });
    console.log("✅ AccessControl deployed at:", accessControl.address);

    // Deploy ESOPManagement
    const totalPool = 1000000;
    console.log("\nDeploying ESOPManagement with pool size:", totalPool);
    const esop = await ESOPManagement.new(totalPool, { from: accounts[0] });
    console.log("✅ ESOPManagement deployed at:", esop.address);

    // Verify deployment
    console.log("\n📊 Verifying deployment...");
    const poolSize = await esop.totalESOPPool();
    const allocated = await esop.allocatedShares();
    const available = await esop.getAvailablePool();
    
    console.log("Total ESOP Pool:", poolSize.toString());
    console.log("Allocated Shares:", allocated.toString());
    console.log("Available Shares:", available.toString());

    // Check admin role
    const ADMIN_ROLE = await esop.ADMIN_ROLE();
    const isAdmin = await esop.hasRole(ADMIN_ROLE, accounts[0]);
    console.log("Deployer has admin role:", isAdmin);

    console.log("\n✅ Deployment completed successfully!\n");

    callback();
  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    callback(error);
  }
};
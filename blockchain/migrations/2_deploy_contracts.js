const AccessControl = artifacts.require("AccessControl");
const ESOPManagement = artifacts.require("ESOPManagement");

module.exports = async function (deployer) {
  // Deploy AccessControl first
  await deployer.deploy(AccessControl);
  
  // Deploy ESOPManagement with 1 million shares in pool
  const totalESOPPool = 1000000;
  await deployer.deploy(ESOPManagement, totalESOPPool);
  
  console.log("✅ Contracts deployed successfully!");
  console.log("AccessControl address:", AccessControl.address);
  console.log("ESOPManagement address:", ESOPManagement.address);
};
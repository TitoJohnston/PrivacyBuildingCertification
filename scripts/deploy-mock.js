const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Privacy Building Certification Mock contract...");

  // Get the contract factory
  const PrivacyBuildingCertificationMock = await ethers.getContractFactory("PrivacyBuildingCertificationMock");

  // Set certification authority address (use deployer as authority for testing)
  const [deployer] = await ethers.getSigners();
  const certificationAuthority = deployer.address;

  console.log("Deploying with certification authority:", certificationAuthority);

  // Deploy the contract
  const contract = await PrivacyBuildingCertificationMock.deploy(certificationAuthority);

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("Mock Contract deployed to:", contractAddress);
  console.log("Certification Authority:", certificationAuthority);

  // Log contract details
  console.log("\nContract deployment details:");
  console.log("- Network:", hre.network.name);
  console.log("- Contract Address:", contractAddress);
  console.log("- Deployer:", (await ethers.getSigners())[0].address);
  console.log("- Certification Authority:", certificationAuthority);
  console.log("\nNote: This is a mock version for testing. The production version uses FHE encryption.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
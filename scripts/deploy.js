const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Privacy Building Certification Mock contract...");

  // Get the contract factory - Use Mock version for standard EVM networks
  const PrivacyBuildingCertification = await ethers.getContractFactory("PrivacyBuildingCertificationMock");

  // Set certification authority address
  const certificationAuthority = "0x527352c99714ddF4B93543D0AB30E792FD45dde3";

  console.log("Deploying with certification authority:", certificationAuthority);

  // Deploy the contract
  const contract = await PrivacyBuildingCertification.deploy(certificationAuthority);

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
  console.log("\nNOTE: This is a MOCK version for testing on standard EVM networks.");
  console.log("For production with real FHE encryption, use PrivacyBuildingCertification on Zama fhEVM network.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
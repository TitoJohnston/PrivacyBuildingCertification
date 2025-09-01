const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Privacy Building Certification with FHE...");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Get balance
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Set certification authority address
  const certificationAuthority = "0x527352c99714ddF4B93543D0AB30E792FD45dde3";
  console.log("🔑 Certification Authority:", certificationAuthority);

  // Get the contract factory - FHE version
  const PrivacyBuildingCertification = await ethers.getContractFactory("PrivacyBuildingCertification");

  console.log("⏳ Deploying contract with FHE encryption...");

  // Deploy the contract
  const contract = await PrivacyBuildingCertification.deploy(certificationAuthority);

  console.log("⌛ Waiting for deployment confirmation...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("\n✅ FHE Contract deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);

  // Verify contract setup
  console.log("\n🔍 Verifying contract setup...");
  try {
    const owner = await contract.owner();
    const authority = await contract.authority();
    const totalBuildings = await contract.totalBuildings();

    console.log("👤 Contract Owner:", owner);
    console.log("🔐 Certification Authority:", authority);
    console.log("🏢 Total Buildings:", totalBuildings.toString());
  } catch (error) {
    console.log("⚠️ Contract setup verification failed:", error.message);
  }

  console.log("\n📋 Deployment Summary:");
  console.log("================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network: Sepolia");
  console.log("Deployer:", deployer.address);
  console.log("Authority:", certificationAuthority);
  console.log("\n🔐 FHE Features:");
  console.log("- Fully Homomorphic Encryption enabled");
  console.log("- Privacy-preserving building data");
  console.log("- Encrypted energy consumption & efficiency scores");
  console.log("\n🔗 Add this address to your frontend:");
  console.log(`const CONTRACT_ADDRESS = "${contractAddress}";`);

  return contractAddress;
}

main()
  .then((address) => {
    console.log("\n🎉 Deployment successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
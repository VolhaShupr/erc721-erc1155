import { ethers } from "hardhat";

async function main() {
  const nftContractFactory = await ethers.getContractFactory("ERC1155Sample");
  const nft = await nftContractFactory.deploy();
  await nft.deployed();

  console.log("ERC1155 contract deployed to:", nft.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

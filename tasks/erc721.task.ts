import { task } from "hardhat/config";

task("mint721", "Issues erc721 token")
  .addParam("contractaddr", "The contract address")
  .addParam("uri", "Token URI")
  .addOptionalParam("recipientaddr", "The recipient address")
  .setAction(async ({ contractaddr: contractAddress, uri, recipientaddr: recipientAddress }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const accountAddress = recipientAddress || signer.address;
    const nft = await hre.ethers.getContractAt("ERC721Sample", contractAddress);

    await nft.safeMint(accountAddress, uri);

    console.log(`Minted NFT with metadata at ${uri} to address ${accountAddress}`);
  });

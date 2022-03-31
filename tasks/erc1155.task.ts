import { task } from "hardhat/config";

task("mint1155", "Issues erc1155 token")
  .addParam("contractaddr", "The contract address")
  .addParam("amount", "Tokens amount")
  .addOptionalParam("recipientaddr", "The recipient address")
  .addOptionalParam("decimals", "The recipient address")
  .setAction(async ({ contractaddr: contractAddress, amount, recipientaddr: recipientAddress }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const accountAddress = recipientAddress || signer.address;
    const nft = await hre.ethers.getContractAt("ERC1155Sample", contractAddress);

    await nft.mint(accountAddress, amount);

    console.log(`Minted ${amount} NFT to address ${accountAddress}`);
  });

task("mintBatch1155", "Issues erc1155 tokens")
  .addParam("contractaddr", "The contract address")
  .addParam("amounts", "Tokens amounts, e.g. 3,2,5")
  .addOptionalParam("recipientaddr", "The recipient address")
  .setAction(async ({ contractaddr: contractAddress, amounts, recipientaddr: recipientAddress }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const accountAddress = recipientAddress || signer.address;
    const nft = await hre.ethers.getContractAt("ERC1155Sample", contractAddress);
    const amountsArray = amounts.split(",");

    await nft.mintBatch(accountAddress, amountsArray);

    console.log(`Minted ${amounts} NFT to address ${accountAddress}`);
  });

task("updateURI1155", "Sets new URI")
  .addParam("contractaddr", "The contract address")
  .addParam("uri", "New URI")
  .setAction(async ({ contractaddr: contractAddress, uri }, hre) => {
    const nft = await hre.ethers.getContractAt("ERC1155Sample", contractAddress);
    await nft.updateURI(uri);

    console.log(`URI updated to ${uri}`);
  });

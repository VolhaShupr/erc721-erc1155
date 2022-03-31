import { expect } from "chai";
import { ethers, network } from "hardhat";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const ZERO_ADDRESS = ethers.constants.AddressZero;

const toBigNumber = (amount: number): BigNumber => BigNumber.from(amount);

describe("ERC1155", () => {
  const amounts = [3, 2, 5].map((el: number) => toBigNumber(el));
  const ids = [1, 2, 3];
  const amount = amounts[0];
  const tokenId = ids[0];

  let contract: Contract,
    owner: SignerWithAddress,
    delegate: SignerWithAddress,
    account1: SignerWithAddress;

  let clean: any; // snapshot

  before(async () => {
    [owner, delegate, account1] = await ethers.getSigners();

    const nftContractFactory = await ethers.getContractFactory("ERC1155Sample");
    contract = await nftContractFactory.deploy();
    await contract.deployed();

    clean = await network.provider.request({ method: "evm_snapshot", params: [] });
  });

  afterEach(async () => {
    await network.provider.request({ method: "evm_revert", params: [clean] });
    clean = await network.provider.request({ method: "evm_snapshot", params: [] });
  });

  it("Should return the token collection name", async () => {
    expect(await contract.name()).to.equal("NFTSample1155");
  });

  it("Should return the token collection symbol", async () => {
    expect(await contract.symbol()).to.equal("S1155");
  });

  it("Should set new URI", async () => {
    const newURI = "https://1f23h4j5.ipfs.nftstorage.link/metadata/{id}.json";
    await contract.updateURI(newURI);
    expect(await contract.uri(1)).to.equal(newURI);
  });

  it("Should issue NFT to the specified account", async () => {
    const ownerAddress = owner.address;

    await expect(contract.mint(ownerAddress, amount))
      .to.emit(contract, "TransferSingle")
      .withArgs(ownerAddress, ZERO_ADDRESS, ownerAddress, tokenId, amount);

    expect(await contract.balanceOf(ownerAddress, tokenId)).to.equal(amount);
  });

  it("Should issue NFT batch to the specified account", async () => {
    const ownerAddress = owner.address;

    await expect(contract.mintBatch(ownerAddress, amounts))
      .to.emit(contract, "TransferBatch")
      .withArgs(ownerAddress, ZERO_ADDRESS, ownerAddress, ids, amounts);

    expect(await contract.balanceOf(ownerAddress, 3)).to.equal(amounts[2]);

    const accounts = Array(amounts.length).fill(ownerAddress);
    expect(await contract.balanceOfBatch(accounts, ids)).to.eql(amounts);
  });

  describe("Approve & transfer", () => {
    let ownerAddress: string;
    let delegateAddress: string;
    let recipientAddress: string;

    beforeEach(async () => {
      ownerAddress = owner.address;
      delegateAddress = delegate.address;
      recipientAddress = account1.address;

      await contract.mintBatch(ownerAddress, amounts);
    });

    it("Should enable approval address (operator) for all NFTs", async () => {
      const isEnabled = true;
      await expect(contract.setApprovalForAll(delegateAddress, isEnabled))
        .to.emit(contract, "ApprovalForAll")
        .withArgs(ownerAddress, delegateAddress, isEnabled);

      expect(await contract.isApprovedForAll(ownerAddress, delegateAddress)).to.equal(isEnabled);
    });

    it("Should transfer NFT to another account", async () => {
      await contract.setApprovalForAll(delegateAddress, true);
      await expect(contract.connect(delegate).safeTransferFrom(ownerAddress, recipientAddress, tokenId, 2, "0x"))
        .to.emit(contract, "TransferSingle")
        .withArgs(delegateAddress, ownerAddress, recipientAddress, tokenId, 2);

      expect(await contract.balanceOf(ownerAddress, tokenId)).to.equal(1);
      expect(await contract.balanceOf(recipientAddress, tokenId)).to.equal(2);
    });

    it("Should transfer NFT batch to another account", async () => {
      await contract.setApprovalForAll(delegateAddress, true);
      await expect(contract.connect(delegate).safeBatchTransferFrom(ownerAddress, recipientAddress, ids, amounts, "0x"))
        .to.emit(contract, "TransferBatch")
        .withArgs(delegateAddress, ownerAddress, recipientAddress, ids, amounts);

      expect(await contract.balanceOf(ownerAddress, tokenId)).to.equal(0);
      expect(await contract.balanceOf(recipientAddress, tokenId)).to.equal(amounts[0]);
    });

  });

});

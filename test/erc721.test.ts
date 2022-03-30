import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const ZERO_ADDRESS = ethers.constants.AddressZero;

describe("ERC721", () => {
  const baseURI = "https://example.com";
  const tokenId = 1;

  let contract: Contract,
    owner: SignerWithAddress,
    delegate: SignerWithAddress,
    account1: SignerWithAddress;

  let clean: any; // snapshot

  before(async () => {
    [owner, delegate, account1] = await ethers.getSigners();

    const nftContractFactory = await ethers.getContractFactory("ERC721Sample");
    contract = await nftContractFactory.deploy();
    await contract.deployed();

    clean = await network.provider.request({ method: "evm_snapshot", params: [] });
  });

  afterEach(async () => {
    await network.provider.request({ method: "evm_revert", params: [clean] });
    clean = await network.provider.request({ method: "evm_snapshot", params: [] });
  });

  it("Should return the token collection name", async () => {
    expect(await contract.name()).to.equal("NFTSample");
  });

  it("Should return the token collection symbol", async () => {
    expect(await contract.symbol()).to.equal("SMPL");
  });

  it("Should issue NFT to the specified account", async () => {
    const ownerAddress = owner.address;
    const tokenURI = `${baseURI}/${tokenId}`;

    await expect(contract.safeMint(ownerAddress, tokenURI))
      .to.emit(contract, "Transfer")
      .withArgs(ZERO_ADDRESS, ownerAddress, tokenId);

    expect(await contract.balanceOf(ownerAddress)).to.equal(1);
    expect(await contract.ownerOf(tokenId)).to.equal(ownerAddress);
    expect(await contract.tokenURI(tokenId)).to.equal(tokenURI);

  });

  describe("Approve & transfer", () => {
    let ownerAddress: string;
    let delegateAddress: string;
    let recipientAddress: string;

    beforeEach(async () => {
      ownerAddress = owner.address;
      delegateAddress = delegate.address;
      recipientAddress = account1.address;
      const tokenURI = `${baseURI}/${tokenId}`;

      await contract.safeMint(ownerAddress, tokenURI);
      await contract.safeMint(ownerAddress, `${baseURI}/2`);

      await contract.approve(delegateAddress, tokenId);
    });

    it("Should set permission for approved address to transfer NFT on behalf of owner", async () => {
      await expect(contract.approve(delegateAddress, 2))
        .to.emit(contract, "Approval")
        .withArgs(ownerAddress, delegateAddress, 2);
    });

    it("Should get approved address by tokenId", async () => {
      expect(await contract.getApproved(tokenId)).to.equal(delegateAddress);
    });

    it("Should enable approval address (operator) for all NFTs", async () => {
      const isEnabled = true;
      await expect(contract.setApprovalForAll(delegateAddress, isEnabled))
        .to.emit(contract, "ApprovalForAll")
        .withArgs(ownerAddress, delegateAddress, isEnabled);

      expect(await contract.isApprovedForAll(ownerAddress, delegateAddress)).to.equal(isEnabled);
    });

    it("Should transfer NFT to another account", async () => {
      await expect(contract.connect(delegate)["safeTransferFrom(address,address,uint256)"](ownerAddress, recipientAddress, tokenId))
        .to.emit(contract, "Transfer")
        .withArgs(ownerAddress, recipientAddress, tokenId);

      expect(await contract.balanceOf(ownerAddress)).to.equal(1);
      expect(await contract.ownerOf(tokenId)).to.equal(recipientAddress);
      expect(await contract.getApproved(tokenId)).to.equal(ZERO_ADDRESS);
    });

  });

});

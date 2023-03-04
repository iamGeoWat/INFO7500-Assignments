import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("NFTDutchAuction", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployNFTDutchAuctionFixture() {
    // initialPrice will be 250
    const reservePrice = 50;
    const numBlocksAuctionOpen = 100;
    const offerPriceDecrement = 2;
    const tokenId = 1;

    const [owner, otherAccount] = await ethers.getSigners();
    const StickyMonster = await ethers.getContractFactory("StickyMonster");
    const stickyMonster = await StickyMonster.deploy();
    await stickyMonster.mint(owner.address, tokenId);
    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction");
    const nftDutchAuction = await upgrades.deployProxy(NFTDutchAuction, [stickyMonster.address, tokenId, reservePrice, numBlocksAuctionOpen, offerPriceDecrement]);
    await stickyMonster.approve(nftDutchAuction.address, tokenId);
    return { stickyMonster, tokenId, nftDutchAuction, reservePrice, numBlocksAuctionOpen, offerPriceDecrement, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right reservePrice", async function () {
      const { nftDutchAuction, reservePrice } = await loadFixture(deployNFTDutchAuctionFixture);
      expect(await nftDutchAuction.reservePrice()).to.equal(reservePrice);
    });
    it("Should set the right numBlocksAuctionOpen", async function () {
      const { nftDutchAuction, numBlocksAuctionOpen } = await loadFixture(deployNFTDutchAuctionFixture);
      expect(await nftDutchAuction.numBlocksAuctionOpen()).to.equal(numBlocksAuctionOpen);
    });
    it("Should have the right initialPrice", async function () {
      const { nftDutchAuction, reservePrice, offerPriceDecrement, numBlocksAuctionOpen } = await loadFixture(deployNFTDutchAuctionFixture);
      expect(await nftDutchAuction.initialPrice()).to.equal(reservePrice + (numBlocksAuctionOpen * offerPriceDecrement));
    });
  });

  describe("bid", function () {
    it('Should reject a bid that is lower than currentPrice', async function () {
      const { stickyMonster, tokenId, owner, nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(10);
      await expect(nftDutchAuction.connect(otherAccount).bid({value: 220})).to.be.revertedWith("Low bid");
      expect(await stickyMonster.ownerOf(tokenId)).to.equal(owner.address);
    });
    it('Should accept a bid that is higher than currentPrice', async function () {
      const { stickyMonster, tokenId, nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(10);
      await expect(nftDutchAuction.connect(otherAccount).bid({value: 250})).to.emit(nftDutchAuction, "BidAccepted").withArgs(otherAccount.address);
      await expect(await stickyMonster.ownerOf(tokenId)).to.equal(otherAccount.address);
    });
    it("Should revert the bid when the auction is over", async function () {
      const { nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(101);
      await expect(nftDutchAuction.connect(otherAccount).bid({value: 1000})).to.be.revertedWith("Auction is over");
    });
    it("Should bid at the reservePrice when the auction is passing a certain amount of time", async function () {
      const { nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(98);
      await expect(nftDutchAuction.connect(otherAccount).bid({value: 250})).to.emit(nftDutchAuction, "BidAccepted").withArgs(otherAccount.address);
    });
  });
});

describe("StickyMonster", function () {
  async function deployStickyMonsterFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const StickyMonster = await ethers.getContractFactory("StickyMonster");
    const stickyMonster = await StickyMonster.deploy();
    return { stickyMonster, owner, otherAccount };
  }

  describe("Mint and Transfer", function () {
    it("Should mint to the correct owner", async function () {
      const { stickyMonster, owner, otherAccount } = await loadFixture(deployStickyMonsterFixture);
      await stickyMonster.mint(otherAccount.address, 1);
      expect(await stickyMonster.ownerOf(1)).to.equal(otherAccount.address);
    });
    it("Should transfer to the correct owner", async function () {
      const { stickyMonster, owner, otherAccount } = await loadFixture(deployStickyMonsterFixture);
      await stickyMonster.mint(owner.address, 1);
      await stickyMonster["safeTransferFrom(address,address,uint256)"](owner.address, otherAccount.address, 1);
      expect(await stickyMonster.ownerOf(1)).to.equal(otherAccount.address);
    });
  });

});
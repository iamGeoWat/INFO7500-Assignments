import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("NFTDutchAuction_ERC20Bids", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployNFTDutchAuctionFixture() {
    // initialPrice will be 250
    const reservePrice = 50;
    const numBlocksAuctionOpen = 100;
    const offerPriceDecrement = 2;
    const tokenId = 1;

    const [owner, otherAccount] = await ethers.getSigners();

    const KaiCoin = await ethers.getContractFactory("KaiCoin");
    const kaiCoin = await KaiCoin.deploy();
    await kaiCoin.mint(otherAccount.address, 2000);
    const StickyMonster = await ethers.getContractFactory("StickyMonster");
    const stickyMonster = await StickyMonster.deploy();
    await stickyMonster.mint(owner.address, tokenId);
    const NFTDutchAuction = await ethers.getContractFactory("NFTDutchAuction_ERC20Bids");
    const nftDutchAuction = await upgrades.deployProxy(NFTDutchAuction, [kaiCoin.address, stickyMonster.address, tokenId, reservePrice, numBlocksAuctionOpen, offerPriceDecrement]);
    await stickyMonster.approve(nftDutchAuction.address, tokenId);
    return { kaiCoin, stickyMonster, tokenId, nftDutchAuction, reservePrice, numBlocksAuctionOpen, offerPriceDecrement, owner, otherAccount };
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
      const { kaiCoin, stickyMonster, tokenId, owner, nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(10);
      await kaiCoin.connect(otherAccount).approve(nftDutchAuction.address, 220);
      await expect(nftDutchAuction.connect(otherAccount).bid(220)).to.be.revertedWith("Low bid");
      expect(await stickyMonster.ownerOf(tokenId)).to.equal(owner.address);
    });
    it('Should accept a bid that is higher than currentPrice', async function () {
      const { kaiCoin, stickyMonster, tokenId, nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(10);
      await kaiCoin.connect(otherAccount).approve(nftDutchAuction.address, 250);
      await expect(nftDutchAuction.connect(otherAccount).bid(250)).to.emit(nftDutchAuction, "BidAccepted").withArgs(otherAccount.address);
      await expect(await stickyMonster.ownerOf(tokenId)).to.equal(otherAccount.address);
    });
    it("Should revert the bid when the auction is over", async function () {
      const { kaiCoin, nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(101);
      await kaiCoin.connect(otherAccount).approve(nftDutchAuction.address, 1000);
      await expect(nftDutchAuction.connect(otherAccount).bid(1000)).to.be.revertedWith("Auction is over");
    });
    it("Should bid at the reservePrice when the auction is passing a certain amount of time", async function () {
      const { kaiCoin, nftDutchAuction, otherAccount } = await loadFixture(deployNFTDutchAuctionFixture);
      await time.advanceBlock(97);
      await kaiCoin.connect(otherAccount).approve(nftDutchAuction.address, 250);
      await expect(nftDutchAuction.connect(otherAccount).bid(250)).to.emit(nftDutchAuction, "BidAccepted").withArgs(otherAccount.address);
    });
  });
});

describe("KaiCoin", function () {
  async function deployKaiCoinFixture() {
    const [owner, otherAccount] = await ethers.getSigners();
    const KaiCoin = await ethers.getContractFactory("KaiCoin");
    const kaiCoin = await KaiCoin.deploy();
    return { kaiCoin, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { kaiCoin, owner } = await loadFixture(deployKaiCoinFixture);
      expect(await kaiCoin.owner()).to.equal(owner.address);
    });
    it("Should mint the right amount to the otherAccount", async function () {
      const { kaiCoin, owner, otherAccount } = await loadFixture(deployKaiCoinFixture);
      await kaiCoin.mint(otherAccount.address, 1000);
      expect(await kaiCoin.balanceOf(otherAccount.address)).to.equal(1000);
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
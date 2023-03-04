// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFTDutchAuction_ERC20Bids is Initializable {

    // numBlocksAuctionOpen: the number of blockchain blocks that the auction is open for
    uint public numBlocksAuctionOpen;
    // offerPriceDecrement: the amount of wei that the auction price should decrease by during each subsequent block.
    uint public offerPriceDecrement;
    // reservePrice: the minimum amount of wei that the seller is willing to accept for the item
    uint public reservePrice;
    uint public initialPrice;
    // the block number that the auction was deployed
    uint public auctionStartBlock;
    // the owner is the seller
    address payable public owner;
    address public erc721TokenAddress;
    uint256 public nftTokenId;
    address public erc20TokenAddress;
    event BidAccepted(address bidder);

    function initialize(address _erc20TokenAddress, address _erc721TokenAddress, uint256 _nftTokenId, uint256 _reservePrice, uint256 _numBlocksAuctionOpen, uint256 _offerPriceDecrement) public initializer {
        erc721TokenAddress = _erc721TokenAddress;
        erc20TokenAddress = _erc20TokenAddress;
        nftTokenId = _nftTokenId;
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        owner = payable(msg.sender);
        auctionStartBlock = block.number;
        initialPrice = _reservePrice + (_numBlocksAuctionOpen * _offerPriceDecrement);
    }

    // bid can be called by anyone to place a bid
    function bid(uint256 _amount) public returns(address) {
        // if the auction is over, the bid is reverted
        require(block.number <= auctionStartBlock + numBlocksAuctionOpen, "Auction is over");
        // calculate the current price
        uint currentPrice = initialPrice - ((block.number - auctionStartBlock) * offerPriceDecrement);
        require(_amount >= currentPrice, "Low bid");
        // require that the NFT is approved for this contract
        require(IERC721(erc721TokenAddress).getApproved(nftTokenId) == address(this), "NFT not approved for auction");
        // bid is accepted, transfer erc20 token to owner
        require(IERC20(erc20TokenAddress).transferFrom(msg.sender, owner, _amount), "ERC20 transfer failed");
        // transfer NFT to bidder
        IERC721(erc721TokenAddress).transferFrom(owner, msg.sender, nftTokenId);
        emit BidAccepted(msg.sender);
        return msg.sender;
    }
}

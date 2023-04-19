# INFO7500-Dutch-Auction

[Project Document](https://docs.google.com/document/d/10-0lEhYjDM5ehVzkOWywOMjiM7RsvWa-enAhkW3SYk0)

## v1.0

The BasicDutchAuction.sol contract works as follows:
1. The seller instantiates a DutchAuction contract to manage the auction of a single, physical item at a single auction event. 
2. The seller is the owner of the contract. 
3. The auction begins at the block in which the contract is created. 
4. The initial price of the item is derived from reservePrice, numBlocksAuctionOpen, and  offerPriceDecrement: initialPrice = reservePrice + numBlocksAuctionOpen*offerPriceDecrement 
5. A bid can be submitted by any Ethereum externally-owned account. 
The first bid processed by the contract that sends wei greater than or equal to the current price is the  winner. The wei should be transferred immediately to the seller and the contract should not accept  any more bids. All bids besides the winning bid should be refunded immediately. 

## v2.0

V2.0 achieved the following:
1. NFT auction support
2. Upgrade ability of the auction contract

## v3.0
v3.0 achieved the following:
1. Bid with ERC20 Token instead of ETH
2. Creation of ERC20 Token KaiCoin

## v4.0
v4.0 implemented UI for the auction contract.

Please compile the contract before running the UI locally.

## v5.0
The contract is deployed to 0x95f23A9607259b57D6cB496eF87DA142dF7ec0a8 on Goerli testnet.

The UI CID is ipfs://QmV7QSxzxnkrhfUKP7veo8mKps1pXk4fCSQZn1E768XRoi
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

## Uniswap Upgrade Project
Document: https://docs.google.com/document/d/1mqLppH5YFeAYg_EgVZrspnFf02tRw0Yc78e-qrtFqvE

Coverage:
| File                         | % Lines          | % Statements     | % Branches     | % Funcs        |
|------------------------------|------------------|------------------|----------------|----------------|
| script/Counter.s.sol         | 0.00% (0/1)      | 0.00% (0/1)      | 100.00% (0/0)  | 0.00% (0/2)    |
| src/Counter.sol              | 100.00% (2/2)    | 100.00% (2/2)    | 100.00% (0/0)  | 100.00% (2/2)  |
| src/UniswapV2Factory.sol     | 100.00% (12/12)  | 100.00% (17/17)  | 100.00% (6/6)  | 100.00% (1/1)  |
| src/UniswapV2Library.sol     | 100.00% (34/34)  | 96.61% (57/59)   | 87.50% (14/16) | 100.00% (8/8)  |
| src/UniswapV2Pair.sol        | 95.52% (64/67)   | 95.56% (86/90)   | 82.14% (23/28) | 100.00% (8/8)  |
| src/UniswapV2Router.sol      | 93.02% (40/43)   | 94.83% (55/58)   | 77.27% (17/22) | 100.00% (7/7)  |
| src/libraries/Math.sol       | 88.89% (8/9)     | 90.00% (9/10)    | 75.00% (3/4)   | 100.00% (2/2)  |
| src/libraries/UQ112x112.sol  | 0.00% (0/2)      | 0.00% (0/2)      | 100.00% (0/0)  | 0.00% (0/2)    |
| test/UniswapV2Pair.t.sol     | 93.33% (14/15)   | 89.47% (17/19)   | 66.67% (4/6)   | 100.00% (4/4)  |
| test/mocks/ERC20Mintable.sol | 0.00% (0/1)      | 0.00% (0/1)      | 100.00% (0/0)  | 0.00% (0/1)    |
| Total                        | 93.55% (174/186) | 93.82% (243/259) | 81.71% (67/82) | 86.49% (32/37) |
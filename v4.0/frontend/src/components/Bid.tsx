// import { AbstractConnector } from '@web3-react/abstract-connector';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import {  ChangeEvent, ReactElement, useState } from 'react';
import { Provider } from '../utils/provider';
import { ethers } from 'ethers';
import BasicDutchAuctionArtifact from '../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';

  function getErrorMessage(error: Error): string {
    let errorMessage: string;
  
    switch (error.constructor) {
      case NoEthereumProviderError:
        errorMessage = `No Ethereum browser extension detected. Please install MetaMask extension.`;
        break;
      case UnsupportedChainIdError:
        errorMessage = `You're connected to an unsupported network.`;
        break;
      case UserRejectedRequestError:
        errorMessage = `Please authorize this website to access your Ethereum account.`;
        break;
      default:
        errorMessage = error.message;
    }
  
    return errorMessage;
  }


  export function Bid(): ReactElement {
    const context = useWeb3React<Provider>();
    let [contractAddress, setContractAddress] = useState<string>('');
    let [winner, setWinner] = useState<string>('');
    let [bidAmount, setBidAmount] = useState<number>(0);
    const { error, library } = context;
    

    const handleBid = async () => {
      if(!library || !contractAddress || !bidAmount) {
        window.alert('Please connect to a wallet and enter a contract address and bid amount');
        return;
      }

      const basicDutchAuction = new ethers.Contract(contractAddress, BasicDutchAuctionArtifact.abi, library.getSigner());
      await basicDutchAuction.getInfo();
      const currentPrice = await basicDutchAuction.currentPrice();
      if(bidAmount < currentPrice) {
        window.alert('Your bid must be greater than the current price');
        return;
      }
      try {
             const bid =  await basicDutchAuction.bid({value: ethers.BigNumber.from(bidAmount)});
             await bid.wait();
             if(bid) {
                window.alert('Bid successful');
                try {
                  const winner1 = await basicDutchAuction.winnerAddress();
                  setWinner(winner1);
                } catch(error: any) {
                  window.alert(getErrorMessage(error));
                }
             }
            } catch(error: any) {
              window.alert(getErrorMessage(error));
            }
    }
  
    if (!!error) {
      window.alert(getErrorMessage(error));
    }

    const handleContractAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
      setContractAddress(event.target.value);
    }

    const handleBidAmountChange = (event: any) => {
      setBidAmount(event.target.value);
    }
  
    return (
        <>
            <>
                <>
                    <h1> Contract Details: </h1>
                </>
                <div>
                    <label> Deployed contract address</label>
                    <input onChange={handleContractAddressChange} type="text" value={contractAddress}/>
                    <label> Bid Amount </label>
                    <input type="text" pattern="[0-9]*" onChange={handleBidAmountChange} value={bidAmount} />
                    <span> <button onClick={handleBid}>Bid</button> </span>
                </div>          
                <>
                    <h3> Auction Details: </h3>
                </>

                <div>
                    <label> Winner</label>
                    <input type="text" value={winner} readOnly/>
                </div>
            </>
        </>
    );
  }
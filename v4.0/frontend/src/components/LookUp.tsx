import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import { ethers } from 'ethers';
import {  ChangeEvent, ReactElement, useState } from 'react';
import { Provider } from '../utils/provider';
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


export function LookUpContract(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, error } = context;
  let [reservePriceLookUp, setreservePriceLookUp] = useState<number>();
  let [priceDecrementLookUp, setPriceDecrementLookUp] = useState<number>();
  let [contractAddress, setContractAddress] = useState<string>('');
  let [currentPriceLookUp, setCurrentPrice] = useState<number>();
  let [winner, setWinner] = useState<string>('');
 
  const handleContractAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContractAddress(event.target.value);
  }

  const handleGetInfo = async () => {
    const basicDutchAuction = new ethers.Contract(contractAddress, BasicDutchAuctionArtifact.abi, library);
    const reservePriceLookUp = await basicDutchAuction.reservePrice();
    console.log('reservePriceLookUp: ', reservePriceLookUp);
    const priceDecrementLookUp = await basicDutchAuction.offerPriceDecrement();
    const currentPrice = await basicDutchAuction.currentPrice();
    const winner = await basicDutchAuction.winnerAddress();
    setreservePriceLookUp(reservePriceLookUp.toNumber());
    setPriceDecrementLookUp(priceDecrementLookUp.toNumber());
    setCurrentPrice(currentPrice.toNumber());
    setWinner(winner);
  }

  if (!!error) {
    window.alert(getErrorMessage(error));
  }

  return (
      <>
          <>
              <>
                  <h1> Look Up Contract Details: </h1>
              </>
              <div>
                      <label> Deployed contract address: </label>
                      <input onChange={handleContractAddressChange} type="text" value={contractAddress}/>
                      <span>
                          <button
                            onClick={handleGetInfo}
                          > Show Info</button>
                      </span>
              </div>          
          </>
          <>
              <>
                  <h3> Auction Details: </h3>
              </>

              <div>
                  <label> Winner: </label>
                  <input type="text" value={winner} readOnly/>
                  <label> Current Price: </label>
                  <input type="text" value={currentPriceLookUp} readOnly/>
                  <label> Reserve Price: </label>
                  <input type="text" value={reservePriceLookUp} readOnly/>
                  <label> Price Decrement: </label>
                  <input type="text" value={priceDecrementLookUp} readOnly/>
              </div>
          </>
      </>
  );
}
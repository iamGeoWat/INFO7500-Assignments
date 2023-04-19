import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError
} from '@web3-react/injected-connector';
import { Contract, ethers, Signer } from 'ethers';
import {  ReactElement, useEffect, useState, MouseEvent } from 'react';
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



  export function DeployContract(): ReactElement {
    const context = useWeb3React<Provider>();
    let [reservePrice, setReservePrice] = useState<number>();
    let [auctionBlocks, setAuctionBlocks] = useState<number>();
    let [priceDecrement, setPriceDecrement] = useState<number>();
    const [ basicDutchAuction, setBasicDutchAuction ] = useState<Contract>();
    let [contractAddress, setContractAddress] = useState<string>('');
    const [signer, setSigner] = useState<Signer>();
    const { library, active, error } = context;
    
  
    if (!!error) {
      window.alert(getErrorMessage(error));
    }

    useEffect((): void => {
      if (!library) {
        setSigner(undefined);
        return;
      }
  
      setSigner(library.getSigner());
    }, [library]);

    useEffect((): void => {
      if (!basicDutchAuction) {
        return;
      }
  
      async function getBDA(basicDutchAuction: Contract): Promise<void> {
      }
  
      getBDA(basicDutchAuction);
    }, [basicDutchAuction]);
  
    function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
      event.preventDefault();
  
      if (basicDutchAuction || !signer) {
        return;
      }
  
      async function deployBDAContract(signer: Signer): Promise<void> {
        const BasicDutchAuction = await new ethers.ContractFactory(
          BasicDutchAuctionArtifact.abi,
          BasicDutchAuctionArtifact.bytecode,
          signer
        );

        if(!reservePrice || !auctionBlocks || !priceDecrement) {
          window.alert('Please enter all the values');
          return;
        }
  
        try {
          const BasicDutchAuctionContract = await BasicDutchAuction.deploy(reservePrice, auctionBlocks, priceDecrement); 
  
          await BasicDutchAuctionContract.deployed();
  
          setBasicDutchAuction(BasicDutchAuctionContract);
  
          window.alert(`Basic Dutch Auction deployed to: ${BasicDutchAuctionContract.address}`);
  
          setContractAddress(BasicDutchAuctionContract.address);
        } catch (error: any) {
          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          );
        }
      }
  
      deployBDAContract(signer);
    }

    const handleReservePriceChange = (event: any) => {
      setReservePrice(event.target.value);
    }

    const handleAuctionBlocksChange = (event: any) => {
      setAuctionBlocks(event.target.value);
    }

    const handlePriceDecrementChange = (event: any) => {
      setPriceDecrement(event.target.value);
    }

    return (
      <>
          <>
              <h1> Deploy Contract : </h1>
          </>
          <div>
            <label> Reserve Price </label>
            <input type="text" pattern="[0-9]*" onChange={handleReservePriceChange} value={reservePrice} />
            <label> Auction Blocks </label>
            <input type="text" pattern="[0-9]*" onChange={handleAuctionBlocksChange} value={auctionBlocks} />
            <label> Price Decrement </label>
            <input type="text" pattern="[0-9]*" onChange={handlePriceDecrementChange} value={priceDecrement} />
          </div>

          <div>
                <button
                  disabled={!active || !!basicDutchAuction ? true : false}
                  style={{
                    cursor: !active || basicDutchAuction ? 'not-allowed' : 'pointer',
                    borderColor: !active || basicDutchAuction ? 'unset' : 'blue'
                  }}
                  onClick={handleDeployContract}
                > Deploy Basic Dutch Auction</button>
          </div>

          <div>
            <label> Deployed contract address : </label>
            <input type="text" value={contractAddress} readOnly/>
          </div>
      </>
    );
  }
import { ReactElement } from 'react';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { DeployContract } from './components/DeployContract';
import { LookUpContract } from './components/LookUp';
import { Bid } from './components/Bid';
import SectionDivider from './components/SectionDivider';
import { WalletStatus } from './components/WalletStatus';

export function App(): ReactElement {
  return (
    <div>
      <ActivateDeactivate />
      <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <DeployContract />
      <SectionDivider />
      <LookUpContract />
      <SectionDivider />
      <Bid />
    </div>
  );
}

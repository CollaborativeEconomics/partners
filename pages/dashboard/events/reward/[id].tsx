import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import Dashboard from 'components/dashboard';
import Sidebar from 'components/sidebar';
import Title from 'components/title';
import ButtonBlue from 'components/buttonblue';
import { getEventById } from 'utils/registry';
import styles from 'styles/dashboard.module.css';
import { useConnect, useAccount, useWriteContract } from 'wagmi';
import { waitForTransactionReceipt } from '@wagmi/core';
import { arbitrumSepolia } from 'wagmi/chains';
import { config } from 'chains/config';
import { DistributorAbi } from 'chains/contracts/volunteers/abis';
import { getRegisteredAddresses, getReportedAddresses } from 'chains/logs';
import { getContract } from 'utils/registry';

export async function getServerSideProps(context) {
  const id = context.query.id;
  const event = await getEventById(id);
  console.log('EVENT', event);
  const redirect = {
    redirect: { destination: '/dashboard/events', permanent: false },
  };
  if (!event) {
    return redirect;
  }
  const resNFT = await getContract(id, 'arbitrum', 'testnet', '1155');
  const contractNFT = !resNFT.error && resNFT.length > 0 ? resNFT[0] : null;
  console.log('NFT', contractNFT);
  if (!contractNFT) {
    return redirect;
  }
  const resV2E = await getContract(id, 'arbitrum', 'testnet', 'V2E');
  const contractV2E = !resV2E.error && resV2E.length > 0 ? resV2E[0] : null;
  console.log('V2E', contractV2E);
  if (!contractV2E) {
    return redirect;
  }
  const volunteers = await getRegisteredAddresses(
    contractNFT.contract_address,
    contractNFT.start_block,
  );
  return { props: { id, event, volunteers, contractNFT, contractV2E } };
}

export default function Page({
  id,
  event,
  volunteers,
  contractNFT,
  contractV2E,
}) {
  console.log('EVENT ID', id);
  const [device, setDevice] = useState(null);
  const [message, setMessage] = useState('Start the disbursement process');
  const { data: hash, writeContractAsync } = useWriteContract({ config });
  const { connectors, connect } = useConnect();
  const payrate = event?.payrate || 1;
  const unitlabel = event?.unitlabel || '';
  var total = 0;
  // TODO: move to config file
  const currentChain = arbitrumSepolia;
  const account = useAccount();

  async function onMint() {
    const nft: `0x${string}` = contractNFT.contract_address;
    const distributor: `0x${string}` = contractV2E.contract_address;

    if (!account.isConnected) {
      console.error('User not connected');
      setMessage('User not connected');
      return;
    }

    try {
      // Call distributeTokensByUnit function
      const registered = volunteers.map(it => it.address);
      const hash = await writeContractAsync({
        address: distributor as `0x${string}`,
        abi: DistributorAbi,
        functionName: 'distributeTokensByUnit',
        args: [registered],
        chain: currentChain,
        account: account.address,
      });

      const distributionReceipt = await waitForTransactionReceipt(config, {
        hash,
        confirmations: 2,
      });

      console.log('Tokens distributed successfully');
      setMessage('Tokens distributed successfully');
    } catch (error) {
      console.error('Reward distribution error:', error);
    }
  }

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.mainBox}>
          <Title text="VOLUNTEER TO EARN" />
          <h1>{event.name}</h1>
          <div className="w-full p-4 mt-2">
            <h1 className="my-2">Volunteers</h1>
            <table className="w-full">
              <thead>
                <tr className="text-slate-400">
                  <th align="left">Address</th>
                  <th align="right">Payment</th>
                </tr>
              </thead>
              <tbody className="border-t-2">
                {volunteers?.length &&
                  volunteers?.map(item => {
                    //console.log('ITEM')
                    total += parseInt(item.amount);
                    return (
                      <tr key={item.id}>
                        <td>{item.address.toLowerCase()}</td>
                        <td align="right">${item.amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot className="border-t-2">
                <tr>
                  <td colSpan={2} align="right">
                    Total ${total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="w-full mb-2 flex flex-row justify-between">
            <ButtonBlue
              id="buttonSubmit"
              text="REWARD VOLUNTEERS"
              onClick={onMint}
            />
          </div>
          <p id="message" className="mb-6 center">
            {message}
          </p>
        </div>
      </div>
    </Dashboard>
  );
}

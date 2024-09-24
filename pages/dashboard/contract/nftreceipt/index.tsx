import Dashboard from 'components/dashboard'
import Sidebar from 'components/sidebar'
import ContractNFTReceipt from 'components/contract-nftreceipt'
import { apiFetch } from 'utils/api'
import styles from 'styles/dashboard.module.css'

export async function getServerSideProps(context) {
  console.log('QUERY', context.query)
  const { chain, network, wallet, organizationId } = context.query
  const organization = await apiFetch('organization?id='+organizationId)
  return { props: { chain, network, wallet, organizationId, organization } }
}

export default function Page(props) {
  const { chain, network, wallet, organizationId, organization } = props

  return (
    <Dashboard>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.mainBox}>
          <ContractNFTReceipt chain={chain} network={network} wallet={wallet} organizationId={organizationId} organization={organization} />
        </div>
      </div>
    </Dashboard>
  )
}

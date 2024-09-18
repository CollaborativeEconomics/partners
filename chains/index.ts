import Arbitrum from './deployers/arbitrum'
import Stellar  from './deployers/stellar'
import Starknet from './deployers/starknet'

type Dictionary = { [key:string]:any }

const Chains:Dictionary = { 
  Arbitrum,
  Stellar,
  Starknet
}
export function ChainsList(){
  return Object.keys(Chains)
}

export default Chains
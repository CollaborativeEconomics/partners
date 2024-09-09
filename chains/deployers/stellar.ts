import { BASE_FEE, Account, Address, Asset, Contract, Horizon, Keypair, Networks, Operation, SorobanDataBuilder, SorobanRpc, Transaction, TransactionBuilder, nativeToScVal, scValToNative } from '@stellar/stellar-sdk'
import { signTransaction, WatchWalletChanges } from "@stellar/freighter-api"
import Wallet from 'chains/wallets/freighter'
import { randomNumber } from 'utils/random'

export const networks = {
  mainnet: {
    name: 'public',
    passphrase: 'Public Global Stellar Network ; September 2015',
    horizon: 'https://horizon.stellar.org',
    soroban: 'https://mainnet.stellar.validationcloud.io/v1/QW6tYBRenqUwP8d9ZJds44Dm-txH1497oDXcdC07xDo'
    //soroban: 'https://soroban-mainnet.nownodes.io/32b582fb-d83b-44fc-8788-774de28395cb'
    //soroban: 'https://small-shy-borough.stellar-mainnet.quiknode.pro/53e6763ed40e4bc3202a8792d6d2d51706052755/'
  },
  futurenet: {
    name: 'futurenet',
    passphrase: 'Test SDF Future Network ; October 2022',
    horizon: 'https://horizon-futurenet.stellar.org',
    soroban: 'https://rpc-futurenet.stellar.org'
  },
  testnet: {
    name: 'testnet',
    passphrase: 'Test SDF Network ; September 2015',
    horizon: 'https://horizon-testnet.stellar.org',
    soroban: 'https://soroban-testnet.stellar.org'
  }
}


async function clientSign(xdr: string, network: string, address: string){
  const url = "https://horizon-testnet.stellar.org"
  const server = new Horizon.Server(url)
  const signed = await signTransaction(xdr, { networkPassphrase: networks[network].passphrase, address })
  if (signed.error) {
    throw new Error(signed.error)
  } else {
    const signedXdr = signed.signedTxXdr
    const submit = TransactionBuilder.fromXDR(signedXdr, url)
    const response = await server.submitTransaction(submit)
    return response
  }
}

async function watcher(callback){
  const Watcher = new WatchWalletChanges(1000)

  Watcher.watch((watcherResults) => {
    console.log("Address", watcherResults.address)
    console.log("Network", watcherResults.network)
    console.log("PPhrase", watcherResults.networkPassphrase)
    callback(watcherResults.address, watcherResults.network, watcherResults.networkPassphrase)
  })

  setTimeout(() => {
    Watcher.stop() // after 30 seconds, stop watching
  }, 30000)
}






// -- deploy --deployer GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C --wasm_hash d433b471c3959a9d87702b3648a2214f2c8c8d716a000ae2c6e13be9bb68ad51 --salt 1234567890 --init_fn init --init_args '[{"u32":123}]'
// credits contract constructor: initialize(e: Env, admin: Address, initiative: u128, provider: Address, vendor: Address, bucket: i128, xlm: Address) {
// VARS [deployer, wasm_hash, salt, init_fn, init_args]
// ARGS [admin, initiative, provider, vendor, bucket, xlm]
async function deployCredits(args:[any]) {
  try {
    const network = networks.testnet // TODO: get from config
    const soroban = new SorobanRpc.Server(network.soroban, { allowHttp: true })
    const wallet = new Wallet()
    await wallet.init()
    const info = await wallet.connect()
    console.log('WALLET', info)
    console.log('-- Deploying')
    const factory = 'CAKN7QXAWAUTTK5BOLL7WQGJHSDPX66RDREBRUSHIYCZYS27YFPCD43O' // TODO: get contract factory id from DB
    const orgwallet = 'GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C' // TODO: get from freighter wallet
    const deployer = new Address(orgwallet).toScVal()
    const wasm_hash = nativeToScVal('d44487d42355ac978ddb16c28ac4672d91771e918bab07e2cc4c768e7f6fcee6') // TODO: get from contract info
    const salt = nativeToScVal(randomNumber(10))
    const init_fn = nativeToScVal('initialize', {type: 'symbol'})
    // Credits contract initializer arguments
    const owner = 'GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C' // TODO: get from args[0]
    const admin = new Address('GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C').toScVal() // TODO: get from args[0]
    const initiative = nativeToScVal(1, {type: 'u128'}) // get from args[1]
    const provider = new Address('GCFED2OC5W2S46UYVUY6K3CDFXTCIY2FHU3RN2FM4P2WT224OYTTJXUL').toScVal() // TODO: get from args[2]
    const vendor = new Address('GAXSRTCK6PFIQHNULHBEJOI4VV2T7YS7SZCXBP6CGGYRI56LCWWMZO7I').toScVal() // TODO: get from args[3]
    const bucket = nativeToScVal(20*10000000, { type: 'i128' }) // TODO: get from args[4]
    const xlm = new Address('CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC').toScVal() // TODO: constant from config or args[5]
    const init_args = nativeToScVal([admin, initiative, provider, vendor, bucket, xlm], {type: 'array'})

/*
  [
      StellarSdk.xdr.ScVal.scvAddress(StellarSdk.Address.fromString(admin)),
      StellarSdk.xdr.ScVal.scvU32(decimal),
      StellarSdk.xdr.ScVal.scvString(name),
      StellarSdk.xdr.ScVal.scvString(symbol)
  ]
*/
    //const init_args = []
    //const init_args = []
    //const args = {deployer, wasm_hash, salt, init_fn, init_args}
    const args = [deployer, wasm_hash, salt, init_fn, init_args]
    //const args = ['GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C', 'd44487d42355ac978ddb16c28ac4672d91771e918bab07e2cc4c768e7f6fcee6', randomNumber(10), 'initialize' ]
    console.log('ARGS', args)
    const ctr = new Contract(factory)
    console.log('CTR', ctr)
    const op = ctr.call('deploy', ...args)
    //const op = ctr.call('donate', args)
    console.log('OP', op)
    //const account = await horizon.loadAccount(admin)
    const account = await soroban.getAccount(owner)
    console.log('ACT', account)
    //const base = await horizon.fetchBaseFee()
    //const fee = base.toString()
    const fee = BASE_FEE
    const trx = new TransactionBuilder(account, {fee, networkPassphrase: network.passphrase})
      .addOperation(op)
      .setTimeout(30)
      .build()
    console.log('TRX', trx)
    //window.trx = trx
    const sim = await soroban.simulateTransaction(trx);
    console.log('SIM', sim)
    //window.sim = sim
    if (SorobanRpc.Api.isSimulationSuccess(sim) && sim.result !== undefined) {
      console.log('RES', sim.result)
      // Now prepare it???
      let xdr = ''
      let firstTime = false // for now
      if(firstTime){
        // Increment tx resources to avoid first time bug
        console.log('FIRST')
        //const sorobanData = new SorobanDataBuilder()
        const sorobanData = sim.transactionData
        console.log('SDATA1', sorobanData)
        //window.sdata1 = sorobanData
        //sorobanData.readBytes += '60'
        const rBytes = sorobanData['_data'].resources().readBytes() + 60
        const rFee = (parseInt(sorobanData['_data'].resourceFee()) + 100).toString()
        sorobanData['_data'].resources().readBytes(rBytes)
        sorobanData.setResourceFee(rFee)
        const sdata = sorobanData.build()
        //window.sdata2 = sorobanData
        console.log('SDATA2', sorobanData)
        const fee2 = (parseInt(sim.minResourceFee) + 100).toString()
        //const fee2 = (parseInt(BASE_FEE) + 100).toString()
        console.log('FEE2',fee2)
        //const trz = trx.setSorobanData(sdata).setTransactionFee(fee2).build()
        const account2 = await soroban.getAccount(owner)
        const trz = new TransactionBuilder(account2, {fee:fee2, networkPassphrase: network.passphrase})
          .setSorobanData(sdata)
          .addOperation(op)
          .setTimeout(30)
          .build()
        console.log('TRZ',trz)
        //window.trz = trz
        const txz = await soroban.prepareTransaction(trz)
        console.log('TXZ',txz)
        xdr = txz.toXDR()
      } else {
        const txp = await soroban.prepareTransaction(trx)
        console.log('TXP',txp)
        xdr = txp.toXDR()
      }
      console.log('XDR', xdr)
      // Now sign it???
      const opx = {networkPassphrase: network.passphrase}
      //const opx = {network:network.name, networkPassphrase: network.passphrase, accountToSign: from}
      console.log('OPX', opx)
      //const res = await wallet.signAndSend(xdr, opx)
      const sgn = await signTransaction(xdr, opx)
      console.log('SGN', sgn)
      // Now send it?
      const txs = TransactionBuilder.fromXDR(sgn.signedTxXdr, network.passphrase) // as Tx
      console.log('TXS', txs)
      //const six = await soroban.simulateTransaction(txs)
      //console.log('SIX', six)
      //const prep = await soroban.prepareTransaction(six)
      //console.log('PREP', prep)
      ////const res = await soroban.sendTransaction(sgn)
      //const res = await soroban.sendTransaction(txs)
      const res = await soroban.sendTransaction(txs)
      console.log('RES', res)
      console.log('JSN', JSON.stringify(res,null,2))

      const txid = res?.hash || ''
      console.log('TXID', txid)
      if(res?.status.toString() == 'ERROR'){
        console.log('TX ERROR')
        return {success:false, txid, error:'Error deploying contract (950)'} // get error
      }
      if(res?.status.toString() == 'SUCCESS'){
        console.log('TX SUCCESS')
        return {success:true, txid, error:null}
      } else {
        // Wait for confirmation
        const secs = 1000
        const wait = [2,2,2,3,3,3,4,4,4,5,5,5,6,6,6] // 60 secs / 15 loops
        let count = 0
        let info = null
        while(count < wait.length){
          console.log('Retry', count)
          await new Promise(res => setTimeout(res, wait[count]*secs))
          count++
          info = await soroban.getTransaction(txid)
          console.log('INFO', info)
          if(info.status=='ERROR') {
            console.log('TX FAILED')
            return {success:false, txid, error:'Error deploying contract (951)', extra:info} // get error
          }
          if(info.status=='NOT_FOUND' || info.status=='PENDING') {
            continue // Not ready in blockchain?
          }
          if(info.status=='SUCCESS'){
            console.log('TX SUCCESS2')
            return {success:true, txid, error:null}
          } else {
            console.log('TX FAILED2')
            return {success:false, txid, error:'Error deploying contract (952)', extra:info} // get error
          }
        }
        return {success:false, txid, error:'Error deploying contract - timeout (953)'} // get error
      }
    } else {
      console.log('BAD', sim)
      return {success:false, txid:'', error:'Error deploying contract - bad simulation (954)'} // get error
    }
  } catch(ex) {
    console.log('ERROR', ex)
    return {error:ex.message}
  }
}



class StellarContracts {
  contracts = {
    Credits: {
      deploy: async (args)=>{
        const res = await deployCredits(args)
        return res
      }
    }
  }
}

const Stellar = new StellarContracts()

export default Stellar
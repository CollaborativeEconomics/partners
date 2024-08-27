// Get all registered addresses in 1155 contract for token #1
export async function getRegisteredAddresses(contract){
  const topics = ['1'] // TODO: get topic from contract.event
  const block = '0x43fb584'
  const logs = await getLogs(contract, topics, block)
  if(logs?.error){
    return {success:false, error: logs?.error?.message || 'Error fetching logs'}
  }
  // Parse addresses
  // event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
  let data = []
  let nftid = 0
  let value = 0
  for (let item of logs.result) {
    nftid = parseInt(item.data.substr(0,66))
    if(nftid!==1){ continue }
    data.push('0x'+item.topics[3].substr(26)) // topic 3 is recipient address
  }
  return {success:true, data}
}

// Get all reported addresses in 1155 contract for token #2
export async function getReportedAddresses(contract, block){
  const topics = ['2'] // TODO: get topic from contract.event
  // const block = '0x43fb584'
  const logs = await getLogs(contract, topics, block)
  if(logs?.error){
    return {success:false, error: logs?.error?.message || 'Error fetching logs'}
  }
  // Parse addresses
  // event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
  let data = []
  let nftid = 2
  let value = 0
  for (let item of logs.result) {
    nftid = parseInt(item.data.substr(0,66))
    value = parseInt(item.data.substr(66))
    if(nftid!==2){ continue }
    data.push('0x'+item.topics[3].substr(26)) // topic 3 is recipient address
  }
  return {success:true, data}
}

// contract address, array of topics to search for, and starting block
async function getLogs(address, topics, fromBlock){
  try {
    const url = process.env.PROVIDER_URL
    const payload = {
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getLogs',
      params: [
        {
          address,
          topics,
          fromBlock,
          toBlock: 'latest'
        }
      ]
    };
    //console.log('LOGS', url, payload)
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
    let result = await fetch(url, options)
    let data = await result.json()
    //return data.result[0].topics
    return data.result
  } catch (ex) {
    console.error(ex)
    return { error: ex.message }
  }
}


/*
// RESULT EXAMPLE
// Topics start with the event kecak256 and then three indexed topics (usually addresses)
// Data field contains the remaining topics joined divisible by type length
{
  jsonrpc: '2.0',
  id: 1,
  result: [
    {
      address: '0x7209b809e591460f5442c976b6f29c6ff963b867',
      blockHash: '0xb7e1c8e9bda283ea30b39d0651a3af159d7332de863b764e1b6583c2ff6192f1',
      blockNumber: '0x43fb585',
      data: '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001',
      logIndex: '0xc',
      removed: false,
      topics: [
        '0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62',
        '0x0000000000000000000000007b94c009af223825bcc8a326cfb0ed9acbc490fc',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000007b94c009af223825bcc8a326cfb0ed9acbc490fc'
      ],
      transactionHash: '0xe8e6bddc73dd3edea8bdbad56c48f788031117f657237cf102c3738e30bd8919',
      transactionIndex: '0x1'
    }
  ]
}

// ERROR EXAMPLE
{
  jsonrpc: '2.0',
  id: 1,
  error: {
    code: -32000,
    message: 'One of the blocks specified in filter (fromBlock, toBlock or blockHash) cannot be found.'
  }
}
*/

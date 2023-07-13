import { NextApiRequest, NextApiResponse } from 'next'

// api/test
export default async function test(req: NextApiRequest, res: NextApiResponse) {
  //console.log('SERVER', server)
  //const { searchParams } = new URL(request.url)
  //const id = searchParams.get('id')
  //console.log('REQ', request)
  //console.log('URL', request.url)
  //console.log('MET', request.method)
  //console.log('HDR', request.headers)
  //console.log('HDR', request.headers.get('host'))
  //console.log('BOD', request.body)
  //console.log('CTX', context)
  //console.log('PRM', context.params)  // test/user/1234
  //console.log('QRY', request.nextUrl.searchParams)
  //console.log('QRY', request.nextUrl.searchParams.get('id'))  // test?id=123
  //console.log('COK', request.cookies.get('g_state').value)
  //redirect('https://nextjs.org/')
  return res.json({success:true})
}

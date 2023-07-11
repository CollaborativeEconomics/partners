import { NextRequest, NextResponse } from 'next/server'
import { getNFTsByOrganization } from '~/utils/registry'

export async function GET(request: NextRequest) {
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

  const orgid = request['nextUrl'].searchParams.get('orgid')
  console.log('ORGID', orgid)
  if(!orgid){
    return NextResponse.json({success:false, result:null, error:'Required parameters missing'})
  }
  const data = await getNFTsByOrganization(orgid)
  return NextResponse.json({success:true, result:data})
}

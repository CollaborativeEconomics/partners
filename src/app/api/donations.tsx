import { NextRequest, NextResponse } from 'next/server'
import { getNFTsByOrganization } from '~/utils/registry'

export async function GET(request: NextRequest) {
  const url = request['nextUrl']
  const orgid = url.searchParams.get('orgid')
  console.log('ORGID', orgid)
  if(!orgid){
    return NextResponse.json({success:false, result:null, error:'Required parameters missing'})
  }
  const data = await getNFTsByOrganization(orgid)
  return NextResponse.json({success:true, result:data})
}

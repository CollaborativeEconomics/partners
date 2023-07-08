import { NextResponse } from 'next/server'
//import { redirect } from 'next/navigation'

// api/test
export async function GET(request: Request, context) {
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
  return NextResponse.json({success:true})
}

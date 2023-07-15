//import { NextApiRequest, NextApiResponse } from 'next/server'
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//import FacebookProvider from "next-auth/providers/facebook"
//import GithubProvider from "next-auth/providers/github"
//import TwitterProvider from "next-auth/providers/twitter"
//import Auth0Provider from "next-auth/providers/auth0"
//import Adapter from './adapter.ts' // TESTING
import { getUserByEmail, getOrganizationByEmail } from 'utils/registry'

const googleId = process.env.GOOGLE_CLIENT_ID || ''
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || ''

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  //adapter: Adapter(),
  providers: [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret
    })
  /*
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0",
    })
  */
  ],
  callbacks: {
    async jwt({ token }) {
      //console.log('JWT TOKEN', token)
      //token.userRole = "admin"
      // TODO: RETHINK
      if(token?.email){
        const user = await getUserByEmail(token.email)
        if(user && user.type==9){
          //console.log('ADMIN!')
          token.userRole = 'admin'
          token.orgid = '636283c22552948fa675473c'
        } else if(token.userRole!='admin'){
          //console.log('NOT ADMIN!')
          const org = await getOrganizationByEmail(token.email)
          token.orgid = org?.id || ''
        }
      }
      //console.log('JWT TOKEN', token)
      return token
    }
  }
}

export default NextAuth(authOptions)

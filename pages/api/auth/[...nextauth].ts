//import { NextApiRequest, NextApiResponse } from 'next/server'
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//import FacebookProvider from "next-auth/providers/facebook"
//import GithubProvider from "next-auth/providers/github"
//import TwitterProvider from "next-auth/providers/twitter"
//import Auth0Provider from "next-auth/providers/auth0"

const googleId = process.env.GOOGLE_CLIENT_ID || ''
const googleSecret = process.env.GOOGLE_CLIENT_SECRET || ''

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
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
      return token
    }
  }
}

export default NextAuth(authOptions)

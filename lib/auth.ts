import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  throw new Error("Google client ID/secret not set in environment variables.")
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
    }),
    //Email and Password Login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password){
          return null
        } 

        // Look up user in Supabase
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single()
      

        if (error || !user) return null

        // Compare password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) return null

        // Return user object (gets stored in the token)
        return {
          id: user.id,
          email: user.email,
          username: user.username,
        }
      },
    }),
  ],

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 30*24*60*60, // 30days
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options:{
        httpOnly: true,
        sameSite: "lax",
        path:"/",
        secure: process.env.NODE_ENV==="production",
        maxAge: 30* 24 * 60 *60,
      }
    }
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { data: existingUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", user.email)
          .single()

        if (!existingUser) {
          const { data: newUser } = await supabase
            .from("users")
            .insert({ email: user.email, username: user.name, password: null })
            .select("id")
            .single()

          // Write the DB id back onto the user object so jwt() can pick it up
          if (newUser) user.id = newUser.id
        } else {
          user.id = existingUser.id // Same for existing Google users
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user){
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
}

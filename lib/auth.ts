import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUserByEmail, findUserById, upsertGoogleUser } from '@/lib/users'

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      onboardingDone?: boolean
      isAdmin?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    onboardingDone?: boolean
    isAdmin?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = findUserByEmail(credentials.email)
        if (!user?.hashedPassword) return null
        const match = await bcrypt.compare(credentials.password, user.hashedPassword)
        if (!match) return null
        return { id: user.id, name: user.name, email: user.email, image: user.image ?? null }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          upsertGoogleUser({
            id: 'google_' + user.id,
            name: user.name ?? '',
            email: user.email ?? '',
            image: user.image,
          })
        } catch {
          // Don't block login on file-write errors
        }
      }
      return true
    },

    async jwt({ token, user, account, trigger }) {
      // On session refresh triggered by client update()
      if (trigger === 'update') {
        const dbUser = findUserById(token.sub as string)
        if (dbUser) {
          token.onboardingDone = dbUser.onboardingDone
          token.isAdmin = dbUser.isAdmin
        }
        return token
      }

      // On initial sign-in
      if (user && account) {
        if (account.provider === 'google') {
          // Use prefixed ID so it matches users.json
          token.sub = 'google_' + user.id
        }
        // sub is now correct (google_ prefix or cred_ from credentials)
        const dbUser = findUserById(token.sub as string)
        token.onboardingDone = dbUser?.onboardingDone ?? true
        token.isAdmin = dbUser?.isAdmin ?? false
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.onboardingDone = token.onboardingDone
        session.user.isAdmin = token.isAdmin
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

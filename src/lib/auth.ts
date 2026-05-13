import { NextAuthOptions, type DefaultSession } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
  }
}
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const email = user.email
        if (!email) return false
        try {
          const existing = await prisma.user.findUnique({ where: { email } })

          if (existing) {
            await prisma.user.update({
              where: { email },
              data: { avatar: user.image },
            })
          } else {
            const displayName = (profile as any)?.name || user.name || email.split('@')[0]
            let username = displayName.replace(/\s+/g, '_').toLowerCase()

            // Ensure unique username by appending number if taken
            const existingUsername = await prisma.user.findFirst({
              where: { username },
            })
            if (existingUsername) {
              const suffix = Date.now().toString(36).slice(-4)
              username = `${username}_${suffix}`
            }

            await prisma.user.create({
              data: {
                email,
                username,
                avatar: user.image,
              },
            })
          }
        } catch {
          // DB not available — proceed without creating user record
        }
      }
      return true
    },
    async jwt({ token, trigger }) {
      // Populate token.id from DB whenever it's missing (handles both initial sign-in
      // where signIn callback hasn't run yet, and subsequent requests)
      if (!token.id && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true },
          })
          if (dbUser) {
            token.id = dbUser.id
          }
        } catch {
          // DB not available — session callback handles fallback
        }
      }

      // Refresh on explicit update trigger (e.g. after profile update)
      if (trigger === 'update' && token.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true },
          })
          if (dbUser) {
            token.id = dbUser.id
          }
        } catch {
          // keep existing token.id
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token.id) {
        // Use ID from JWT token (most reliable — set by jwt callback)
        session.user.id = token.id
      } else if (session.user?.email) {
        // Fallback: look up by email
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true },
          })
          if (dbUser) {
            session.user.id = dbUser.id
          }
        } catch {
          if (token.sub) session.user.id = token.sub
        }
      }
      return session
    },
  },
}

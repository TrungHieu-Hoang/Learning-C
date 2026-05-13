import { NextAuthOptions, type DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
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
            await prisma.user.create({
              data: {
                email,
                username: displayName.replace(/\s+/g, '_').toLowerCase(),
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
    async session({ session, token }) {
      if (session.user?.email) {
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

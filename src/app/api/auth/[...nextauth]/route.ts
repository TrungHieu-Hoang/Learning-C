import NextAuth, { type DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { prisma } from '@/lib/prisma'

declare module 'next-auth' {
  interface Session {
    user: { id: string } & DefaultSession['user']
  }
}

const handler = NextAuth({
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
        const name = (profile as any)?.name || user.name || email.split('@')[0]
        try {
          await prisma.user.upsert({
            where: { email },
            update: { avatar: user.image, username: name.replace(/\s+/g, '_').toLowerCase() },
            create: {
              email,
              username: name.replace(/\s+/g, '_').toLowerCase(),
              avatar: user.image,
            },
          })
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
          // fallback: use token.sub
          if (token.sub) session.user.id = token.sub
        }
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }

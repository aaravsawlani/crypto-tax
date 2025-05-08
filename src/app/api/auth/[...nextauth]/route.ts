import NextAuth from "next-auth";
import CoinbaseProvider from "next-auth/providers/coinbase";

const handler = NextAuth({
  providers: [
    CoinbaseProvider({
      clientId: process.env.COINBASE_CLIENT_ID!,
      clientSecret: process.env.COINBASE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "wallet:accounts:read wallet:transactions:read",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST }; 
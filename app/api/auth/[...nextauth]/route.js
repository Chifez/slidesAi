// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            'openid email profile https://mail.google.com/ https://www.googleapis.com/auth/gmail.readonly',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        if (profile) {
          token.email = profile.email;
          token.picture = profile.picture;
          console.log('picute', token?.picture, profile?.picture);
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.email = token.email;
      session.user.image = token.picture;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

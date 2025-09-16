import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    // Temporalmente deshabilitado hasta configurar credenciales
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            // Forzar selección de cuenta y solicitar solo emails USAL
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
            hd: "usal.edu.ar" // Esto permite solo dominios USAL
          },
        },
      })
    ] : [])
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Verificar que el email sea de USAL
      if (user.email && user.email.endsWith("@usal.edu.ar")) {
        return true;
      }
      // Si no es email USAL, rechazar el login
      return false;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// ユーザー認証のためのスキーマ
const loginSchema = z.object({
  username: z.string().min(1, 'ユーザー名は必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'ユーザー名', type: 'text' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // 入力値の検証
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            return null;
          }

          const { username, password } = result.data;

          // KVからユーザー情報を取得
          const users = await kv.get('users') as Record<string, any> || {};
          
          // ユーザー名でユーザーを検索
          const userId = Object.keys(users).find(
            (id) => users[id].username === username
          );

          if (!userId) {
            return null;
          }

          const user = users[userId];

          // パスワードの検証
          const isValid = await bcrypt.compare(password, user.password_hash);
          if (!isValid) {
            return null;
          }

          // 認証成功
          return {
            id: userId,
            name: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('認証エラー:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

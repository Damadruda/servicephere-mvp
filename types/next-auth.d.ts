
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      userType: 'CLIENT' | 'PROVIDER' | 'ADMIN'
      isVerified: boolean
      profile?: any
    }
  }

  interface User {
    id: string
    email: string
    name: string
    userType: 'CLIENT' | 'PROVIDER' | 'ADMIN'
    isVerified: boolean
    profile?: any
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userType: 'CLIENT' | 'PROVIDER' | 'ADMIN'
    isVerified: boolean
    profile?: any
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  
  return NextResponse.json({
    hasUrl: !!dbUrl,
    length: dbUrl?.length || 0,
    first20: dbUrl?.substring(0, 20) || 'NONE',
    last20: dbUrl?.substring(dbUrl.length - 20) || 'NONE',
  });
}

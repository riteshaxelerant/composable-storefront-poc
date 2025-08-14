import { NextRequest, NextResponse } from 'next/server';
import { StrapiApiClient } from '@/lib/strapi/api-client';

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'GraphQL query is required' },
        { status: 400 }
      );
    }

    const client = new StrapiApiClient();
    const result = await client.query(query, variables);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Strapi GraphQL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

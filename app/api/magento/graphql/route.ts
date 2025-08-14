import { NextRequest, NextResponse } from 'next/server';
import { MagentoApiClient } from '@/lib/magento/api-client';

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'GraphQL query is required' },
        { status: 400 }
      );
    }

    const client = new MagentoApiClient();
    const result = await client.query(query, variables);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Magento GraphQL error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

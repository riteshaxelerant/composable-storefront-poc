import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Set SSL certificate bypass for Node.js environment
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const { query, variables } = req.body;

    const response = await fetch(process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL || 'https://shop.axelerators.ai/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Store': 'default',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();
    
    // Reset SSL certificate verification
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

    return res.status(200).json(data);
  } catch (error) {
    console.error('Magento GraphQL API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
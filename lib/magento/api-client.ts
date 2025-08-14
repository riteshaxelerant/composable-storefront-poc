export class MagentoApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MAGENTO_GRAPHQL_URL || 'https://shop.axelerators.ai/graphql';
  }

  async query(query: string, variables: any = {}) {
    try {
      // For development, we might need to handle SSL certificate issues
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Store': 'default',
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      };

      // In development, we can add additional options to handle SSL issues
      if (process.env.NODE_ENV === 'development') {
        // Note: This is for development only - in production, ensure proper SSL certificates
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      const response = await fetch(this.baseUrl, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Magento API error:', error);
      throw error;
    }
  }
}

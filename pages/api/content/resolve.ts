import type { NextApiRequest, NextApiResponse } from 'next';
import { getMiddleware } from '@/lib/middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { slug, context } = req.body;

    if (!slug) {
      return res.status(400).json({ message: 'Slug is required' });
    }

    const middleware = getMiddleware();
    const resolvedContent = await middleware.resolve(slug, context);

    if (resolvedContent) {
      return res.status(200).json({
        success: true,
        content: resolvedContent,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Content not found',
      });
    }
  } catch (error) {
    console.error('[API] Content resolution error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 
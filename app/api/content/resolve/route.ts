import { NextRequest, NextResponse } from 'next/server';
import { getMiddleware } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Slug parameter is required' },
      { status: 400 }
    );
  }

  try {
    const middleware = getMiddleware();
    const resolvedContent = await middleware.resolve(slug);

    if (!resolvedContent) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resolvedContent,
    });
  } catch (error) {
    console.error('Error resolving content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

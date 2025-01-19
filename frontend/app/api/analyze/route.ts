// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import type { ProjectData } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const data: ProjectData = await request.json();

    const response = await fetch('http://localhost:8000/projects/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.detail || 'Failed to analyze project' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { SheetsService } from '@/lib/sheets';

export async function GET() {
  try {
    const sheets = new SheetsService();
    await sheets.initialize();
    const neededItems = await sheets.getNeededItems();
    
    return NextResponse.json({ neededItems });
  } catch (error) {
    console.error('Error fetching needed items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch needed items' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { SheetsService } from '@/lib/sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, item, itemCategory } = body;

    if (!name || !email || !item) {
      return NextResponse.json(
        { error: 'Name, email, and item are required' },
        { status: 400 }
      );
    }

    const sheets = new SheetsService();
    await sheets.initialize();

    // Add the signup
    await sheets.addSignup({
      name,
      email,
      item,
      itemCategory: itemCategory || 'other',
      timestamp: new Date().toISOString()
    });

    // If this item was in the needed items, mark it as taken
    const neededItems = await sheets.getNeededItems();
    const neededItem = neededItems.find(ni => 
      ni.item.toLowerCase() === item.toLowerCase() && !ni.taken
    );
    
    if (neededItem) {
      await sheets.markItemTaken(neededItem.item, name);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding signup:', error);
    return NextResponse.json(
      { error: 'Failed to add signup' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sheets = new SheetsService();
    await sheets.initialize();
    const signups = await sheets.getSignups();
    
    return NextResponse.json({ signups });
  } catch (error) {
    console.error('Error fetching signups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signups' },
      { status: 500 }
    );
  }
}
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

export async function POST(request: Request) {
  try {
    const { item, category, quantityNeeded } = await request.json();
    
    if (!item || !category) {
      return NextResponse.json(
        { error: 'Item and category are required' },
        { status: 400 }
      );
    }

    const sheets = new SheetsService();
    await sheets.initialize();
    await sheets.addNeededItem(item, category, quantityNeeded || 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding needed item:', error);
    return NextResponse.json(
      { error: 'Failed to add needed item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { item, quantityNeeded } = await request.json();
    
    if (!item || !quantityNeeded) {
      return NextResponse.json(
        { error: 'Item name and quantity needed are required' },
        { status: 400 }
      );
    }

    const sheets = new SheetsService();
    await sheets.initialize();
    await sheets.updateItemQuantityNeeded(item, quantityNeeded);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return NextResponse.json(
      { error: 'Failed to update item quantity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { item } = await request.json();
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      );
    }

    const sheets = new SheetsService();
    await sheets.initialize();
    await sheets.removeNeededItem(item);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing needed item:', error);
    return NextResponse.json(
      { error: 'Failed to remove needed item' },
      { status: 500 }
    );
  }
}
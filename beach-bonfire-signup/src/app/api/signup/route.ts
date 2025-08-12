import { NextRequest, NextResponse } from 'next/server';
import { SheetsService } from '@/lib/sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, item, itemCategory, quantity, items } = body;

    // Support both single item (backward compatibility) and multiple items
    const itemsToProcess = items && items.length > 0 
      ? items 
      : item ? [{ item, category: itemCategory || 'other', quantity: quantity || 1 }] : [];

    if (!name || !email || itemsToProcess.length === 0) {
      return NextResponse.json(
        { error: 'Name, email, and at least one item are required' },
        { status: 400 }
      );
    }

    const sheets = new SheetsService();
    await sheets.initialize();

    // Get needed items once for all items
    const neededItems = await sheets.getNeededItems();

    // Add signup for each item (for backward compatibility and individual tracking)
    for (const itemObj of itemsToProcess) {
      await sheets.addSignup({
        name,
        email,
        item: itemObj.item,
        itemCategory: itemObj.category,
        quantity: itemObj.quantity || 1,
        timestamp: new Date().toISOString()
      });

      // Check if this item was in the needed items
      const neededItem = neededItems.find(ni => 
        ni.item.toLowerCase() === itemObj.item.toLowerCase()
      );
      
      if (neededItem) {
        // Update quantity for existing needed item
        const quantityBringing = itemObj.quantity || 1;
        await sheets.updateItemQuantity(neededItem.item, quantityBringing, name);
      } else {
        // Auto-add new item to needed list if it's not there
        await sheets.addNeededItem(itemObj.item, itemObj.category, itemObj.quantity || 1);
        // Also update the quantity brought since someone is bringing it
        await sheets.updateItemQuantity(itemObj.item, itemObj.quantity || 1, name);
      }
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
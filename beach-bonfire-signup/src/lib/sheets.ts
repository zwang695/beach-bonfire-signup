import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;

// Handle both escaped and literal newlines in private key
let PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!;
if (PRIVATE_KEY.includes('\\n')) {
  PRIVATE_KEY = PRIVATE_KEY.replace(/\\n/g, '\n');
}

export interface SignUpEntry {
  name: string;
  email: string;
  item: string;
  itemCategory: 'food' | 'drinks' | 'supplies' | 'other';
  timestamp: string;
  quantity?: number;
  items?: Array<{
    item: string;
    category: 'food' | 'drinks' | 'supplies' | 'other';
    quantity?: number;
  }>;
}

export interface NeededItem {
  item: string;
  category: 'food' | 'drinks' | 'supplies' | 'other';
  taken: boolean;
  takenBy?: string;
  quantityNeeded?: number;
  quantityBrought?: number;
}

export class SheetsService {
  private doc: GoogleSpreadsheet;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.doc = new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);
  }

  async initialize() {
    await this.doc.loadInfo();
    
    // Ensure we have the required sheets
    let signupsSheet = this.doc.sheetsByTitle['Signups'];
    let neededItemsSheet = this.doc.sheetsByTitle['NeededItems'];

    if (!signupsSheet) {
      signupsSheet = await this.doc.addSheet({
        title: 'Signups',
        headerValues: ['Name', 'Email', 'Item', 'Category', 'Quantity', 'Timestamp']
      });
    } else {
      // Check if Quantity column exists, if not add it
      await signupsSheet.loadHeaderRow();
      const headers = signupsSheet.headerValues;
      if (!headers.includes('Quantity')) {
        console.log('Adding Quantity column to existing Signups sheet...');
        // Resize sheet to add new column
        await signupsSheet.resize({ rowCount: signupsSheet.rowCount, columnCount: headers.length + 1 });
        
        // Update header row to include Quantity
        const newHeaders = [...headers];
        newHeaders.splice(4, 0, 'Quantity'); // Insert 'Quantity' at index 4
        await signupsSheet.setHeaderRow(newHeaders);
        
        // Update existing rows to have default quantity values
        const rows = await signupsSheet.getRows();
        for (const row of rows) {
          row.set('Quantity', '1');
          await row.save();
        }
      }
    }

    if (!neededItemsSheet) {
      neededItemsSheet = await this.doc.addSheet({
        title: 'NeededItems',
        headerValues: ['Item', 'Category', 'Taken', 'TakenBy', 'QuantityNeeded', 'QuantityBrought']
      });

      // Add default needed items
      const defaultItems = [
        { Item: 'BBQ Grill', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Charcoal', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Lighter Fluid', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Paper Plates', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '50', QuantityBrought: '0' },
        { Item: 'Napkins', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '100', QuantityBrought: '0' },
        { Item: 'Plastic Cups', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '50', QuantityBrought: '0' },
        { Item: 'Cooler with Ice', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '2', QuantityBrought: '0' },
        { Item: 'Beach Chairs', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '10', QuantityBrought: '0' },
        { Item: 'Umbrella/Tent', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '3', QuantityBrought: '0' },
        { Item: 'Trash Bags', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '3', QuantityBrought: '0' },
        { Item: 'Wet Wipes', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '5', QuantityBrought: '0' },
        { Item: 'Sunscreen', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '3', QuantityBrought: '0' },
        { Item: 'Burgers', Category: 'food', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Hot Dogs', Category: 'food', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Buns', Category: 'food', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Condiments', Category: 'food', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Fruit Salad', Category: 'food', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Chips', Category: 'food', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Sodas', Category: 'drinks', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Water Bottles', Category: 'drinks', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Beer', Category: 'drinks', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Sports Equipment', Category: 'other', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Bluetooth Speaker', Category: 'other', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '1', QuantityBrought: '0' },
        { Item: 'Firewood', Category: 'supplies', Taken: 'FALSE', TakenBy: '', QuantityNeeded: '5', QuantityBrought: '0' },
      ];

      await neededItemsSheet.addRows(defaultItems);
    } else {
      // Check if quantity columns exist, if not add them
      await neededItemsSheet.loadHeaderRow();
      const headers = neededItemsSheet.headerValues;
      if (!headers.includes('QuantityNeeded')) {
        console.log('Adding quantity columns to existing NeededItems sheet...');
        // Resize sheet to add new columns
        await neededItemsSheet.resize({ rowCount: neededItemsSheet.rowCount, columnCount: headers.length + 2 });
        
        // Update header row to include quantity columns
        const newHeaders = [...headers, 'QuantityNeeded', 'QuantityBrought'];
        await neededItemsSheet.setHeaderRow(newHeaders);
        
        // Update existing rows to have default quantity values
        const rows = await neededItemsSheet.getRows();
        for (const row of rows) {
          row.set('QuantityNeeded', '1');
          row.set('QuantityBrought', '0');
          await row.save();
        }
      }
    }

    return { signupsSheet, neededItemsSheet };
  }

  async addSignup(entry: SignUpEntry): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['Signups'];
    
    await sheet.addRow({
      Name: entry.name,
      Email: entry.email,
      Item: entry.item,
      Category: entry.itemCategory,
      Quantity: entry.quantity?.toString() || '1',
      Timestamp: entry.timestamp
    });
  }

  async getSignups(): Promise<SignUpEntry[]> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['Signups'];
    const rows = await sheet.getRows();
    
    return rows.map(row => ({
      name: row.get('Name') || '',
      email: row.get('Email') || '',
      item: row.get('Item') || '',
      itemCategory: row.get('Category') || 'other',
      quantity: parseInt(row.get('Quantity') || '1'),
      timestamp: row.get('Timestamp') || ''
    }));
  }

  async getNeededItems(): Promise<NeededItem[]> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    const rows = await sheet.getRows();
    
    return rows.map(row => ({
      item: row.get('Item') || '',
      category: row.get('Category') || 'other',
      taken: row.get('Taken') === 'TRUE',
      takenBy: row.get('TakenBy') || undefined,
      quantityNeeded: parseInt(row.get('QuantityNeeded') || '1'),
      quantityBrought: parseInt(row.get('QuantityBrought') || '0')
    }));
  }

  async markItemTaken(itemName: string, takenBy: string): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    const rows = await sheet.getRows();
    
    const row = rows.find(r => r.get('Item') === itemName);
    if (row) {
      row.set('Taken', 'TRUE');
      row.set('TakenBy', takenBy);
      await row.save();
    }
  }

  async updateItemQuantity(itemName: string, quantityToAdd: number, takenBy: string): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    const rows = await sheet.getRows();
    
    const row = rows.find(r => r.get('Item') === itemName);
    if (row) {
      const currentQuantity = parseInt(row.get('QuantityBrought') || '0');
      const newQuantity = currentQuantity + quantityToAdd;
      const quantityNeeded = parseInt(row.get('QuantityNeeded') || '1');
      
      row.set('QuantityBrought', newQuantity.toString());
      
      // Update taken status based on quantity
      if (newQuantity >= quantityNeeded) {
        row.set('Taken', 'TRUE');
      }
      
      // Update takenBy to include this person if not already there
      const currentTakenBy = row.get('TakenBy') || '';
      if (!currentTakenBy.includes(takenBy)) {
        const newTakenBy = currentTakenBy ? `${currentTakenBy}, ${takenBy}` : takenBy;
        row.set('TakenBy', newTakenBy);
      }
      
      await row.save();
    }
  }

  async addNeededItem(item: string, category: 'food' | 'drinks' | 'supplies' | 'other', quantityNeeded: number = 1): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    
    await sheet.addRow({
      Item: item,
      Category: category,
      Taken: 'FALSE',
      TakenBy: '',
      QuantityNeeded: quantityNeeded.toString(),
      QuantityBrought: '0'
    });
  }

  async updateItemQuantityNeeded(itemName: string, quantityNeeded: number): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    const rows = await sheet.getRows();
    
    const row = rows.find(r => r.get('Item') === itemName);
    if (row) {
      row.set('QuantityNeeded', quantityNeeded.toString());
      await row.save();
    }
  }

  async removeNeededItem(itemName: string): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    const rows = await sheet.getRows();
    
    const row = rows.find(r => r.get('Item') === itemName);
    if (row) {
      await row.delete();
    }
  }
}
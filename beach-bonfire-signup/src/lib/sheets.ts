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
}

export interface NeededItem {
  item: string;
  category: 'food' | 'drinks' | 'supplies' | 'other';
  taken: boolean;
  takenBy?: string;
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
        headerValues: ['Name', 'Email', 'Item', 'Category', 'Timestamp']
      });
    }

    if (!neededItemsSheet) {
      neededItemsSheet = await this.doc.addSheet({
        title: 'NeededItems',
        headerValues: ['Item', 'Category', 'Taken', 'TakenBy']
      });

      // Add default needed items
      const defaultItems = [
        { Item: 'BBQ Grill', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Charcoal', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Lighter Fluid', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Paper Plates', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Napkins', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Plastic Cups', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Cooler with Ice', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Beach Chairs', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Umbrella/Tent', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Trash Bags', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Wet Wipes', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Sunscreen', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Burgers', Category: 'food', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Hot Dogs', Category: 'food', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Buns', Category: 'food', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Condiments', Category: 'food', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Fruit Salad', Category: 'food', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Chips', Category: 'food', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Sodas', Category: 'drinks', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Water Bottles', Category: 'drinks', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Beer', Category: 'drinks', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Sports Equipment', Category: 'other', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Bluetooth Speaker', Category: 'other', Taken: 'FALSE', TakenBy: '' },
        { Item: 'Firewood', Category: 'supplies', Taken: 'FALSE', TakenBy: '' },
      ];

      await neededItemsSheet.addRows(defaultItems);
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
      takenBy: row.get('TakenBy') || undefined
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

  async addNeededItem(item: string, category: 'food' | 'drinks' | 'supplies' | 'other'): Promise<void> {
    await this.doc.loadInfo();
    const sheet = this.doc.sheetsByTitle['NeededItems'];
    
    await sheet.addRow({
      Item: item,
      Category: category,
      Taken: 'FALSE',
      TakenBy: ''
    });
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
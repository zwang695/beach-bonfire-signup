import { NextResponse } from 'next/server';
import { SheetsService } from '@/lib/sheets';

export async function GET() {
  try {
    console.log('Testing Google Sheets connection...');
    console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Missing');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'Set (length: ' + process.env.GOOGLE_PRIVATE_KEY.length + ')' : 'Missing');
    
    const sheets = new SheetsService();
    await sheets.initialize();
    
    console.log('Google Sheets initialized successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Google Sheets connection working!',
      env: {
        sheetId: process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing',
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Missing',
        privateKey: process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Missing'
      }
    });
  } catch (error) {
    console.error('Google Sheets test failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        env: {
          sheetId: process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing',
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set' : 'Missing',
          privateKey: process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Missing'
        }
      },
      { status: 500 }
    );
  }
}
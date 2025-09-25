// API route to handle CSV uploads
// This route can be called from the admin page to upload CSV data

import { importPlayersFromCSV, importMatchesFromCSV, importTournamentsFromCSV } from '@/lib/db/actions';
import { NextResponse } from 'next/server';
import { parse } from 'csv-parse/sync';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dataType = formData.get('dataType') as string;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: 'No file provided' 
      }, { status: 400 });
    }
    
    if (!dataType) {
      return NextResponse.json({ 
        success: false, 
        message: 'No data type provided' 
      }, { status: 400 });
    }
    
    // Convert file to text
    const bytes = await file.arrayBuffer();
    const text = new TextDecoder().decode(bytes);
    
    // Parse CSV data
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Call appropriate import function based on data type
    let result;
    switch (dataType) {
      case 'players':
        result = await importPlayersFromCSV(records);
        break;
      case 'matches':
        result = await importMatchesFromCSV(records);
        break;
      case 'tournaments':
        result = await importTournamentsFromCSV(records);
        break;
      default:
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid data type' 
        }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to upload CSV file', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
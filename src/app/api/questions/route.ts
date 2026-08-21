import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const subjectRanges: Record<string, { start: number; end: number }> = {
  'Endodontic': { start: 2270, end: 2990 },
  'Operative': { start: 5013, end: 5222 },
  'Oral Surgery': { start: 2991, end: 3289 },
  'Periodontic': { start: 4112, end: 4367 },
  'Fixed Prosthodontic': { start: 4601, end: 4803 },
  'Pedodontic': { start: 3290, end: 3510 },
  'Orthodontic': { start: 3511, end: 3879 },
  'Pathology': { start: 5223, end: 5500 },
  'Radiology': { start: 3880, end: 4111 },
  'Removable Prosthodontic': { start: 4804, end: 5012 },
  'Oral Medicine': { start: 4368, end: 4600 },
};

async function getSheetData(range: string) {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range,
  });
  return response.data.values || [];
}

function parseQuestions(rows: string[][]) {
  return rows
    .filter(row => row[0] && row[1])
    .map(row => ({
      question: row[0] || '',
      choices: [row[1] || '', row[2] || '', row[3] || '', row[4] || ''],
      correct: row[5] || '',
      explanation: row[6] || '',
      detailed: row[9] || '',
      metadata: row[10] || '',
    }));
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const mode = searchParams.get('mode');

    let range = 'Sheet1!A2:K';
    let questions;

    if (subject && subjectRanges[subject]) {
      const { start, end } = subjectRanges[subject];
      range = `Sheet1!A${start}:K${end}`;
      const rows = await getSheetData(range);
      questions = parseQuestions(rows);
    } else if (mode === 'exam') {
      // Random exam: fetch all and pick 50 random
      const rows = await getSheetData(range);
      const all = parseQuestions(rows);
      questions = shuffleArray(all).slice(0, 50);
    } else {
      const rows = await getSheetData(range);
      questions = parseQuestions(rows).slice(0, 50);
    }

    return NextResponse.json({ questions }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error.message },
      { status: 500 }
    );
  }
}

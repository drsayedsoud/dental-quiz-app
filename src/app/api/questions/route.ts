import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';

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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function getLocalCsvData(filename: string): Promise<string[][]> {
  try {
    const filePath = path.join(process.cwd(), 'public', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    return lines.slice(1).map(parseCSVLine);
  } catch (err) {
    console.error('Error reading local CSV:', err);
    return [];
  }
}

async function getSheetData(range: string) {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    throw new Error('Google Sheets credentials not configured');
  }
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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function parseQuestions(rows: string[][], shuffleChoices = true) {
  return rows
    .filter(row => row[0] && row[1])
    .map(row => {
      const originalChoices = [row[1] || '', row[2] || '', row[3] || '', row[4] || ''].filter(c => c.trim().length > 0);
      const choices = shuffleChoices ? shuffleArray(originalChoices) : originalChoices;
      return {
        question: (row[0] || '').trim(),
        choices,
        correct: (row[5] || '').trim(),
        explanation: (row[6] || '').trim(),
        detailed: (row[9] || '').trim(),
        metadata: (row[10] || '').trim(),
      };
    });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const mode = searchParams.get('mode');
    const section = searchParams.get('section') || searchParams.get('type') || 'dental';

    let questions;

    if (section === 'medical') {
      const rows = await getLocalCsvData('questions_medical.csv');
      const all = parseQuestions(rows, true);
      let filtered = all;
      if (subject) {
        // subject is stored in row[10] which parseQuestions maps to 'metadata'
        filtered = all.filter(q => q.metadata && q.metadata.toLowerCase() === subject.toLowerCase());
      }
      if (mode === 'exam') questions = shuffleArray(filtered).slice(0, 50);
      else if (mode === 'simulation') questions = shuffleArray(filtered).slice(0, 100);
      else if (mode === 'quick') questions = shuffleArray(filtered).slice(0, 10);
      else questions = shuffleArray(filtered);
    } else {
      // Dental section
      try {
        let range = 'Sheet1!A2:K';
        if (subject && subjectRanges[subject]) {
          const { start, end } = subjectRanges[subject];
          range = `Sheet1!A${start}:K${end}`;
          const rows = await getSheetData(range);
          const parsed = parseQuestions(rows, true);
          questions = shuffleArray(parsed); // Shuffled all questions of this subject
        } else if (mode === 'exam') {
          const rows = await getSheetData(range);
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all).slice(0, 50);
        } else if (mode === 'simulation') {
          const rows = await getSheetData(range);
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all).slice(0, 100);
        } else if (mode === 'quick') {
          const rows = await getSheetData(range);
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all).slice(0, 10);
        } else {
          const rows = await getSheetData(range);
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all);
        }
      } catch (sheetErr) {
        console.warn('Falling back to local questions.csv:', sheetErr);
        const rows = await getLocalCsvData('questions.csv');
        if (subject && subjectRanges[subject]) {
          const { start, end } = subjectRanges[subject];
          const sliceRows = rows.slice(Math.max(0, start - 2), end - 1);
          const parsed = parseQuestions(sliceRows, true);
          questions = shuffleArray(parsed); // Shuffled all questions of this subject
        } else if (mode === 'exam') {
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all).slice(0, 50);
        } else if (mode === 'simulation') {
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all).slice(0, 100);
        } else if (mode === 'quick') {
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all).slice(0, 10);
        } else {
          const all = parseQuestions(rows, true);
          questions = shuffleArray(all);
        }
      }
    }

    return NextResponse.json({ questions: questions || [] }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error.message },
      { status: 500 }
    );
  }
}

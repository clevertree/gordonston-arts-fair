/* eslint-disable no-await-in-loop,no-restricted-syntax,no-console */

'use server';

import { validateEmail } from '@components/FormFields/validation';
import * as fs from 'node:fs';
import { getPGSQLClient } from '@util/pgsql';
import { UserFileUploadDescription } from '@util/schema';

interface RowData {
  id: string,
  fname: string,
  lname: string,
  company: string,
  address: string,
  city: string,
  state: string,
  zip: string,
  phone: string,
  phone2: string,
  email: string,
  website: string,
  comment: string,
  category: string,
  name1: string,
  description1: string,
  name2: string,
  description2: string,
  name3: string,
  description3: string,
  name4: string,
  description4: string
}

async function insertUser(email: string, row: RowData) {
  const {
    // id,
    fname,
    lname,
    company,
    address,
    city,
    state,
    zip,
    phone,
    phone2,
    // email,
    website,
    comment,
    category,
    name1,
    description1,
    name2,
    description2,
    name3,
    description3,
    name4,
    description4
  } = row;
  const uploads: { [key: string]: UserFileUploadDescription } = {};
  if (name1 && description1) {
    uploads[name1] = {
      title: name1, description: description1
    };
  }

  if (name2 && description2) {
    uploads[name2] = {
      title: name2,
      description: description2
    };
  }

  if (name3 && description3) {
    uploads[name3] = {
      title: name3,
      description: description3
    };
  }

  if (name4 && description4) {
    uploads[name4] = {
      title: name4,
      description: description4
    };
  }

  const sql = getPGSQLClient();
  return sql`INSERT INTO gaf_user (email, type, status, first_name, last_name, company_name,
                                   address, city, state, zipcode, phone, phone2, website,
                                   description, category, uploads, created_at)
             VALUES (${email}, 'user', 'imported', ${fname}, ${lname}, ${company},
                     ${address}, ${city}, ${state}, ${zip}, ${phone}, ${phone2}, ${website},
                     ${comment}, ${category}, ${uploads}, now()) ON CONFLICT (email) DO NOTHING;`;
}

export async function importDBFromCSV() {
  const testMode = process.env.TEST_MODE !== 'false';
  if (!testMode) throw new Error('Must be in test mode');

  const csvData = await parseCSV('export.csv');
  console.log('csv', csvData);
  for (const row of csvData) {
    const { email } = row;
    if (!email) {
      console.error('Invalid email: ', email, row);
      continue;
    }
    if (!email || validateEmail(email)) {
      console.error(validateEmail(email), email, row);
      continue;
    }

    console.info('Importing profile: ', email);
    await insertUser(email, row as unknown as RowData);
    // const currentUserProfile = (await sql`SELECT *
    //                                       FROM gaf_user
    //                                       WHERE email = ${email}`) as unknown as UserProfile;
    // if (currentUserProfile) {
    //   const { info, uploads } = newProfile;
    //   Object.assign(newProfile, currentUserProfile);
    //   newProfile.info = { ...info, ...currentUserProfile.info };
    //   newProfile.uploads = { ...uploads, ...currentUserProfile.uploads };
    // }
  }
}

function parseCSV(filePath: string): Array<{ [key: string]: string }> {
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  // Split the CSV content into rows
  const rows = csvContent.split('\n').filter((row) => row.trim() !== '');

  if (rows.length === 0) {
    throw new Error('CSV content is empty or invalid');
  }

  // Extract headers from the first row
  const headers = splitCSVRow(rows[0]);

  // Map each row to an object based on headers
  const parsedData = rows.slice(1).map((row) => {
    const values = splitCSVRow(row);
    if (values.length > headers.length) {
      throw new Error('Row length is greater than header length');
    }

    // Create object where keys are headers and values are the data
    return headers.reduce((acc, header, idx) => {
      acc[header] = values[idx];
      return acc;
    }, {} as { [key: string]: string });
  });

  return parsedData;
}

function splitCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"' && (i === 0 || row[i - 1] !== '\\')) {
      inQuotes = !inQuotes; // Toggle quotes state
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = ''; // Start a new field
    } else {
      current += char; // Add char to the current field
    }
  }

  // Add the last field to the result
  result.push(current.trim());

  return result;
}

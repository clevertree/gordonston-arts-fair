'use client';

import * as XLSX from 'xlsx';
import {BookType} from 'xlsx';

export function exportToExcel<T extends object>(data: T[], filename: string, bookType: BookType) {
    if (!data || data.length === 0) {
        throw new Error('No data to export');
    }

    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // Browser: trigger download
    const excelBuffer = XLSX.write(workbook, { bookType, type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


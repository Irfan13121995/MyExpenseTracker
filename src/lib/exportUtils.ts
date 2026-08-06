import { Transaction, CurrencyCode } from '@/types';
import { formatCurrency, formatDate } from './utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToCSV(transactions: Transaction[], currency: CurrencyCode = 'USD') {
  const headers = ['ID', 'Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes', 'Recurring'];
  
  const rows = transactions.map((t) => [
    t.id,
    formatDate(t.date),
    t.type.toUpperCase(),
    t.category?.name || 'Uncategorized',
    t.amount.toFixed(2),
    t.payment_method.replace('_', ' ').toUpperCase(),
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    t.is_recurring ? 'YES' : 'NO',
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(transactions: Transaction[]) {
  const jsonString = JSON.stringify(transactions, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Expense_Report_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(transactions: Transaction[], currency: CurrencyCode = 'USD') {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text('Web Expense Tracker - Financial Summary Report', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Transactions: ${transactions.length}`, 14, 28);
  
  // Table Data
  const tableData = transactions.map((t) => [
    formatDate(t.date),
    t.type.toUpperCase(),
    t.category?.name || 'Uncategorized',
    t.payment_method.replace('_', ' ').toUpperCase(),
    formatCurrency(t.amount, currency),
    t.notes || '-',
  ]);

  autoTable(doc, {
    startY: 35,
    head: [['Date', 'Type', 'Category', 'Method', 'Amount', 'Notes']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(`Expense_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

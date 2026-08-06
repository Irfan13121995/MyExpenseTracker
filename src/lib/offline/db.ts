import Dexie, { Table } from 'dexie';
import { Transaction, Category, Budget } from '@/types';

export class ExpenseTrackerDB extends Dexie {
  transactions!: Table<Transaction>;
  categories!: Table<Category>;
  budgets!: Table<Budget>;

  constructor() {
    super('ExpenseTrackerOfflineDB');
    this.version(1).stores({
      transactions: 'id, user_id, category_id, type, date, sync_status',
      categories: 'id, user_id, name, type',
      budgets: 'id, user_id, category_id, month_year',
    });
  }
}

export const offlineDB = new ExpenseTrackerDB();

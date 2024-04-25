import { sql } from 'drizzle-orm';
import { bigint, date, decimal, index, integer, pgTable, pgView, primaryKey, serial, varchar } from 'drizzle-orm/pg-core';

export const companies = pgTable('companies', {
    id: serial('id').primaryKey(),
    externalId: varchar('external_id', { length: 256 }),
    name: varchar('name', { length: 256 }).notNull(),
    cnpj: varchar('cnpj', { length: 20 }),
    ipo: integer('ipo'),
    foundationYear: integer('foundation_year'),
    firmValue: bigint('firm_value', { mode: 'number' }),
    numberOfPapers: bigint('number_of_papers', { mode: 'number' }),
    marketSegment: varchar('market_segment', { length: 256 }),
    sector: varchar('sector', { length: 256 }),
    segment: varchar('segment', { length: 256 })
});

export const stocks = pgTable('stocks', {
    id: serial('id').primaryKey(),
    externalId: varchar('external_id', { length: 256 }),
    ticker: varchar('ticker', { length: 7 }).notNull(),
    companyId: serial('company_id').references(() => companies.id).notNull(),
    freeFloat: decimal('free_float'),
    tagAlong: decimal('tag_along'),
    avgDailyLiquidity: bigint('avg_daily_liquidity', { mode: 'number' })
});

export const prices = pgTable('prices', {
    id: serial('id').primaryKey(),
    stockId: serial('stock_id').references(() => stocks.id).notNull(),
    value: decimal('value').notNull(),
    priceDate: date('price_date').notNull()
}, (prices) => {
    return {
        stockIdx: index("prices_stock_idx").on(prices.stockId),
    };
})

export const dividends = pgTable('dividends', {
    stockId: serial('stock_id').references(() => stocks.id).notNull(),
    type: varchar('type', { length: 100 }).notNull().default('Dividendo'),
    value: decimal('value').notNull(),
    ownershipDate: date('ownership_date').notNull(),
    paymentDate: date('payment_date').notNull(),
}, (dividends) => {
    return {
        pk: primaryKey({ columns: [dividends.stockId, dividends.paymentDate] }),
        stockIdx: index("dividends_stock_idx").on(dividends.stockId),
    };
});

export const balanceSheets = pgTable('balance_sheets', {
    companyId: serial('company_id').references(() => companies.id).notNull(),
    year: integer('year').notNull(),
    quarter: integer('quarter').notNull(),
    netRevenue: bigint('net_revenue', { mode: 'number' }),
    costs: bigint('costs', { mode: 'number' }),
    grossProfit: bigint('gross_profit', { mode: 'number' }),
    netProfit: bigint('net_profit', { mode: 'number' }),
    ebitda: bigint('ebitda', { mode: 'number' }),
    ebit: bigint('ebit', { mode: 'number' }),
    taxes: bigint('taxes', { mode: 'number' }),
    grossDebt: bigint('gross_debt', { mode: 'number' }),
    netDebt: bigint('net_debt', { mode: 'number' }),
    equity: bigint('equity', { mode: 'number' }),
    cash: bigint('cash', { mode: 'number' }),
    assets: bigint('assets', { mode: 'number' }),
    liabilities: bigint('liabilities', { mode: 'number' })
}, (balanceSheets) => {
    return {
        pk: primaryKey({ columns: [balanceSheets.companyId, balanceSheets.year, balanceSheets.quarter] }),
        companyIdx: index("balance_sheets_company_idx").on(balanceSheets.companyId),
        yearIdx: index("balance_sheets_year_idx").on(balanceSheets.year),
    };
});

// export const yearlyBalanceSheets = pgView("yearly_balance_sheets", {
//     companyId: serial('company_id'),
//     year: integer('year'),
//     netRevenue: bigint('net_revenue', { mode: 'number' }),
//     costs: bigint('costs', { mode: 'number' }),
//     grossProfit: bigint('gross_profit', { mode: 'number' }),
//     netProfit: bigint('net_profit', { mode: 'number' }),
//     ebitda: bigint('ebitda', { mode: 'number' }),
//     ebit: bigint('ebit', { mode: 'number' }),
//     taxes: bigint('taxes', { mode: 'number' }),
//     grossDebt: bigint('gross_debt', { mode: 'number' }),
//     netDebt: bigint('net_debt', { mode: 'number' }),
//     equity: bigint('equity', { mode: 'number' }),
//     cash: bigint('cash', { mode: 'number' }),
//     assets: bigint('assets', { mode: 'number' }),
//     liabilities: bigint('liabilities', { mode: 'number' })
// }).as(sql`SELECT year, company_id, SUM(net_revenue) AS net_revenue, SUM(costs) AS costs, SUM(gross_profit) AS gross_profit, SUM(net_profit) AS net_profit, SUM(ebitda) AS ebitda, SUM(ebit) AS ebit, SUM(taxes) AS taxes, SUM(CASE WHEN quarter = 4 THEN equity ELSE 0 END) AS equity, SUM(CASE WHEN quarter = 4 THEN gross_debt ELSE 0 END) AS gross_debt, SUM(CASE WHEN quarter = 4 THEN net_debt ELSE 0 END) AS net_debt, SUM(CASE WHEN quarter = 4 THEN cash ELSE 0 END) AS cash, SUM(CASE WHEN quarter = 4 THEN assets ELSE 0 END) AS assets, SUM(CASE WHEN quarter = 4 THEN liabilities ELSE 0 END) AS liabilities FROM ${balanceSheets} GROUP BY year, company_id`);

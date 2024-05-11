export interface CreateBalanceSheetDto {
    companyId: number,
    year: number,
    quarter: number,
    netRevenue?: number,
    costs?: number,
    grossProfit?: number,
    netProfit?: number,
    ebitda?: number,
    ebit?: number,
    taxes?: number,
    grossDebt?: number,
    netDebt?: number,
    equity?: number,
    cash?: number,
    assets?: number,
    liabilities?: number
};

export interface UpdateBalanceSheetDto {
    year?: number,
    quarter?: number,
    netRevenue?: number,
    costs?: number,
    grossProfit?: number,
    netProfit?: number,
    ebitda?: number,
    ebit?: number,
    taxes?: number,
    grossDebt?: number,
    netDebt?: number,
    equity?: number,
    cash?: number,
    assets?: number,
    liabilities?: number
};

export interface GetBalanceSheetDto {
    companyId: number,
    year: number,
    quarter: number,
    netRevenue?: number,
    costs?: number,
    grossProfit?: number,
    netProfit?: number,
    ebitda?: number,
    ebit?: number,
    taxes?: number,
    grossDebt?: number,
    netDebt?: number,
    equity?: number,
    cash?: number,
    assets?: number,
    liabilities?: number
};

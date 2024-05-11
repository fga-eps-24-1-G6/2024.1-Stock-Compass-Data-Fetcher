export interface CreateStockDto {
    externalId?: string,
    ticker: string,
    freeFloat?: string,
    tagAlong?: string,
    avgDailyLiquidity?: number,
    companyId: number
};

export interface UpdateStockDto {
    externalId?: string,
    ticker?: string,
    freeFloat?: string,
    tagAlong?: string,
    avgDailyLiquidity?: number
};

export interface GetStockDto {
    ticker: string,
    freeFloat?: string,
    tagAlong?: string,
    avgDailyLiquidity?: number,
    companyId: number
};

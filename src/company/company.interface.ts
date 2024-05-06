export interface Stock {
    id: string,
    externalId: string,
    ticker: string,
    companyId: string,
    freeFloat: number,
    tagAlong: number,
    avgDailyLiquidity: number
};


export interface Company {
    id: number,
    externalId: string,
    name: string,
    cnpj: string,
    ipo: number,
    foundationYear: number,
    firmValue: number,
    numberOfPapers: number,
    marketSegment: string,
    sector: string,
    segment: string
};

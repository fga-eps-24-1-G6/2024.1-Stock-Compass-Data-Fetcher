export interface CreatePriceDto {
    stockId: number,
    value: string,
    priceDate: string
};

export interface UpdatePriceDto {
    value?: string,
    priceDate?: string
};

export interface GetPriceDto {
    stockId: number,
    value: number,
    priceDate: Date
};

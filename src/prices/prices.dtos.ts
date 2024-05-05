export interface CreatePriceDto {
    stockId: number,
    value: string,
    priceDate: string
};

export interface UpdatePriceDto {
    value?: string,
    priceDate?: string
};

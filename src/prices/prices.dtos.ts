export interface CreatePriceDto {
    stockId: number,
    value: number,
    priceDate: Date
};

export interface UpdatePriceDto {
    value?: number,
    priceDate?: Date
};

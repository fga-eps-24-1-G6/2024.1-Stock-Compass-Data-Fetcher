export interface CreateDividendDto {
    stockId: number,
    type?: string,
    value: number,
    ownershipDate: Date,
    paymentDate: Date
};

export interface UpdateDividendDto {
    type?: string,
    value?: number,
    ownershipDate?: Date,
    paymentDate?: Date
};

export interface GetDividendDto {
    stockId: number,
    type: string,
    value: number,
    ownershipDate: Date,
    paymentDate: Date
};

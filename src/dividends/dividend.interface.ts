export interface Dividend {
    id: number,
    stockId: number,
    type: string,
    value: number,
    ownershipDate: Date,
    paymentDate: Date
};

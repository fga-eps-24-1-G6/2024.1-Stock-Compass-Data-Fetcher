export interface CreateCompanyDto {
    externalId?: string,
    name?: string,
    cnpj?: string,
    ipo?: number,
    foundationYear?: number,
    firmValue?: number,
    numberOfPapers?: number,
    marketSegment?: string,
    sector?: string,
    segment?: string
};

export interface UpdateCompanyDto {
    externalId?: string,
    name?: string,
    cnpj?: string,
    ipo?: number,
    foundationYear?: number,
    firmValue?: number,
    numberOfPapers?: number,
    marketSegment?: string,
    sector?: string,
    segment?: string
};

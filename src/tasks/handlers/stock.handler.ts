import { CreateCompanyDto } from "src/company/companies.dtos";
import { CreateStockDto } from "src/stocks/stocks.dtos";

function filterNullValues(data: any) {
    const filteredData = Object.entries(data).filter(([_, value]) => {
        if(value !== null && value !== "-")
            return value
    });

    return Object.fromEntries(filteredData);
}

export function handleCompanyData(stockData: any): CreateCompanyDto {
    if (!stockData['companyData']['Nome da Empresa:'])
        throw new Error('Company name missing');

    const rawCompanyData = {
        externalId: stockData['companyId'],
        name: stockData['companyData']['Nome da Empresa:'],
        cnpj: stockData['companyData']['CNPJ:'].replaceAll('.', '').replace('-', '').replace('/', ''),
        ipo: stockData['companyData']['Ano de estreia na bolsa:'],
        foundationYear: stockData['companyData']['Ano de fundação:'],
        firmValue: stockData['companyData']['Valor de firma'],
        numberOfPapers: stockData['companyData']['Nº total de papeis'],
        marketSegment: stockData['companyData']['Segmento de Listagem'],
        sector: stockData['companyData']['Setor'],
        segment: stockData['companyData']['Segmento']
    };

    let formattedData = filterNullValues(rawCompanyData);
    if (formattedData.ipo) formattedData.ipo = parseInt(formattedData.ipo.toString());
    if (formattedData.foundationYear) formattedData.foundationYear = parseInt(formattedData.foundationYear.toString());

    return formattedData;
}

export function handleStockData(stockData: any, companyId: number): CreateStockDto {
    if (!companyId || !stockData['ticker'])
        throw new Error('Stock ticker missing');

    const rawCompanyData = {
        externalId: stockData['stockId'],
        freeFloat: stockData['companyData']['Free Float'].replace(',', '.').replace('%', ''),
        tagAlong: stockData['companyData']['Tag Along'].replace(',', '.').replace('%', ''),
        avgDailyLiquidity: stockData['companyData']['Liquidez Média Diária'],
    };

    let formattedData = {
        companyId,
        ticker: stockData['ticker'].toString(),
        ...filterNullValues(rawCompanyData),
    }

    return formattedData;
}
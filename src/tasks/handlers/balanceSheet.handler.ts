import { CreateBalanceSheetDto } from "src/balanceSheets/balanceSheets.dtos";

type Sheet = (string | string[])[][];

function extractSheetData(data: Sheet): any {
    const tableHeader = data[0];
    const removableIndexes = []
    tableHeader.forEach((item: string, index: number) => {
        if (item.includes('%'))
            removableIndexes.push(index)
    })

    const resultsBySymbol = {}

    data.forEach((row: string[], rowIndex: number) => {
        const symbol = row[0];
        resultsBySymbol[symbol] = [];

        row.forEach((item: string | string[], index: number) => {
            if (index != 0 && !removableIndexes.includes(index)) {
                if (rowIndex == 0 && typeof item == 'string') {
                    const quarter = parseInt(item[0]);
                    const year = parseInt(item.substring(item.length - 4));

                    resultsBySymbol[symbol].push({ quarter, year })
                }
                else {
                    const rawValue = typeof item == 'string' ? item : item[1];
                    if (rawValue && rawValue.trim() !== '-') {
                        const numberValue = rawValue.includes('%') ?
                            parseFloat((parseFloat(rawValue.replace('%', '').replace(',', '.')) / 100).toFixed(4)) :
                            parseFloat(rawValue.replaceAll('.', '').replace(',', '.'))

                        resultsBySymbol[symbol].push(numberValue)
                    }
                }
            }
        });
    })

    return resultsBySymbol;
}

function handleBalanceSheetBaseData(data: any) {
    const resultsBySymbol = extractSheetData(data);

    const balanceSheets = [];
    for (let i = 0; i < resultsBySymbol['#'].length; i++) {
        balanceSheets.push({
            ...resultsBySymbol['#'][i],
            netRevenue: resultsBySymbol['Receita Líquida - (R$)'][i] || null,
            costs: resultsBySymbol['Custos - (R$)'][i] || null,
            grossProfit: resultsBySymbol['Lucro Bruto - (R$)'][i] || null,
            netProfit: resultsBySymbol['Lucro Líquido - (R$)'][i] || null,
            ebitda: resultsBySymbol['EBITDA - (R$)'][i] || null,
            ebit: resultsBySymbol['EBIT - (R$)'][i] || null,
            taxes: resultsBySymbol['Imposto - (R$)'][i] || null,
            grossDebt: resultsBySymbol['Dívida Bruta - (R$)'][i] || null,
            netDebt: resultsBySymbol['Dívida Líquida - (R$)'][i] || null,
        });
    }

    return balanceSheets;
}

function handleAssetsAndLiabilitiesData(data: any) {
    const resultsBySymbol = extractSheetData(data);

    const assetsAndLiabilities = [];
    for (let i = 0; i < resultsBySymbol['#'].length; i++) {
        assetsAndLiabilities.push({
            ...resultsBySymbol['#'][i],
            assets: resultsBySymbol['Ativo Total - (R$)'][i] || null,
            // circulatingAssets: resultsBySymbol['Ativo Circulante - (R$)'][i] || null,
            // nonCirculatingAssets: resultsBySymbol['Ativo Não Circulante - (R$)'][i] || null,
            liabilities: resultsBySymbol['Passivo Total - (R$)'][i] || null,
            // circulatingLiabilities: resultsBySymbol['Passivo Circulante - (R$)'][i] || null,
            // nonCirculatingLiabilities: resultsBySymbol['Passivo Não Circulante - (R$)'][i] || null,
            equity: resultsBySymbol['Patrimônio Líquido Consolidado - (R$)'][i] || null,
        });
    }

    return assetsAndLiabilities;
}

export function handleBalanceSheetsData({ companyId, baseData, assetsAndLiabilitiesData }: { companyId: number, baseData: any, assetsAndLiabilitiesData: any }): CreateBalanceSheetDto[] {
    const baseBalanceSheets = handleBalanceSheetBaseData(baseData);
    const assetsAndLiabilities = handleAssetsAndLiabilitiesData(assetsAndLiabilitiesData);

    const length = baseBalanceSheets.length >= assetsAndLiabilities.length ? baseBalanceSheets.length : assetsAndLiabilities.length;
    const balanceSheets = [];
    for (let i = 0; i < length; i++) {
        let balanceSheet = { companyId };
        if (i < baseBalanceSheets.length) {
            balanceSheet = {
                ...balanceSheet,
                ...baseBalanceSheets[i]
            };
        }
        if (i < assetsAndLiabilities.length) {
            balanceSheet = {
                ...balanceSheet,
                ...assetsAndLiabilities[i]
            }
        }
        balanceSheets.push(balanceSheet);
    }
    return balanceSheets;
}
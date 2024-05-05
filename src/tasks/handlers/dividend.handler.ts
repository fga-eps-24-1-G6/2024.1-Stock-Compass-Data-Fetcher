import { CreateDividendDto } from "src/dividends/dividends.dtos";
import { formatDate } from "src/utils/formatter";

type Dividend = {
    type: string,
    ownershipDate: string,
    paymentDate: string,
    value: number
};

export function handleDividendsData(stockData: any, stockId: number): CreateDividendDto[] {
    let dividends = stockData['dividendHistory'];
    if (!dividends || dividends.length == 0 || !stockId)
        return null;

    dividends = dividends
        .map((dividend: Dividend) => {
            const ownershipDate = formatDate(dividend.ownershipDate);
            const paymentDate = formatDate(dividend.paymentDate);
            if (!ownershipDate || !paymentDate)
                return null
            else return {
                ...dividend,
                stockId,
                ownershipDate,
                paymentDate
            }
        })
        .filter((item: Dividend) => item !== null);

    return dividends;
}
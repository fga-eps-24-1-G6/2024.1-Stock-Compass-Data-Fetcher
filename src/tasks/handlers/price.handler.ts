import { CreatePriceDto } from "src/prices/prices.dtos";
import { formatDate } from "src/utils/formatter";

export function handlePriceHistoryData(stockId: number, data: any): CreatePriceDto[] {
    const prices = data['real'].map((item: { price: number, created_at: string }) => ({
        stockId,
        value: item.price.toString(),
        priceDate: formatDate(item.created_at.split(' ')[0])
    }))

    return prices;
}
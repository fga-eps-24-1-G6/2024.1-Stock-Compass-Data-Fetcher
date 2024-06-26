import { CreateStockDto, UpdateStockDto } from "../stocks.dtos";
import { Stock } from "../stock.interface";

export interface StockRepository {
    findOne(id: number): Promise<Stock | undefined>;
    findAll(): Promise<Stock[]>;
    findByTicker(ticker: string): Promise<Stock | undefined>;
    create(createStockDto: CreateStockDto): Promise<Stock>;
    update(id: number, updateStockDto: UpdateStockDto): Promise<Stock>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
}

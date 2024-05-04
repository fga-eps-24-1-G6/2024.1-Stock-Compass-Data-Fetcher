import { CreatePriceDto, UpdatePriceDto } from "../prices.dtos";
import { Price } from "../price.interface";

export interface PriceRepository {
    findOne(id: number): Promise<Price | undefined>;
    findAll(): Promise<Price[]>;
    findByStock(stockId: number): Promise<Price[]>;
    create(createPriceDto: CreatePriceDto): Promise<Price>;
    update(id: number, updatePriceDto: UpdatePriceDto): Promise<Price>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
}

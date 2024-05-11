import { CreateDividendDto, UpdateDividendDto } from "../dividends.dtos";
import { Dividend } from "../dividend.interface";

export interface DividendRepository {
    findOne(id: number): Promise<Dividend | undefined>;
    findAll(): Promise<Dividend[]>;
    findAllGroupedByStock(): Promise<any[] | undefined>;
    findByStock(stockId: number): Promise<Dividend[] | undefined>;
    create(createDividendDto: CreateDividendDto): Promise<Dividend>;
    createMultiple(createDividendDto: CreateDividendDto[]): Promise<Dividend[]>;
    update(id: number, updateDividendDto: UpdateDividendDto): Promise<Dividend>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
}

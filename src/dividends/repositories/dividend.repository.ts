import { CreateDividendDto, UpdateDividendDto } from "../dividends.dtos";
import { Dividend } from "../dividend.interface";

export interface DividendRepository {
    findOne(id: number): Promise<Dividend | undefined>;
    findAll(): Promise<Dividend[]>;
    create(createDividendDto: CreateDividendDto): Promise<Dividend>;
    update(id: number, updateDividendDto: UpdateDividendDto): Promise<Dividend>;
    delete(id: number): Promise<void>;
    deleteAll(): Promise<void>;
}

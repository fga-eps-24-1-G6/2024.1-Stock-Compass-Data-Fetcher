import { Module } from "@nestjs/common";
import { drizzleProvider } from "./drizzel.provider";

@Module({
    providers: [...drizzleProvider],
    exports: [...drizzleProvider]
})
export class DrizzleModule { }
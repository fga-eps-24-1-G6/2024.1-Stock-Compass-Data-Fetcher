CREATE TABLE IF NOT EXISTS "balance_sheets" (
	"company_id" serial NOT NULL,
	"year" integer NOT NULL,
	"quarter" integer NOT NULL,
	"net_revenue" bigint,
	"costs" bigint,
	"gross_profit" bigint,
	"net_profit" bigint,
	"ebitda" bigint,
	"ebit" bigint,
	"taxes" bigint,
	"gross_debt" bigint,
	"net_debt" bigint,
	"equity" bigint,
	"cash" bigint,
	"assets" bigint,
	"liabilities" bigint,
	CONSTRAINT "balance_sheets_company_id_year_quarter_pk" PRIMARY KEY("company_id","year","quarter")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"cnpj" varchar(20),
	"ipo" integer,
	"foundation_year" integer,
	"firm_value" bigint,
	"number_of_papers" bigint,
	"market_segment" varchar(256),
	"sector" varchar(256),
	"segment" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dividends" (
	"stock_id" serial NOT NULL,
	"type" varchar(100) DEFAULT 'Dividendo' NOT NULL,
	"value" numeric NOT NULL,
	"ownership_date" date NOT NULL,
	"payment_date" date NOT NULL,
	CONSTRAINT "dividends_stock_id_payment_date_pk" PRIMARY KEY("stock_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"stock_id" serial NOT NULL,
	"value" numeric NOT NULL,
	"price_date" date NOT NULL,
	CONSTRAINT "prices_stock_id_price_date_pk" PRIMARY KEY("stock_id","price_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(256),
	"ticker" varchar(7) NOT NULL,
	"company_id" serial NOT NULL,
	"free_float" numeric,
	"tag_along" numeric,
	"avg_daily_liquidity" bigint
);
--> statement-breakpoint
DROP TABLE "sc_balance_sheets";--> statement-breakpoint
DROP TABLE "sc_companies";--> statement-breakpoint
DROP TABLE "sc_dividends";--> statement-breakpoint
DROP TABLE "sc_prices";--> statement-breakpoint
DROP TABLE "sc_stocks";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheets_company_idx" ON "balance_sheets" ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheets_year_idx" ON "balance_sheets" ("year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dividends_stock_idx" ON "dividends" ("stock_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prices_stock_idx" ON "prices" ("stock_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "balance_sheets" ADD CONSTRAINT "balance_sheets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dividends" ADD CONSTRAINT "dividends_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prices" ADD CONSTRAINT "prices_stock_id_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "stocks" ADD CONSTRAINT "stocks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

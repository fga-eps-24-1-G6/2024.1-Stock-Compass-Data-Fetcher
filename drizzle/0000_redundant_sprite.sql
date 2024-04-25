CREATE TABLE IF NOT EXISTS "sc_balance_sheets" (
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
	CONSTRAINT "sc_balance_sheets_company_id_year_quarter_pk" PRIMARY KEY("company_id","year","quarter")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sc_companies" (
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
CREATE TABLE IF NOT EXISTS "sc_dividends" (
	"stock_id" serial NOT NULL,
	"type" varchar(100) DEFAULT 'Dividendo' NOT NULL,
	"value" numeric NOT NULL,
	"ownership_date" date NOT NULL,
	"payment_date" date NOT NULL,
	CONSTRAINT "sc_dividends_stock_id_payment_date_pk" PRIMARY KEY("stock_id","payment_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sc_prices" (
	"stock_id" serial NOT NULL,
	"value" numeric NOT NULL,
	"price_date" date NOT NULL,
	CONSTRAINT "sc_prices_stock_id_price_date_pk" PRIMARY KEY("stock_id","price_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sc_stocks" (
	"id" serial PRIMARY KEY NOT NULL,
	"external_id" varchar(256),
	"ticker" varchar(7) NOT NULL,
	"company_id" serial NOT NULL,
	"free_float" numeric,
	"tag_along" numeric,
	"avg_daily_liquidity" bigint
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheets_company_idx" ON "sc_balance_sheets" ("company_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "balance_sheets_year_idx" ON "sc_balance_sheets" ("year");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "dividends_stock_idx" ON "sc_dividends" ("stock_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prices_stock_idx" ON "sc_prices" ("stock_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sc_balance_sheets" ADD CONSTRAINT "sc_balance_sheets_company_id_sc_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "sc_companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sc_dividends" ADD CONSTRAINT "sc_dividends_stock_id_sc_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "sc_stocks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sc_prices" ADD CONSTRAINT "sc_prices_stock_id_sc_stocks_id_fk" FOREIGN KEY ("stock_id") REFERENCES "sc_stocks"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sc_stocks" ADD CONSTRAINT "sc_stocks_company_id_sc_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "sc_companies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

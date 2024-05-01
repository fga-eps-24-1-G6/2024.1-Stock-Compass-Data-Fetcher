ALTER TABLE "balance_sheets" DROP CONSTRAINT "balance_sheets_company_id_year_quarter_pk";--> statement-breakpoint
ALTER TABLE "dividends" DROP CONSTRAINT "dividends_stock_id_payment_date_pk";--> statement-breakpoint
ALTER TABLE "balance_sheets" ADD COLUMN "id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "dividends" ADD COLUMN "id" serial NOT NULL;
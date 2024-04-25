ALTER TABLE "prices" DROP CONSTRAINT "prices_stock_id_price_date_pk";--> statement-breakpoint
ALTER TABLE "prices" ADD COLUMN "id" serial NOT NULL;
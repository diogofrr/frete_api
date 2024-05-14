/*
  Warnings:

  - You are about to drop the column `status_request` on the `freight` table. All the data in the column will be lost.
  - You are about to drop the column `status_shipping` on the `freight` table. All the data in the column will be lost.
  - Added the required column `status_request` to the `freight_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status_shipping` to the `freight_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "freight" DROP COLUMN "status_request",
DROP COLUMN "status_shipping";

-- AlterTable
ALTER TABLE "freight_request" ADD COLUMN     "status_request" TEXT NOT NULL,
ADD COLUMN     "status_shipping" TEXT NOT NULL;

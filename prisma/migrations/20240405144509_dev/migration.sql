/*
  Warnings:

  - Added the required column `status_request` to the `freight_registration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "freight_registration" ADD COLUMN     "status_request" TEXT NOT NULL;

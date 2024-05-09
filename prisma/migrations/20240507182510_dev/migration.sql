-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_type" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_person" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "delivery_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" SERIAL NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "classif_weight" INTEGER NOT NULL,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight" (
    "id" SERIAL NOT NULL,
    "min_weight" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "freight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight_registration" (
    "id" SERIAL NOT NULL,
    "freight_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "delivery_person_id" INTEGER NOT NULL,
    "status_request" TEXT NOT NULL,

    CONSTRAINT "freight_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_registration" (
    "id" SERIAL NOT NULL,
    "delivery_person_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,

    CONSTRAINT "vehicle_registration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_person" ADD CONSTRAINT "delivery_person_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freight_registration" ADD CONSTRAINT "freight_registration_freight_id_fkey" FOREIGN KEY ("freight_id") REFERENCES "freight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freight_registration" ADD CONSTRAINT "freight_registration_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freight_registration" ADD CONSTRAINT "freight_registration_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "delivery_person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_registration" ADD CONSTRAINT "vehicle_registration_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "delivery_person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_registration" ADD CONSTRAINT "vehicle_registration_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

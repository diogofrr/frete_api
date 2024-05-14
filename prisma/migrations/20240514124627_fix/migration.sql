-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_type" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_person" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "delivery_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "classif_weight" INTEGER NOT NULL,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight" (
    "id" TEXT NOT NULL,
    "min_weight" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "status_request" TEXT NOT NULL,
    "status_shipping" TEXT NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "freight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight_registration" (
    "id" TEXT NOT NULL,
    "freight_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,

    CONSTRAINT "freight_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight_request" (
    "id" TEXT NOT NULL,
    "delivery_person_id" TEXT NOT NULL,
    "vehicle_register_id" TEXT NOT NULL,
    "freight_register_id" TEXT NOT NULL,

    CONSTRAINT "freight_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_registration" (
    "id" TEXT NOT NULL,
    "delivery_person_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,

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
ALTER TABLE "freight_request" ADD CONSTRAINT "freight_request_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "delivery_person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freight_request" ADD CONSTRAINT "freight_request_vehicle_register_id_fkey" FOREIGN KEY ("vehicle_register_id") REFERENCES "vehicle_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "freight_request" ADD CONSTRAINT "freight_request_freight_register_id_fkey" FOREIGN KEY ("freight_register_id") REFERENCES "freight_registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_registration" ADD CONSTRAINT "vehicle_registration_delivery_person_id_fkey" FOREIGN KEY ("delivery_person_id") REFERENCES "delivery_person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_registration" ADD CONSTRAINT "vehicle_registration_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

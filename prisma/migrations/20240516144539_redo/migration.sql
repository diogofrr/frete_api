-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "social_name" TEXT NOT NULL,
    "comercial_email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tel" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "profile_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_person" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cnh" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "account_number" INTEGER NOT NULL,
    "account_type" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "delivery_person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle" (
    "id" TEXT NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "classif_weight" INTEGER NOT NULL,

    CONSTRAINT "vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "min_weight" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,
    "tax" DOUBLE PRECISION NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "fragile" BOOLEAN NOT NULL,
    "extra_observation" TEXT NOT NULL,
    "total_value" DOUBLE PRECISION NOT NULL,
    "status_request" TEXT NOT NULL,
    "status_shipping" TEXT NOT NULL,

    CONSTRAINT "freight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight_registration" (
    "id" TEXT NOT NULL,
    "freight_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "freight_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "freight_request" (
    "id" TEXT NOT NULL,
    "delivery_person_id" TEXT NOT NULL,
    "vehicle_register_id" TEXT NOT NULL,
    "freight_register_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "freight_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_registration" (
    "id" TEXT NOT NULL,
    "delivery_person_id" TEXT NOT NULL,
    "vehicle_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "complement" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "freight_id" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_user_id_key" ON "company"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_person_user_id_key" ON "delivery_person"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "freight_registration_freight_id_key" ON "freight_registration"("freight_id");

-- CreateIndex
CREATE UNIQUE INDEX "freight_request_freight_register_id_key" ON "freight_request"("freight_register_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_registration_vehicle_id_key" ON "vehicle_registration"("vehicle_id");

-- CreateIndex
CREATE UNIQUE INDEX "address_freight_id_key" ON "address"("freight_id");

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

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_freight_id_fkey" FOREIGN KEY ("freight_id") REFERENCES "freight"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

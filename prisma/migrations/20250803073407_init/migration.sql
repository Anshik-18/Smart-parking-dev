-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('BOOKING_SUCCESS', 'SLOT_OCCUPIED', 'PAYMENT_FAILED', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Pre_booked', 'Completed', 'Cancelled', 'Parked');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."merchant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cardetails" (
    "id" SERIAL NOT NULL,
    "Carnumber" TEXT NOT NULL,
    "ownerid" INTEGER NOT NULL,
    "iselectric" BOOLEAN NOT NULL,
    "isparked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cardetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parkings" (
    "id" SERIAL NOT NULL,
    "userid" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "starttime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endtime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totaltime" TEXT NOT NULL DEFAULT '0 hour 0 min',
    "parkingslotid" INTEGER NOT NULL,
    "carnumber" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "parkings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."nonBooking_parking" (
    "id" SERIAL NOT NULL,
    "startime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endtime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totaltime" TEXT NOT NULL DEFAULT '0 Hours 0 minutes',
    "parkinglslotid" INTEGER NOT NULL,
    "carnumber" TEXT NOT NULL,

    CONSTRAINT "nonBooking_parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "From" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,
    "readen" BOOLEAN NOT NULL DEFAULT false,
    "Notfifcationtype" "public"."NotificationType" NOT NULL DEFAULT 'GENERAL',

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."parkinglot" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "Adress" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "merchantid" INTEGER NOT NULL,
    "totalslots" INTEGER NOT NULL,
    "occupiedslots" INTEGER NOT NULL DEFAULT 0,
    "vacantslots" INTEGER NOT NULL,
    "isempty" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "parkinglot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "public"."User"("number");

-- CreateIndex
CREATE UNIQUE INDEX "cardetails_Carnumber_key" ON "public"."cardetails"("Carnumber");

-- CreateIndex
CREATE UNIQUE INDEX "parkinglot_Name_key" ON "public"."parkinglot"("Name");

-- AddForeignKey
ALTER TABLE "public"."cardetails" ADD CONSTRAINT "cardetails_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkings" ADD CONSTRAINT "parkings_parkingslotid_fkey" FOREIGN KEY ("parkingslotid") REFERENCES "public"."parkinglot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."nonBooking_parking" ADD CONSTRAINT "nonBooking_parking_parkinglslotid_fkey" FOREIGN KEY ("parkinglslotid") REFERENCES "public"."parkinglot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."parkinglot" ADD CONSTRAINT "parkinglot_merchantid_fkey" FOREIGN KEY ("merchantid") REFERENCES "public"."merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

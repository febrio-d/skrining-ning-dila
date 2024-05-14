/*
  Warnings:

  - The primary key for the `fisik` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pasien` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `skor` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "fisik" DROP CONSTRAINT "fisik_id_pasien_fkey";

-- DropForeignKey
ALTER TABLE "skor" DROP CONSTRAINT "skor_id_pasien_fkey";

-- AlterTable
ALTER TABLE "fisik" DROP CONSTRAINT "fisik_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "id_pasien" SET DATA TYPE TEXT,
ADD CONSTRAINT "fisik_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "fisik_id_seq";

-- AlterTable
ALTER TABLE "pasien" DROP CONSTRAINT "pasien_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pasien_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pasien_id_seq";

-- AlterTable
ALTER TABLE "skor" DROP CONSTRAINT "skor_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "id_pasien" SET DATA TYPE TEXT,
ADD CONSTRAINT "skor_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "skor_id_seq";

-- AddForeignKey
ALTER TABLE "fisik" ADD CONSTRAINT "fisik_id_pasien_fkey" FOREIGN KEY ("id_pasien") REFERENCES "pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skor" ADD CONSTRAINT "skor_id_pasien_fkey" FOREIGN KEY ("id_pasien") REFERENCES "pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

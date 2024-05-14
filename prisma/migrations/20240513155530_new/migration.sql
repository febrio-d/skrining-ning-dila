/*
  Warnings:

  - You are about to drop the column `agama` on the `pasien` table. All the data in the column will be lost.
  - You are about to drop the column `alamat` on the `pasien` table. All the data in the column will be lost.
  - Added the required column `desa` to the `pasien` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pasien" DROP COLUMN "agama",
DROP COLUMN "alamat",
ADD COLUMN     "desa" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id_desa" INTEGER;

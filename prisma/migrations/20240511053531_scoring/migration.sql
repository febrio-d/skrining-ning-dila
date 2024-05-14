-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pasien" (
    "id" SERIAL NOT NULL,
    "nik" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nama_kk" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jk" TEXT NOT NULL,
    "lahir" TEXT NOT NULL,
    "agama" TEXT NOT NULL,
    "hp" TEXT NOT NULL,

    CONSTRAINT "pasien_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fisik" (
    "id" SERIAL NOT NULL,
    "id_pasien" INTEGER NOT NULL,
    "td" INTEGER[],
    "gd" INTEGER NOT NULL,
    "tb" INTEGER NOT NULL,
    "bb" INTEGER NOT NULL,

    CONSTRAINT "fisik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skor" (
    "id" SERIAL NOT NULL,
    "id_pasien" INTEGER NOT NULL,
    "kesehatan" INTEGER[],
    "penyakit" INTEGER[],
    "keluarga" INTEGER[],
    "pola" INTEGER[],
    "dm" INTEGER NOT NULL,
    "ht" INTEGER NOT NULL,
    "s" INTEGER NOT NULL,
    "j" INTEGER NOT NULL,
    "g" INTEGER NOT NULL,
    "oa" INTEGER NOT NULL,

    CONSTRAINT "skor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fisik_id_pasien_key" ON "fisik"("id_pasien");

-- CreateIndex
CREATE UNIQUE INDEX "skor_id_pasien_key" ON "skor"("id_pasien");

-- AddForeignKey
ALTER TABLE "fisik" ADD CONSTRAINT "fisik_id_pasien_fkey" FOREIGN KEY ("id_pasien") REFERENCES "pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skor" ADD CONSTRAINT "skor_id_pasien_fkey" FOREIGN KEY ("id_pasien") REFERENCES "pasien"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

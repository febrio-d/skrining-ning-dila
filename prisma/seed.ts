import { SHA1 } from "crypto-js";
import prisma from "../lib/prisma";

async function main() {
  const response = await Promise.all([
    prisma.users.create({
      data: {
        username: "admin",
        nama: "dr. Afrizal Kurniawan",
        password: SHA1("afrizal28").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "bogotanjung",
        id_desa: 0,
        nama: "Desa Bogotanjung",
        password: SHA1("bogotanjung").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "tlogoayu",
        id_desa: 1,
        nama: "Desa Tlogoayu",
        password: SHA1("tlogoayu").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "wuwur",
        id_desa: 2,
        nama: "Desa Wuwur",
        password: SHA1("wuwur").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "pantirejo",
        id_desa: 3,
        nama: "Desa Pantirejo",
        password: SHA1("pantirejo").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "sugihrejo",
        id_desa: 4,
        nama: "Desa Sugihrejo",
        password: SHA1("sugihrejo").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "mojolawaran",
        id_desa: 5,
        nama: "Desa Mojolawaran",
        password: SHA1("mojolawaran").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "karaban",
        id_desa: 6,
        nama: "Desa Karaban",
        password: SHA1("karaban").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "sambirejo",
        id_desa: 7,
        nama: "Desa Sambirejo",
        password: SHA1("sambirejo").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "kosekan",
        id_desa: 8,
        nama: "Desa Kosekan",
        password: SHA1("kosekan").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "kuryokalangan",
        id_desa: 9,
        nama: "Desa Kuryokalangan",
        password: SHA1("kuryokalangan").toString(),
      },
    }),
    prisma.users.create({
      data: {
        username: "gebang",
        id_desa: 10,
        nama: "Desa Gebang",
        password: SHA1("gebang").toString(),
      },
    }),
  ]);
  console.log(response);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

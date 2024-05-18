import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

export async function GET(request: Request) {
  try {
    const pasien = await prisma.pasien.findMany({
      include: { fisik: true, skor: true },
    });
    const resp = {
      error: false,
      // message: "Berhasil simpan skrining",
      data: pasien,
    };
    return NextResponse.json(resp);
  } catch (err) {
    const error = err as Error;
    console.error(error);
    const resp = {
      error: true,
      message: error.message,
    };
    return NextResponse.json(resp);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const cekPasien = await prisma.pasien.findFirst({
      where: {
        nik: body.pasien.nik,
        //   password: body.password,
      },
    });
    if (cekPasien)
      return NextResponse.json({
        error: false,
        message: "NIK tidak duplikat",
      });
    const id = v4();
    const pasien = prisma.pasien.create({
      data: {
        id: id,
        nik: body.pasien.nik,
        nama: body.pasien.nama,
        nama_kk: body.pasien.nama_kk,
        desa: body.desa,
        hp: body.pasien.hp,
        jk: body.pasien.jk,
        lahir: body.pasien.lahir,
      },
    });
    const fisik = prisma.fisik.create({
      data: {
        id_pasien: id,
        tb: body.pasien.tb,
        gd: body.pasien.gd,
        bb: body.pasien.bb,
      },
    });
    const skor = prisma.skor.create({
      data: {
        id_pasien: id,
        kesehatan: body.kesehatan,
        penyakit: body.penyakit,
        keluarga: body.penyakit_keluarga,
        pola: body.pola_makan,
        plusimt: body.plusimt,
        dm: body.skor.dm,
        g: body.skor.g,
        ht: body.skor.ht,
        j: body.skor.j,
        oa: body.skor.oa,
        s: body.skor.s,
      },
    });
    await prisma.$transaction([pasien, fisik, skor]);
    const resp = {
      error: false,
      message: "Berhasil simpan skrining",
    };
    return NextResponse.json(resp);
  } catch (err) {
    const error = err as Error;
    console.error(error);
    const resp = {
      error: true,
      message: error.message,
    };
    return NextResponse.json(resp);
  }
}

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const desaParam = searchParams.get("desa");
  const queryParam = searchParams.get("query");
  try {
    const pasien = await prisma.pasien.findMany({
      where: {
        ...(queryParam
          ? {
              OR: [
                { nama: { contains: queryParam, mode: "insensitive" } },
                { nik: { contains: queryParam, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(desaParam ? { desa: parseInt(desaParam) } : {}),
      },
      include: { fisik: true, skor: true },
      skip: page <= 1 ? 0 : (page - 1) * 25,
      take: 25,
    });
    const pasienCount = await prisma.pasien.count({
      where: {
        ...(queryParam
          ? {
              OR: [
                { nama: { contains: queryParam, mode: "insensitive" } },
                { nik: { contains: queryParam, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(desaParam ? { desa: parseInt(desaParam) } : {}),
      },
    });
    const resp = {
      error: false,
      // message: "Berhasil simpan skrining",
      data: pasien,
      pages: Math.ceil(pasienCount / 25),
      total: pasienCount,
    };
    return NextResponse.json(resp);
  } catch (err) {
    const error = err as Error;
    console.error(error);
    const resp = {
      error: true,
      message: error.message,
    };
    return NextResponse.json(resp, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
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
        error: true,
        message: "NIK telah terdaftar!",
      });
    const id = v4();
    const pasien = prisma.pasien.create({
      data: {
        id: id,
        nik: body.pasien.nik,
        nama: (body.pasien.nama as string)
          .split(" ")
          .map(
            (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
          )
          .join(" "),
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
        td: body.pasien.td,
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
        j: body.skor.j,
        s: body.skor.s,
        ht: body.skor.ht,
        oa: body.skor.oa,
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
    return NextResponse.json(resp, { status: 400 });
  }
}

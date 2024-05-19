import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pasien = await prisma.pasien.findFirst({
      where: {
        id: params.id,
      },
      include: {
        fisik: true,
        skor: true,
      },
    });
    const resp = {
      error: false,
      message: "Berhasil hapus pasien",
      pasien: pasien,
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const id = params.id;
  try {
    const pasien = prisma.pasien.update({
      where: {
        id: id,
      },
      data: {
        nik: body.pasien.nik,
        nama: (body.pasien.nama as string)
          .split(" ")
          .map(
            (val) => val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
          )
          .join(" "),
        nama_kk: body.pasien.nama_kk,
        hp: body.pasien.hp,
        jk: body.pasien.jk,
        lahir: body.pasien.lahir,
      },
    });
    const fisik = prisma.fisik.update({
      where: {
        id_pasien: id,
      },
      data: {
        tb: body.pasien.tb,
        td: body.pasien.td,
        gd: body.pasien.gd,
        bb: body.pasien.bb,
      },
    });
    const skor = prisma.skor.update({
      where: {
        id_pasien: id,
      },
      data: {
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
      message: "Berhasil ubah data pasien",
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hapus = await prisma.pasien.delete({
      include: {
        fisik: true,
        skor: true,
      },
      where: {
        id: params.id,
      },
    });
    const resp = {
      error: false,
      message: "Berhasil hapus pasien",
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

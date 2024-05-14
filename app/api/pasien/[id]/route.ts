import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      throw new Error("Kosong");
    }
    const pasien = await prisma.pasien.findFirst({
      where: {
        nik: params.id,
        //   password: body.password,
      },
    });
    if (!pasien)
      return NextResponse.json({
        error: false,
        message: "NIK tidak duplikat",
      });
    return NextResponse.json({
      error: true,
      message: "NIK telah terdaftar",
    });
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

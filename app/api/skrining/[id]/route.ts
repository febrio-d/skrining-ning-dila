import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    return NextResponse.json(resp);
  }
}

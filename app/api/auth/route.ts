import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AES, SHA1 } from "crypto-js";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    if (!body.username || !body.password) {
      throw new Error("Username atau Password tidak boleh kosong");
    }
    const user = await prisma.users.findFirst({
      where: {
        username: body.username,
        //   password: body.password,
      },
    });
    if (!user) throw new Error("Username atau password salah");
    const { password } = user;
    if (SHA1(body.password).toString() !== password)
      throw new Error("Username atau Password salah");
    const resp = {
      error: false,
      message: "Berhasil login",
      user: user,
    };
    if (resp.user?.nama) {
      cookies().set(
        "user",
        AES.encrypt(resp.user.nama, "pkmgabus2").toString(),
        { maxAge: 60 * 60 * 24 }
      );
      if (resp.user.id_desa)
        cookies().set("id_desa", String(resp.user.id_desa), {
          maxAge: 60 * 60 * 24,
        });
    }
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

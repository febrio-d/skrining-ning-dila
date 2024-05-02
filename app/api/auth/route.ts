// import { login } from "@/lib/actions";
// import { Users } from "@/lib/schema/users";
// import { AES } from "crypto-js";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";
// import * as dotenv from "dotenv";
// dotenv.config();

// export async function POST(request: Request) {
//   const body = await request.json();
//   const response: { error: boolean; message: string; user?: Users } =
//     await login(body);
//   if (response.user?.nama) {
//     cookies().set(
//       "user",
//       AES.encrypt(response.user.nama, process.env.SECRET_KEY).toString()
//     );
//   }
//   return NextResponse.json(response);
// }

import { NextResponse, NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
export default function middleware(request: NextRequest) {
  //   const token = request.cookies.get("token")?.value;
  //   const isAuth = !!token;
  //   const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  //   if (isAuth) {
  //     if (isAuthPage) {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //     return NextResponse.next();
  //   } else {
  //     if (!isAuthPage) {
  //       return NextResponse.redirect(new URL("/auth", request.url));
  //     }
  //   }
  return NextResponse.next();
  // }

  // // See "Matching Paths" below to learn more
  // export const config = {
  //   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

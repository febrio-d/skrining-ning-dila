import Pati from "@/assets/img/pati.png";
import User from "@/components/user";
import CryptoJS, { AES } from "crypto-js";
import { cookies } from "next/headers";
import Image from "next/image";

export const fetchCache = "force-no-store";
// export const revalidate = 0;
// export const dynamic = "force-dynamic";
export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthed = cookies().get("user") !== (null || undefined);
  const user = isAuthed
    ? AES.decrypt(cookies().get("user")?.value!, "pkmgabus2").toString(
        CryptoJS.enc.Utf8
      )
    : undefined;

  return (
    <main className="h-full">
      <div className="bg-slate-100 p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex sm:gap-2 items-center">
            <Image
              alt="Logo Pati"
              width={38}
              height={45}
              src={Pati}
              className="w-[38px] h-[45px]"
            />
            <div className="px-2 flex flex-col divide-y-2 divide-black items-start">
              <p className="sm:text-base hidden sm:block text-xs px-2 uppercase font-semibold">
                Puskesmas Gabus II
              </p>
              <p className="px-2 sm:text-sm hidden sm:block">
                Dinas Kesehatan Kabupaten Pati
              </p>
            </div>
          </div>
          <div className="flex justify-center mt-3 mb-5 items-center">
            <p className="font-semibold sm:text-lg text-sm antialiased">
              SKRINING DINI USIA LANJUT
            </p>
          </div>
          <User user={user} />
        </div>
      </div>
      <div className="min-h-[calc(100vh-128px)]">{children}</div>
      <div className="py-2 bg-white/10">
        <p className="text-sm">&copy; 2024 dr. Afrizal Kurniawan</p>
      </div>
    </main>
  );
}

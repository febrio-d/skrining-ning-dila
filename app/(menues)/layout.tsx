import Image from "next/image";
import Pati from "@/assets/img/pati.png";
import User from "@/components/user";

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full">
      <div className="bg-slate-100 p-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="flex gap-2 items-center">
            <Image
              alt="Logo Pati"
              width={38}
              height={45}
              src={Pati}
              className="w-[38px] h-[45px]"
            />
            <div className="px-2 flex flex-col divide-y-2 divide-black items-start">
              <p className="text-base px-2 uppercase font-semibold">
                Puskesmas Gabus II
              </p>
              <p className="px-2 text-sm">Dinas Kesehatan Kabupaten Pati</p>
            </div>
          </div>
          <div className="flex justify-center mt-3 mb-5 items-center">
            <p className="font-semibold text-lg antialiased">
              SKRINING DINI USIA LANJUT
            </p>
          </div>
          <User />
        </div>
      </div>
      <div className="min-h-[calc(100vh-128px)]">{children}</div>
      <div className="py-2 bg-white/10">
        <p className="text-sm">&copy; 2024 dr. Afrizal Kurniawan</p>
      </div>
    </main>
  );
}

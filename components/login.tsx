"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./form";
import Image from "next/image";
import Pati from "@/assets/img/pati.png";

export default function Login() {
  return (
    <>
      <div
        className={cn(
          "w-10/12 p-2 sm:w-[500px] sm:p-5 bg-slate-300 bg-opacity-50 rounded shadow-lg"
        )}
      >
        <div className="flex flex-row gap-2">
          <Image
            alt="Logo Pati"
            width={50}
            height={65}
            src={Pati}
            className="w-[50px] h-[65px]"
          />
          <div className="px-2 flex flex-col divide-y-2 divide-black items-start">
            <p className="text-lg px-2 uppercase font-semibold">
              Puskesmas Gabus II
            </p>
            <p className="px-2">Dinas Kesehatan Kabupaten Pati</p>
          </div>
        </div>
        <div className="flex justify-center mt-3 mb-5">
          <p className="font-semibold text-lg antialiased">
            SKRINING DINI USIA LANJUT
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <Input placeholder="Username" />
          <Input type="password" placeholder="Password" />
          <Button className="w-full justify-center mt-4">Login</Button>
        </div>
      </div>
    </>
  );
}

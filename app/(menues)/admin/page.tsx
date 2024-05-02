"use client";

import { Button } from "@/components/button";
import { MyOption, MyOptions, SelectInput } from "@/components/select";
import { cn } from "@/lib/utils";
import { desa } from "@/lib/types";
import { useEffect, useState } from "react";

export default function Admin() {
  const [semuaDesa] = useState<MyOption>({ label: "Semua Desa", value: 99 });
  const [desaOptions, setDesaOptions] = useState<MyOptions>([semuaDesa]);
  const [selDesa, setSelDesa] = useState<MyOption | null>(semuaDesa);
  useEffect(() => {
    setDesaOptions((p) => [
      ...p.slice(0, 1),
      ...desa.map((val, idx) => ({ label: val, value: idx })),
    ]);
  }, [desa]);

  const [tempPasien] = useState([
    { nama: "Sukinem", desa: 4, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
    { nama: "Paijo", desa: 4, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
    { nama: "Pardi", desa: 8, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
    { nama: "Muslihat", desa: 1, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
    { nama: "Hartiyem", desa: 2, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
    { nama: "Parto", desa: 1, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
    { nama: "Sarmini", desa: 3, dm: 3, ht: 5, s: 1, j: 3, g: 2, oa: 1 },
  ]);

  return (
    <div className="flex min-h-full justify-center p-4 text-center">
      <div className="flex w-full flex-col gap-3">
        <div className="flex justify-between">
          <SelectInput
            placeholder="Desa"
            options={desaOptions}
            value={selDesa}
            onChange={(option) => setSelDesa(option as MyOption)}
            size="sm"
            className="w-40 text-left"
          />
          <Button
            className="px-2 py-0.5 text-xs"
            color="green"
            // disabled={billing.data?.status === 2}
            // onClick={() => setTindakanDialog(true)}
          >
            Tambah
          </Button>
        </div>
        <div
          className={cn("mt-1 w-full overflow-hidden rounded text-sm shadow")}
        >
          <table className="min-w-full">
            <thead>
              <tr className="divide-x divide-slate-50 bg-slate-300/70">
                <td className={cn("px-4 py-2")}>No.</td>
                <td className={cn("px-4 py-2")}>Pasien</td>
                <td className={cn("px-4 py-2")}>Desa</td>
                <td className={cn("px-3 py-2")}>DM</td>
                <td className={cn("px-3 py-2")}>HT</td>
                <td className={cn("px-3 py-2")}>S</td>
                <td className={cn("px-3 py-2")}>J</td>
                <td className={cn("px-3 py-2")}>G</td>
                <td className={cn("px-3 py-2")}>OA</td>
                <td className={cn("px-4 py-2 text-center")}>*</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tempPasien.map((val, idx) => (
                <tr className="bg-white hover:text-sky-600" key={idx}>
                  <td className="whitespace-pre-wrap px-4 py-2">
                    {idx + 1 + "."}
                  </td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.nama}</td>
                  <td className="whitespace-pre-wrap px-4 py-2">
                    {desa.find((_, idx) => idx === val.desa)}
                  </td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.dm}</td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.ht}</td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.s}</td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.j}</td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.g}</td>
                  <td className="whitespace-pre-wrap px-4 py-2">{val.oa}</td>
                  <td className="whitespace-pre-wrap px-4 py-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

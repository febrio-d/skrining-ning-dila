"use client";

import { Button } from "@/components/button";
import { MyOption, MyOptions, SelectInput } from "@/components/select";
import { desa, penyakit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import type { fisik, pasien, skor } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function Admin() {
  const { push } = useRouter();
  const [semuaDesa] = useState<MyOption>({ label: "Semua Desa", value: 99 });
  const [desaOptions, setDesaOptions] = useState<MyOptions>([semuaDesa]);
  const [selDesa, setSelDesa] = useState<MyOption | null>(semuaDesa);
  useEffect(() => {
    setDesaOptions((p) => [
      ...p.slice(0, 1),
      ...desa.map((val, idx) => ({ label: val, value: idx })),
    ]);
  }, [desa]);

  const [data, setData] = useState<
    (pasien & { fisik: fisik | null; skor: skor | null })[]
  >([]);
  const loadData = async () => {
    try {
      const resp = await fetch(`api/skrining`, {
        method: "GET",
      });
      const json = await resp.json();
      if (json.error) throw new Error(json.message);
      setData(json.data);
    } catch (err) {
      toast.error("Pasien kosong", { position: "top-right" });
    }
  };

  const initialized = useRef<boolean>(false);
  useEffect(() => {
    if (!initialized.current) {
      loadData();
      initialized.current = true;
    }
  }, []);

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
          <div className="flex gap-2">
            <Button
              className="px-2 py-0.5 text-xs"
              color="green"
              onClick={() => push("/")}
            >
              Tambah
            </Button>
            <Menu as={React.Fragment}>
              <div className="relative">
                <Menu.Button
                  className={cn(
                    "inline-flex text-center text-sm focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
                    "rounded-md bg-gray-900/20 font-semibold text-gray-700 active:bg-slate-300",
                    "p-2 py-1.5"
                  )}
                >
                  <RiArrowDropDownLine className="h-5 w-5" />
                </Menu.Button>
                <Transition
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-30 mt-1 w-60 rounded-md bg-gray-200 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {penyakit.map((val) => (
                      <div className="p-0.5" key={val.label}>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              className={cn(
                                // "group flex w-full items-center rounded-md px-2 py-2 text-sm",
                                "relative flex w-full items-center rounded-md p-2 text-sm",
                                active
                                  ? "bg-slate-200 text-sky-600"
                                  : "text-gray-900"
                              )}
                              target="_blank"
                              href={val.link}
                            >
                              {val.label}
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    ))}
                  </Menu.Items>
                </Transition>
              </div>
            </Menu>
          </div>
        </div>
        <div
          className={cn("mt-1 w-full overflow-hidden rounded text-sm shadow")}
        >
          <table className="min-w-full">
            <thead>
              <tr className="divide-x divide-slate-50 bg-slate-300/70 *:px-4 *:py-2">
                <td>No.</td>
                <td>NIK</td>
                <td>Pasien</td>
                <td>Desa</td>
                <td className="px-3 text-[10px]/[14px]">Obesitas</td>
                <td className="px-3 text-[10px]/[14px]">Diabetes Mellitus</td>
                <td className="px-3 text-[10px]/[14px]">Hipertensi</td>
                <td className="px-3 text-[10px]/[14px]">Stroke</td>
                <td className="px-3 text-[10px]/[14px]">Penyakit Jantung</td>
                <td className="px-3 text-[10px]/[14px]">Gagal Ginjal</td>
                <td className="px-3 text-[10px]/[14px]">Osteoarthritis</td>
                <td className="text-center">*</td>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data
                .filter((val) =>
                  selDesa?.value !== 99 ? val.desa === selDesa?.value : val
                )
                .map((val, idx) => (
                  <tr className="bg-white hover:text-sky-600" key={idx}>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {idx + 1 + "."}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">{val.nik}</td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.nama}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {desa.find((_, idx) => idx === val.desa)}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      <div className="flex items-center justify-center h-full">
                        <input
                          type="checkbox"
                          className="size-4 my-auto accent-slate-700"
                          checked={val.skor?.plusimt || false}
                          disabled
                        />
                      </div>
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.skor?.dm}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.skor?.ht}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.skor?.s}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.skor?.j}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.skor?.g}
                    </td>
                    <td className="whitespace-pre-wrap px-4 py-2">
                      {val.skor?.oa}
                    </td>
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

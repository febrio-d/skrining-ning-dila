"use client";

import { Button } from "@/components/button";
import EdukasiPenyakit from "@/components/edukasi-penyakit";
import { Pagination } from "@/components/pagination";
import Search from "@/components/search";
import { MyOption, MyOptions, SelectInput } from "@/components/select";
import ViewPasien, { ViewAction, ViewState } from "@/components/view-pasien";
import { desa } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import type { fisik, pasien, skor } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useReducer, useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbEditCircle, TbTrash } from "react-icons/tb";

export default function Admin() {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const desaParam = searchParams.get("desa");
  const queryParam = searchParams.get("query");

  const [semuaDesa] = useState<MyOption>({ label: "Semua Desa", value: 99 });
  const [desaOptions, setDesaOptions] = useState<MyOptions>([semuaDesa]);
  const [selDesa, setSelDesa] = useState<MyOption | null>(semuaDesa);

  const setDesa = (newDesa: number) => {
    const params = new URLSearchParams(searchParams);
    if (newDesa === 99) {
      params.delete("desa");
    } else {
      params.set("desa", newDesa.toString());
    }
    push(`${pathname}?${params.toString()}`);
  };
  useEffect(() => {
    setDesaOptions((p) => [
      ...p.slice(0, 1),
      ...desa.map((val, idx) => ({ label: val, value: idx })),
    ]);
  }, [desa]);

  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [mutate, setMutate] = useState<boolean>(false);
  const [data, setData] = useState<
    (pasien & { fisik: fisik | null; skor: skor | null })[]
  >([]);
  const loadData = async () => {
    setMutate(true);
    const desaUrlParam = !!desaParam ? `&desa=${desaParam}` : "";
    const queryUrlParam = !!queryParam ? `&query=${queryParam}` : "";
    try {
      const resp = await fetch(
        `api/skrining?page=${page + desaUrlParam + queryUrlParam}`,
        {
          method: "GET",
        }
      );
      const json = await resp.json();
      if (json.error) throw new Error(json.message);
      setData(json.data);
      setTotal(parseInt(json.total));
      setTotalPages(parseInt(json.pages));
    } catch (err) {
      toast.error("Pasien kosong", { position: "top-right" });
      setTotal(0);
    } finally {
      setMutate(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, desaParam, queryParam]);

  const viewState = {
    modal: false,
    data: undefined,
  };
  const viewActs = (state: ViewState, action: ViewAction) => {
    return {
      ...action,
    };
  };
  const [view, viewDispatch] = useReducer(viewActs, viewState);

  type HapusState = {
    modal: boolean;
    data?: pasien & { fisik: fisik | null; skor: skor | null };
  };
  type HapusAction = HapusState;
  const hapusState = {
    modal: false,
    desa: undefined,
    data: undefined,
  };
  const hapusActs = (state: HapusState, action: HapusAction) => {
    return {
      ...action,
    };
  };
  const [hapus, hapusDispatch] = useReducer(hapusActs, hapusState);
  const [hapusMutate, setHapusMutate] = useState<boolean>(false);
  const handleHapus = async () => {
    setHapusMutate(true);
    try {
      const resp = await fetch(`/api/skrining/${hapus.data?.id}`, {
        method: "DELETE",
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.message);
      hapusDispatch({ modal: false });
      toast.success(data?.message);
      loadData();
    } catch (error) {
      toast.error("Hapus pasien gagal");
      console.error(error);
    } finally {
      setHapusMutate(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full justify-center p-4 text-center">
        <div className="flex w-full flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <SelectInput
                placeholder="Desa"
                options={desaOptions}
                value={selDesa}
                onChange={(option) => {
                  setSelDesa(option as MyOption);
                  setDesa((option as MyOption).value as number);
                }}
                size="sm"
                className="w-28 sm:w-40 text-left"
              />
              <div className="basis-32 sm:basis-40">
                <Search />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                className="px-2 py-0 h-7 text-xs"
                color="green"
                onClick={() => push("/")}
              >
                Tambah
              </Button>
              <EdukasiPenyakit className="h-7 py-1" />
            </div>
          </div>
          <div
            className={cn("mt-1 w-full overflow-x-auto rounded text-sm shadow")}
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
                {mutate ? (
                  [...Array(25)].map((_, idx) => (
                    <tr className="bg-white animate-pulse" key={idx}>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-6 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-36 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-16 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-16 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <div className="flex items-center justify-center h-full">
                          <input
                            type="checkbox"
                            className="size-4 my-auto accent-slate-700"
                            disabled
                          />
                        </div>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-4 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-4 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-4 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-4 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-4 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <p className="mx-auto h-5 w-4 rounded bg-slate-200"></p>
                      </td>
                      <td className="whitespace-pre-wrap px-4 py-2">
                        <div className="flex gap-2 items-center justify-center">
                          <TbEditCircle
                            size="1.2rem"
                            className="text-slate-200"
                          />
                          <TbTrash size="1.2rem" className="text-slate-200" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : total === 0 ? (
                  <tr>
                    <td colSpan={12} className="h-14">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  data.map((val, idx) => {
                    const numberPage = page <= 1 ? 0 : (page - 1) * 25;
                    const nomor = idx + 1 + numberPage;
                    const namaDesa = desa.find((_, idx) => idx === val.desa);
                    return (
                      <tr className="bg-white hover:text-sky-600" key={idx}>
                        <td className="whitespace-pre-wrap px-4 py-2">
                          {nomor + "."}
                        </td>
                        <td className="whitespace-pre-wrap px-4 py-2">
                          {val.nik}
                        </td>
                        <td className="whitespace-pre-wrap px-4 py-2">
                          {val.nama}
                        </td>
                        <td className="whitespace-pre-wrap px-4 py-2">
                          {namaDesa}
                        </td>
                        <td className="whitespace-pre-wrap px-4 py-2">
                          <div className="flex items-center justify-center h-full">
                            <input
                              type="checkbox"
                              className="size-4 my-auto accent-slate-700"
                              checked={val.skor?.plusimt || false}
                              readOnly
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
                        <td className="whitespace-pre-wrap px-4 py-2">
                          <div className="flex gap-2 items-center justify-center">
                            <button
                              type="button"
                              className="focus:outline-none"
                              onClick={() =>
                                viewDispatch({
                                  modal: true,
                                  desa: namaDesa,
                                  data: val,
                                })
                              }
                            >
                              <TbEditCircle
                                size="1.2rem"
                                className="text-sky-500 hover:text-sky-600 active:text-sky-700"
                              />
                            </button>
                            <button
                              type="button"
                              className="focus:outline-none"
                              onClick={() =>
                                hapusDispatch({
                                  modal: true,
                                  data: val,
                                })
                              }
                            >
                              <TbTrash
                                size="1.2rem"
                                className="text-red-500 hover:text-red-600 active:text-red-700"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center">
            <Pagination page={page} totalPages={totalPages} total={total} />
          </div>
        </div>
      </div>

      <ViewPasien view={view} viewDispatch={viewDispatch} loadData={loadData} />

      <Transition show={hapus.modal} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-[1001]"
          onClose={() =>
            hapusDispatch({
              modal: false,
              data: hapus.data,
            })
          }
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-50"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="p"
                    className="font-bold leading-6 text-gray-900"
                  >
                    Hapus Data Pasien
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{hapus.data?.nik}</p>
                    <p className="text-sm text-gray-500">{hapus.data?.nama}</p>
                    <p className="text-sm text-gray-500">
                      {"Desa " +
                        desa.find((_, idx) => idx === hapus.data?.desa)}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end gap-1">
                    <Button
                      color="red100"
                      onClick={handleHapus}
                      loading={hapusMutate}
                    >
                      Hapus
                    </Button>
                    <Button
                      color="red"
                      onClick={() =>
                        hapusDispatch({
                          modal: false,
                          data: hapus.data,
                        })
                      }
                    >
                      Batal
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

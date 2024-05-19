"use client";

import { Input } from "@/components/form";
import { SelectInput } from "@/components/select";
import { desa } from "@/lib/types";
import { cn, getAgeAll } from "@/lib/utils";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Button } from "./button";
import EdukasiPenyakit from "./edukasi-penyakit";
import { Schema, SchemaT } from "@/lib/schema";
import {
  KatPenyakit,
  skriningPolaMakan,
  skriningRiwKeluarga,
  skriningRiwKesehatan,
  skriningRiwPenyakit,
} from "@/lib/skrining";

export default function Template({ user }: { user: string | undefined }) {
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    control,
    formState: { errors },
  } = useForm<SchemaT>({
    resolver: zodResolver(Schema),
  });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const nik = watch("pasien.nik");
  useEffect(() => {
    if (!nik || nik.length < 16) return;
    cekNik();
  }, [nik]);
  const cekNik = async () => {
    if (!nik || nik.length < 16) return;
    try {
      const resp = await fetch(`api/pasien/${nik}`, {
        method: "GET",
      });
      const json = await resp.json();
      if (json.error) throw new Error(json.message);
    } catch (err) {
      toast.error("NIK telah terdaftar", { position: "top-right" });
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);
  useEffect(() => {
    console.log("errors: ", errors);
  }, [errors]);

  const [userDesa, setUserDesa] = useState<boolean>(false);
  const id_desa = Cookies.get("id_desa");
  useEffect(() => {
    if (!id_desa) return;
    setDesaIdx(parseInt(id_desa));
    setTimeout(() => {
      setUserDesa(true);
    }, 1000);
  }, [id_desa]);

  const [desaIdx, setDesaIdx] = useState<number>(0);

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => {
  //     if (name?.includes("penyakit")) {
  //       // console.log(
  //       //   skriningRiwPenyakit.flatMap((skrin, idx) =>
  //       //     skrin.kategori?.includes("DM") ? [idx] : []
  //       //   )
  //       // );
  //       console.log(
  //         watch("kesehatan")
  //           ?.filter((_, i) =>
  //             skriningRiwPenyakit
  //               .flatMap((skrin, idx) =>
  //                 skrin.kategori?.includes("DM") ? [idx] : []
  //               )
  //               .includes(i)
  //           )
  //           ?.reduce((acc, val) => acc + val, 0)
  //       );
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  const initialized = useRef<boolean>(false);
  useEffect(() => {
    if (!initialized.current) {
      setValue(
        "kesehatan",
        Array.from({ length: skriningRiwKesehatan.length }, () => 0)
      );
      setValue(
        "penyakit",
        Array.from({ length: skriningRiwPenyakit.length }, () => 0)
      );
      setValue(
        "penyakit_keluarga",
        Array.from({ length: skriningRiwKeluarga.length }, () => 0)
      );
      setValue(
        "pola_makan",
        Array.from({ length: skriningPolaMakan.length }, () => 0)
      );
      initialized.current = true;
    }
  }, []);

  const tb = watch("pasien.tb");
  const bb = watch("pasien.bb");
  const IMT = useMemo(() => {
    return tb?.toString().length > 2 && bb?.toString().length > 1
      ? (bb / (((tb / 100) * tb) / 100) || 0).toFixed(1)
      : "";
  }, [bb, tb]);

  const PlusIMT = parseInt(IMT) >= 30 ? 1 : 0;

  const KesehatanScoreFunc = (ill: KatPenyakit): number => {
    return watch("kesehatan")
      ?.filter((_, i) =>
        skriningRiwKesehatan
          .flatMap((skrin, idx) => (skrin.kategori?.includes(ill) ? [idx] : []))
          .includes(i)
      )
      ?.reduce((acc, val) => acc + val, 0);
  };

  const PenyakitScoreFunc = (ill: KatPenyakit): number => {
    return watch("penyakit")
      ?.filter((_, i) =>
        skriningRiwPenyakit
          .flatMap((skrin, idx) => (skrin.kategori?.includes(ill) ? [idx] : []))
          .includes(i)
      )
      ?.reduce((acc, val) => acc + val, 0);
  };

  const KeluargaScoreFunc = (ill: KatPenyakit): number => {
    return watch("penyakit_keluarga")
      ?.filter((_, i) =>
        skriningRiwKeluarga
          .flatMap((skrin, idx) => (skrin.kategori?.includes(ill) ? [idx] : []))
          .includes(i)
      )
      ?.reduce((acc, val) => acc + val, 0);
  };

  const PolaScoreFunc = (ill: KatPenyakit): number => {
    return watch("pola_makan")
      ?.filter((_, i) =>
        skriningPolaMakan
          .flatMap((skrin, idx) => (skrin.kategori?.includes(ill) ? [idx] : []))
          .includes(i)
      )
      ?.reduce((acc, val) => acc + val, 0);
  };

  const dm =
    KesehatanScoreFunc("DM") +
    PenyakitScoreFunc("DM") +
    KeluargaScoreFunc("DM") +
    PolaScoreFunc("DM") +
    PlusIMT;
  const ht =
    KesehatanScoreFunc("HT") +
    PenyakitScoreFunc("HT") +
    KeluargaScoreFunc("HT") +
    PolaScoreFunc("HT") +
    PlusIMT;
  const s =
    KesehatanScoreFunc("S") +
    PenyakitScoreFunc("S") +
    KeluargaScoreFunc("S") +
    PolaScoreFunc("S") +
    PlusIMT;
  const j =
    KesehatanScoreFunc("J") +
    PenyakitScoreFunc("J") +
    KeluargaScoreFunc("J") +
    PolaScoreFunc("J") +
    PlusIMT;
  const g =
    KesehatanScoreFunc("G") +
    PenyakitScoreFunc("G") +
    KeluargaScoreFunc("G") +
    PolaScoreFunc("G") +
    PlusIMT;
  const oa =
    KesehatanScoreFunc("OA") +
    PenyakitScoreFunc("OA") +
    KeluargaScoreFunc("OA") +
    PolaScoreFunc("OA") +
    PlusIMT;

  const [loading, setLoading] = useState<boolean>(false);
  const [showSkor, setShowSkor] = useState<boolean>(false);
  const [showSkrining, setShowSkrining] = useState<boolean>(true);

  // const loadData = async () => {
  //   try {
  //     const resp = await fetch(
  //       `api/skrining/1b6881eb-f5b9-49a6-bc0e-7ee99bbdf262`,
  //       {
  //         method: "GET",
  //       }
  //     );
  //     const json = await resp.json();
  //     if (json.error) throw new Error(json.message);
  //     setValue("penyakit", json.penyakit);
  //     setValue("kesehatan", json.kesehatan);
  //     setValue("penyakit_keluarga", json.keluarga);
  //     setValue("pola_makan", json.pola);
  //   } catch (err) {
  //     toast.error("Pasien kosong", { position: "top-right" });
  //   }
  // };

  return (
    <form
      onSubmit={handleSubmit(async (data, e) => {
        e?.preventDefault();
        setLoading(true);
        try {
          const resp = await fetch("/api/skrining", {
            method: "POST",
            body: JSON.stringify({
              ...data,
              desa: desaIdx,
              plusimt: PlusIMT === 1,
              skor: {
                dm: dm,
                ht: ht,
                s: s,
                j: j,
                g: g,
                oa: oa,
              },
            }),
          });
          const json = await resp.json();
          if (json.error) throw new Error(json.message);
          toast.success("Skrining berhasil disimpan");
          setSubmitted(true);
        } catch (err) {
          const error = err as Error;
          toast.error(error.message);
          console.error(error);
        } finally {
          setLoading(false);
        }
      })}
      className="flex w-full transform flex-col gap-3 overflow-visible p-6 text-left align-middle transition-all"
    >
      <div className="gap-1 hidden sm:flex">
        <Tab.Group
          selectedIndex={desaIdx}
          onChange={(index) => {
            setDesaIdx(index);
          }}
        >
          <Tab.List className="flex flex-1 space-x-0.5 rounded-md bg-gray-900/20 p-0.5">
            {desa.map((d) => (
              <Tab
                disabled={userDesa}
                className={cn(
                  "w-full rounded py-1.5 text-sm leading-5 text-gray-700 focus:outline-none ui-selected:bg-white ui-selected:shadow ui-disabled:bg-gray-900/20 ui-not-selected:hover:bg-white/[0.12]"
                )}
                key={d}
              >
                {d}
              </Tab>
            ))}
          </Tab.List>
        </Tab.Group>
        <EdukasiPenyakit />
      </div>
      <div
        className={cn(
          "grid sm:grid-cols-7 gap-2 rounded-md border p-2 shadow relative pt-10 bg-slate-100",
          "grid-cols-3"
        )}
      >
        <p className="absolute left-1/2 -translate-x-1/2 text-base text-center top-1 font-semibold underline">
          Form Pasien
        </p>
        <div
          className={cn("grid", errors.pasien?.nik && "rounded-lg bg-red-100")}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="nik" className="text-sm font-medium text-gray-900">
              NIK
            </label>
            {errors.pasien?.nik ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.nik.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="nik"
            {...register("pasien.nik", {
              onChange: () => trigger("pasien.nik"),
            })}
          />
        </div>
        <div
          className={cn("grid", errors.pasien?.nama && "rounded-lg bg-red-100")}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="nama" className="text-sm font-medium text-gray-900">
              Nama
            </label>
            {errors.pasien?.nama ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.nama.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="nama"
            {...register("pasien.nama")}
          />
        </div>
        <div
          className={cn(
            "grid",
            errors.pasien?.nama_kk && "rounded-lg bg-red-100"
          )}
        >
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="nama_kk"
              className="text-sm font-medium text-gray-900"
            >
              Nama KK
            </label>
            {errors.pasien?.nama_kk ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.nama_kk.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="nama_kk"
            {...register("pasien.nama_kk")}
          />
        </div>
        <div
          className={cn("grid", errors.pasien?.jk && "rounded-lg bg-red-100")}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="jk" className="text-sm font-medium text-gray-900">
              Jenis Kelamin
            </label>
            {errors.pasien?.jk ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.jk.message}
              </p>
            ) : null}
          </div>
          <Controller
            control={control}
            name="pasien.jk"
            render={({ field: { onChange, value } }) => {
              const options = ["Laki-laki", "Perempuan"].map((val) => ({
                label: val,
                value: val,
              }));

              return (
                <SelectInput
                  size="sm"
                  noOptionsMessage={(e) => "Tidak ada pilihan"}
                  onChange={(val: any) => onChange(val.value)}
                  options={options}
                  value={options.find((c) => c.value === value)}
                  placeholder="Pilih..."
                />
              );
            }}
          />
        </div>
        <div className={cn(errors.pasien?.lahir && "rounded-lg bg-red-100")}>
          <div className="flex items-baseline justify-between">
            <label htmlFor="tgl" className="text-sm font-medium text-gray-900">
              Tanggal Lahir
            </label>
            {errors.pasien?.lahir ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.lahir.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="tgl"
            type="date"
            {...register("pasien.lahir")}
          />
        </div>
        <div className={cn("grid")}>
          <div className="flex items-baseline justify-between">
            <label htmlFor="tgl" className="text-sm font-medium text-gray-900">
              Umur
            </label>
          </div>
          <Input
            className="px-2 py-1 text-xs"
            readOnly
            value={
              watch("pasien.lahir")
                ? getAgeAll(new Date(watch("pasien.lahir")))
                : ""
            }
          />
        </div>
        <div
          className={cn("grid", errors.pasien?.hp && "rounded-lg bg-red-100")}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="hp" className="text-sm font-medium text-gray-900">
              No. HP
            </label>
            {errors.pasien?.hp ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.hp.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="hp"
            {...register("pasien.hp")}
          />
        </div>
        <div
          className={cn(
            "grid max-w-xs",
            errors.pasien?.td && "rounded-lg bg-red-100"
          )}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="td" className="text-sm font-medium text-gray-900">
              TD
            </label>
            {errors.pasien?.td ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.td.message}
              </p>
            ) : null}
          </div>
          <div className="flex items-center justify-center gap-1">
            <div className="relative flex-1">
              <Input
                type="number"
                className="py-1 pl-2 pr-7 text-xs"
                placeholder="SYS"
                {...register("pasien.td.0", {
                  valueAsNumber: true,
                })}
                onWheel={(e) => e.currentTarget.blur()}
                onInput={(e: React.FocusEvent<HTMLInputElement, Element>) => {
                  +e.target.value < 0 && setValue("pasien.td.0", 0);
                  +e.target.value > 250 && setValue("pasien.td.0", 250);
                }}
              />
              <div className="absolute inset-y-0 items-center flex right-1.5 top-0 bottom-0 align-middle">
                <p className="text-[8px]/[10px]">mmHg</p>
              </div>
            </div>
            <span>/</span>
            <div className="relative flex-1">
              <Input
                type="number"
                className="py-1 pl-2 pr-7 text-xs"
                placeholder="DIA"
                {...register("pasien.td.1", {
                  valueAsNumber: true,
                })}
                onWheel={(e) => e.currentTarget.blur()}
                onInput={(e: React.FocusEvent<HTMLInputElement, Element>) => {
                  +e.target.value < 0 && setValue("pasien.td.1", 0);
                  +e.target.value > 180 && setValue("pasien.td.1", 180);
                }}
              />
              <div className="absolute inset-y-0 items-center flex right-1.5 top-0 bottom-0 align-middle">
                <p className="text-[8px]/[10px]">mmHg</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn("grid", errors.pasien?.gd && "rounded-lg bg-red-100")}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="gd" className="text-sm font-medium text-gray-900">
              Gula Darah
            </label>
            {errors.pasien?.gd ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.gd.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="gd"
            {...register("pasien.gd", {
              valueAsNumber: true,
            })}
          />
        </div>
        <div className="flex gap-2">
          <div
            className={cn("grid", errors.pasien?.tb && "rounded-lg bg-red-100")}
          >
            <div className="flex items-baseline justify-between">
              <label htmlFor="tb" className="text-sm font-medium text-gray-900">
                TB
              </label>
              {errors.pasien?.tb ? (
                <p className="pr-0.5 text-xs text-red-500">
                  {errors.pasien.tb.message}
                </p>
              ) : null}
            </div>
            <div className="relative">
              <Input
                type="number"
                className="pl-2 pr-4 py-1 text-xs"
                id="tb"
                {...register("pasien.tb", {
                  valueAsNumber: true,
                })}
              />
              <div className="absolute inset-y-0 items-center flex right-1.5 top-0 bottom-0 align-middle">
                <p className="text-[8px]/[10px]">cm</p>
              </div>
            </div>
          </div>
          <div
            className={cn("grid", errors.pasien?.bb && "rounded-lg bg-red-100")}
          >
            <div className="flex items-baseline justify-between">
              <label htmlFor="bb" className="text-sm font-medium text-gray-900">
                BB
              </label>
              {errors.pasien?.bb ? (
                <p className="pr-0.5 text-xs text-red-500">
                  {errors.pasien.bb.message}
                </p>
              ) : null}
            </div>
            <div className="relative">
              <Input
                type="number"
                className="pl-2 pr-4 py-1 text-xs"
                id="bb"
                {...register("pasien.bb", {
                  valueAsNumber: true,
                  onChange: () => trigger("pasien"),
                })}
              />
              <div className="absolute inset-y-0 items-center flex right-1.5 top-0 bottom-0 align-middle">
                <p className="text-[8px]/[10px]">kg</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-baseline justify-between">
            <label htmlFor="imt" className="text-sm font-medium text-gray-900">
              IMT
            </label>
          </div>
          <p className="my-auto text-xs">{IMT}</p>
        </div>
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            className="rounded-md"
            color="cyan"
            onClick={() => {
              push("/admin");
            }}
          >
            List Pasien
          </Button>
          <Button
            className="rounded-md"
            color="green"
            onClick={async () => {
              cekNik();
              const cek = await trigger("pasien");
              console.log("pasien: ", cek);
              console.log("errors: ", errors);
              if (cek && nik.length === 16) {
                setShowSkrining(true);
              }
            }}
          >
            Cek Pasien
          </Button>
        </div>
      </div>
      <Transition
        unmount
        show={showSkrining}
        as={React.Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="grid sm:grid-cols-2 gap-2 px-4 pb-12 rounded-md border relative bg-slate-100">
          <div className="relative col-span-2 flex w-full top-1 justify-center">
            <p className="absolute left-1/2 -translate-x-1/2 text-base text-center font-semibold underline">
              Form Skrining
            </p>
            <div className="ml-auto">
              <Button onClick={() => setShowSkor(true)} disabled={false}>
                Skor
              </Button>
            </div>
          </div>
          <div className="border shadow bg-slate-50">
            <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
              Riwayat Kesehatan
            </p>
            <div className={cn("grid gap-2 p-2")}>
              {skriningRiwKesehatan.map((val, idx) => (
                <div
                  key={val.pertanyaan}
                  className={cn("flex flex-col gap-1 py-2 text-sm")}
                >
                  <label
                    className="font-semibold"
                    // htmlFor={`${detailId}-${1}`}
                    // key={detailId}
                  >
                    {idx + 1}
                    {". "}
                    {val.pertanyaan}
                  </label>
                  <Controller
                    control={control}
                    name={`kesehatan.${idx}`}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <div
                        className={cn(
                          // "mb-2 flex flex-wrap items-center justify-start"
                          "grid grid-flow-row auto-rows-fr items-start justify-start"
                        )}
                      >
                        {val.jawaban?.map((jawaban, jwbId) => {
                          const checked = true;
                          const skor =
                            idx === 7
                              ? jwbId === 0
                                ? 0
                                : 1
                              : jwbId === 0
                              ? 1
                              : 0;
                          return (
                            <div className="group inline-flex" key={jwbId}>
                              <input
                                type="radio"
                                className="peer"
                                id={`kesehatan-${idx}-${jwbId + 1}`}
                                checked={value === skor}
                                onBlur={onBlur}
                                onChange={() => onChange(skor)}
                              />
                              <label
                                htmlFor={`kesehatan-${idx}-${jwbId + 1}`}
                                className={cn(
                                  "relative cursor-pointer select-none",
                                  "px-2 py-1 text-gray-500",
                                  "peer-checked:border-sky-600 peer-checked:text-sky-700",
                                  "peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:hover:border-gray-300",
                                  "flex h-fit w-full justify-between items-center gap-2 rounded-lg text-slate-700"
                                )}
                              >
                                <span>{jawaban}</span>
                                {/* <span>
                              {idx === 7
                                ? jwbId === 0
                                  ? "(0)"
                                  : "(1)"
                                : jwbId === 0
                                ? "(1)"
                                : "(0)"}
                            </span> */}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="border shadow bg-slate-50">
            <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
              Riwayat Penyakit Pribadi
            </p>
            <div className={cn("flex flex-col gap-2 p-2")}>
              {skriningRiwPenyakit.map((val, idx) => (
                <div
                  key={val.pertanyaan}
                  className={cn("flex flex-col gap-1 py-2 text-sm")}
                >
                  <p className="font-semibold">
                    {idx + 1}
                    {". "}
                    {val.pertanyaan}
                  </p>
                  <Controller
                    control={control}
                    name={`penyakit.${idx}`}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <div
                        className={cn(
                          "grid grid-flow-row auto-rows-fr items-start justify-start"
                        )}
                      >
                        {["Ya", "Tidak"]?.map((jawaban, jwbId) => {
                          const skor = jwbId === 0 ? 1 : 0;
                          return (
                            <div className="group inline-flex" key={jwbId}>
                              <input
                                type="radio"
                                className="peer"
                                id={`penyakit-${idx}-${jwbId + 1}`}
                                checked={value === skor}
                                onBlur={onBlur}
                                onChange={() => onChange(skor)}
                              />
                              <label
                                htmlFor={`penyakit-${idx}-${jwbId + 1}`}
                                className={cn(
                                  "relative cursor-pointer select-none",
                                  "px-2 py-1 text-gray-500",
                                  "peer-checked:border-sky-600 peer-checked:text-sky-700",
                                  "peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:hover:border-gray-300",
                                  "flex h-fit w-full justify-between items-center gap-2 rounded-lg text-slate-700"
                                )}
                              >
                                <span>{jawaban}</span>
                                {/* <span>{jwbId === 0 ? "(1)" : "(0)"}</span> */}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="border shadow bg-slate-50">
            <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
              Riwayat Penyakit Keluarga
            </p>
            <div className={cn("flex flex-col gap-2 p-2")}>
              {skriningRiwKeluarga.map((val, idx) => (
                <div
                  key={val.pertanyaan}
                  className={cn("flex flex-col gap-1 py-2 text-sm")}
                >
                  <p className="font-semibold">
                    {idx + 1}
                    {". "}
                    {val.pertanyaan}
                  </p>
                  <Controller
                    control={control}
                    name={`penyakit_keluarga.${idx}`}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <div
                        className={cn(
                          "grid grid-flow-row auto-rows-fr items-start justify-start"
                        )}
                      >
                        {["Ya", "Tidak"]?.map((jawaban, jwbId) => {
                          const skor = jwbId === 0 ? 1 : 0;
                          return (
                            <div className="group inline-flex" key={jwbId}>
                              <input
                                type="radio"
                                className="peer"
                                id={`penyakit_keluarga-${idx}-${jwbId + 1}`}
                                checked={value === skor}
                                onBlur={onBlur}
                                onChange={() => onChange(skor)}
                              />
                              <label
                                htmlFor={`penyakit_keluarga-${idx}-${
                                  jwbId + 1
                                }`}
                                className={cn(
                                  "relative cursor-pointer select-none",
                                  "px-2 py-1 text-gray-500",
                                  "peer-checked:border-sky-600 peer-checked:text-sky-700",
                                  "peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:hover:border-gray-300",
                                  "flex h-fit w-full justify-between items-center gap-2 rounded-lg text-slate-700"
                                )}
                              >
                                <span>{jawaban}</span>
                                {/* <span>{jwbId === 0 ? "(1)" : "(0)"}</span> */}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="border shadow bg-slate-50">
            <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
              Pola Konsumsi Makan
            </p>
            <div className={cn("flex flex-col gap-2 p-2")}>
              {skriningPolaMakan.map((val, idx) => (
                <div
                  key={val.pertanyaan}
                  className={cn("flex flex-col gap-1 py-2 text-sm")}
                >
                  <p className="font-semibold">
                    {idx + 1}
                    {". "}
                    {val.pertanyaan}
                  </p>
                  <Controller
                    control={control}
                    name={`pola_makan.${idx}`}
                    render={({ field: { onChange, value, onBlur } }) => (
                      <div
                        className={cn(
                          "grid grid-flow-row auto-rows-fr items-start justify-start"
                        )}
                      >
                        {["Ya", "Tidak"]?.map((jawaban, jwbId) => {
                          const skor = jwbId === 0 ? 1 : 0;
                          return (
                            <div className="group inline-flex" key={jwbId}>
                              <input
                                type="radio"
                                className="peer"
                                id={`pola_makan-${idx}-${jwbId + 1}`}
                                checked={value === skor}
                                onBlur={onBlur}
                                onChange={() => onChange(skor)}
                              />
                              <label
                                htmlFor={`pola_makan-${idx}-${jwbId + 1}`}
                                className={cn(
                                  "relative cursor-pointer select-none",
                                  "px-2 py-1 text-gray-500",
                                  "peer-checked:border-sky-600 peer-checked:text-sky-700",
                                  "peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:hover:border-gray-300",
                                  "flex h-fit w-full justify-between items-center gap-2 rounded-lg text-slate-700"
                                )}
                              >
                                <span>{jawaban}</span>
                                {/* <span>{jwbId === 0 ? "(1)" : "(0)"}</span> */}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-1">
            <Button className="px-4 py-1.5" type="submit" loading={loading}>
              Simpan
            </Button>
          </div>
        </div>
      </Transition>
      <Transition show={showSkor} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-[1001]"
          onClose={() => setShowSkor(false)}
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
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div
                    className={cn(
                      "h-fit w-full flex-1 bg-white overflow-hidden rounded shadow"
                    )}
                  >
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="font-semibold bg-slate-100 *:border-r *:border-r-slate-50 *:px-4 *:py-2 *:text-center xl:-top-[1px]">
                          <td rowSpan={2}>Skrining Riwayat Kesehatan</td>
                          <td colSpan={6} className="!border-r-0">
                            Jenis Resiko Penyakit
                          </td>
                        </tr>
                        <tr
                          className={cn(
                            //   "sticky top-[37px]",
                            "z-20 border-y font-semibold border-t-slate-50 bg-slate-100",
                            "*:border-slate-50 *:px-2 *:py-0.5 *:text-center"
                          )}
                        >
                          <td className="border-x">Diabetes Mellitus</td>
                          <td className="border-r">Hipertensi</td>
                          <td className="border-r">Stroke</td>
                          <td className="border-r">Penyakit Jantung</td>
                          <td className="border-r">Gagal Ginjal</td>
                          <td>Osteoarthritis</td>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr
                          className={cn(
                            "bg-white hover:text-sky-600 align-top *:whitespace-pre-wrap *:align-middle *:px-2 *:py-1.5 *:border-b *:border-gray-200 *:text-center"
                          )}
                        >
                          <td>
                            <p className="text-left">Riwayat Kesehatan</p>
                          </td>
                          <td>
                            <p>{KesehatanScoreFunc("DM")}</p>
                          </td>
                          <td>
                            <p>{KesehatanScoreFunc("HT")}</p>
                          </td>
                          <td>
                            <p>{KesehatanScoreFunc("S")}</p>
                          </td>
                          <td>
                            <p>{KesehatanScoreFunc("J")}</p>
                          </td>
                          <td>
                            <p>{KesehatanScoreFunc("G")}</p>
                          </td>
                          <td>
                            <p>{KesehatanScoreFunc("OA")}</p>
                          </td>
                        </tr>
                        <tr
                          className={cn(
                            "bg-white hover:text-sky-600 align-top *:whitespace-pre-wrap *:align-middle *:px-2 *:py-1.5 *:border-b *:border-gray-200 *:text-center"
                          )}
                        >
                          <td>
                            <p className="text-left">
                              Riwayat Penyakit Pribadi
                            </p>
                          </td>
                          <td>
                            <p>{PenyakitScoreFunc("DM")}</p>
                          </td>
                          <td>
                            <p>{PenyakitScoreFunc("HT")}</p>
                          </td>
                          <td>
                            <p>{PenyakitScoreFunc("S")}</p>
                          </td>
                          <td>
                            <p>{PenyakitScoreFunc("J")}</p>
                          </td>
                          <td>
                            <p>{PenyakitScoreFunc("G")}</p>
                          </td>
                          <td>
                            <p>{PenyakitScoreFunc("OA")}</p>
                          </td>
                        </tr>
                        <tr
                          className={cn(
                            "bg-white hover:text-sky-600 align-top *:whitespace-pre-wrap *:align-middle *:px-2 *:py-1.5 *:border-b *:border-gray-200 *:text-center"
                          )}
                        >
                          <td>
                            <p className="text-left">
                              Riwayat Penyakit Keluarga
                            </p>
                          </td>
                          <td>
                            <p>{KeluargaScoreFunc("DM")}</p>
                          </td>
                          <td>
                            <p>{KeluargaScoreFunc("HT")}</p>
                          </td>
                          <td>
                            <p>{KeluargaScoreFunc("S")}</p>
                          </td>
                          <td>
                            <p>{KeluargaScoreFunc("J")}</p>
                          </td>
                          <td>
                            <p>{KeluargaScoreFunc("G")}</p>
                          </td>
                          <td>
                            <p>{KeluargaScoreFunc("OA")}</p>
                          </td>
                        </tr>
                        <tr
                          className={cn(
                            "bg-white hover:text-sky-600 align-top *:whitespace-pre-wrap *:align-middle *:px-2 *:py-1.5 *:border-b *:border-gray-200 *:text-center"
                          )}
                        >
                          <td>
                            <p className="text-left">Pola Konsumsi Makan</p>
                          </td>
                          <td>
                            <p>{PolaScoreFunc("DM")}</p>
                          </td>
                          <td>
                            <p>{PolaScoreFunc("HT")}</p>
                          </td>
                          <td>
                            <p>{PolaScoreFunc("S")}</p>
                          </td>
                          <td>
                            <p>{PolaScoreFunc("J")}</p>
                          </td>
                          <td>
                            <p>{PolaScoreFunc("G")}</p>
                          </td>
                          <td>
                            <p>{PolaScoreFunc("OA")}</p>
                          </td>
                        </tr>
                        <tr
                          className={cn(
                            "bg-white hover:text-sky-600 align-top"
                          )}
                        >
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "font-semibold"
                            )}
                          >
                            <p>Jumlah</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{dm - PlusIMT}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{ht - PlusIMT}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{s - PlusIMT}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{j - PlusIMT}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{g - PlusIMT}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{oa - PlusIMT}</p>
                          </td>
                        </tr>
                        <tr
                          className={cn(
                            "bg-white hover:text-sky-600 align-top"
                          )}
                        >
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "font-semibold"
                            )}
                          >
                            <p>Total tambahan skor</p>
                          </td>

                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{dm}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{ht}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{s}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{j}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{g}</p>
                          </td>
                          <td
                            className={cn(
                              "whitespace-pre-wrap align-middle px-2 py-1.5 border-b border-gray-200",
                              "text-center"
                            )}
                          >
                            <p>{oa}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </form>
  );
}

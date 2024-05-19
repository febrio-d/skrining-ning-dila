import { Input } from "@/components/form";
import { SelectInput } from "@/components/select";
import { Schema, SchemaT } from "@/lib/schema";
import {
  KatPenyakit,
  skriningPolaMakan,
  skriningRiwKeluarga,
  skriningRiwKesehatan,
  skriningRiwPenyakit,
} from "@/lib/skrining";
import { cn, getAgeAll } from "@/lib/utils";
import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { fisik, pasien, skor } from "@prisma/client";
import Cookies from "js-cookie";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "./button";

type Pasien = pasien & { fisik: fisik | null; skor: skor | null };
export type ViewState = {
  modal: boolean;
  desa?: string;
  data?: Pasien;
};
export type ViewAction = ViewState;

export default function ViewPasien({
  view,
  viewDispatch,
  loadData,
}: {
  view: ViewState;
  viewDispatch: React.Dispatch<ViewAction>;
  loadData: () => Promise<void>;
}) {
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

  const namaDesa = Cookies.get("user");
  const idDesa = Cookies.get("id_desa");

  //   const initialized = useRef<boolean>(false);
  useEffect(() => {
    if (view.data) {
      const val = view.data;
      setValue("pasien", {
        nik: val.nik,
        nama: val.nama,
        nama_kk: val.nama_kk,
        jk: val.jk,
        lahir: val.lahir,
        gd: val.fisik?.gd!,
        hp: val.hp,
        td: val.fisik?.td!,
        bb: val.fisik?.bb!,
        tb: val.fisik?.tb!,
      });
      setValue("penyakit", val.skor?.penyakit!);
      setValue("kesehatan", val.skor?.kesehatan!);
      setValue("penyakit_keluarga", val.skor?.keluarga!);
      setValue("pola_makan", val.skor?.pola!);
      //   initialized.current = true;
    }
  }, [view]);

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

  const tutup = () => {
    viewDispatch({ modal: false, data: view.data });
    setLoading(false);
    setShowSkor(false);
  };

  return (
    <Transition show={view.modal} as={React.Fragment}>
      <Dialog as="div" className="relative z-[1001]" onClose={tutup}>
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
          <div className="flex h-screen items-center justify-end overflow-hidden text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-50"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 translate-x-5 scale-95"
            >
              <Dialog.Panel className="h-full w-full max-w-3xl transform overflow-y-auto rounded bg-white p-6 pb-4 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="div"
                  className="flex sticky -top-6 z-50 bg-white justify-between border-b border-slate-200 font-medium leading-6 text-gray-900"
                >
                  <p>Pasien {view.data?.nama}</p>
                  <p>Desa {view?.desa}</p>
                </Dialog.Title>
                <form
                  onSubmit={handleSubmit(async (data, e) => {
                    e?.preventDefault();
                    setLoading(true);
                    try {
                      if (!!idDesa && parseInt(idDesa) !== view.data?.desa)
                        throw new Error(
                          "Tidak bisa merubah data dari desa yang lain!"
                        );
                      const resp = await fetch(
                        `/api/skrining/${view.data?.id}`,
                        {
                          method: "PUT",
                          body: JSON.stringify({
                            ...data,
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
                        }
                      );
                      const json = await resp.json();
                      if (json.error) throw new Error(json.message);
                      toast.success(json.message);
                      loadData();
                      //   setSubmitted(true);
                    } catch (err) {
                      const error = err as Error;
                      toast.error(error.message);
                      console.error(error);
                    } finally {
                      setLoading(false);
                    }
                  })}
                >
                  <div
                    className={cn(
                      "grid sm:grid-cols-4 gap-2 rounded-md border p-2 shadow relative pt-10 bg-slate-100 mt-2",
                      "grid-cols-3"
                    )}
                  >
                    <p className="absolute left-1/2 -translate-x-1/2 text-base text-center top-1 font-semibold underline">
                      Form Pasien
                    </p>
                    <div
                      className={cn(
                        "grid",
                        errors.pasien?.nik && "rounded-lg bg-red-100"
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <label
                          htmlFor="nik"
                          className="text-sm font-medium text-gray-900"
                        >
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
                      className={cn(
                        "grid",
                        errors.pasien?.nama && "rounded-lg bg-red-100"
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <label
                          htmlFor="nama"
                          className="text-sm font-medium text-gray-900"
                        >
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
                      className={cn(
                        "grid",
                        errors.pasien?.jk && "rounded-lg bg-red-100"
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <label
                          htmlFor="jk"
                          className="text-sm font-medium text-gray-900"
                        >
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
                          const options = ["Laki-laki", "Perempuan"].map(
                            (val) => ({
                              label: val,
                              value: val,
                            })
                          );

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
                    <div
                      className={cn(
                        errors.pasien?.lahir && "rounded-lg bg-red-100"
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <label
                          htmlFor="tgl"
                          className="text-sm font-medium text-gray-900"
                        >
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
                        <label
                          htmlFor="tgl"
                          className="text-sm font-medium text-gray-900"
                        >
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
                      className={cn(
                        "grid",
                        errors.pasien?.hp && "rounded-lg bg-red-100"
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <label
                          htmlFor="hp"
                          className="text-sm font-medium text-gray-900"
                        >
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
                        <label
                          htmlFor="td"
                          className="text-sm font-medium text-gray-900"
                        >
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
                            onInput={(
                              e: React.FocusEvent<HTMLInputElement, Element>
                            ) => {
                              +e.target.value < 0 && setValue("pasien.td.0", 0);
                              +e.target.value > 250 &&
                                setValue("pasien.td.0", 250);
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
                            onInput={(
                              e: React.FocusEvent<HTMLInputElement, Element>
                            ) => {
                              +e.target.value < 0 && setValue("pasien.td.1", 0);
                              +e.target.value > 180 &&
                                setValue("pasien.td.1", 180);
                            }}
                          />
                          <div className="absolute inset-y-0 items-center flex right-1.5 top-0 bottom-0 align-middle">
                            <p className="text-[8px]/[10px]">mmHg</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "grid",
                        errors.pasien?.gd && "rounded-lg bg-red-100"
                      )}
                    >
                      <div className="flex items-baseline justify-between">
                        <label
                          htmlFor="gd"
                          className="text-sm font-medium text-gray-900"
                        >
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
                        className={cn(
                          "grid",
                          errors.pasien?.tb && "rounded-lg bg-red-100"
                        )}
                      >
                        <div className="flex items-baseline justify-between">
                          <label
                            htmlFor="tb"
                            className="text-sm font-medium text-gray-900"
                          >
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
                        className={cn(
                          "grid",
                          errors.pasien?.bb && "rounded-lg bg-red-100"
                        )}
                      >
                        <div className="flex items-baseline justify-between">
                          <label
                            htmlFor="bb"
                            className="text-sm font-medium text-gray-900"
                          >
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
                        <label
                          htmlFor="imt"
                          className="text-sm font-medium text-gray-900"
                        >
                          IMT
                        </label>
                      </div>
                      <p className="my-auto text-xs">{IMT}</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 mt-2 gap-2 px-1 pb-2 rounded-md border relative bg-slate-100">
                    <div className="relative col-span-2 flex w-full top-1 justify-center">
                      <p className="absolute left-1/2 -translate-x-1/2 text-base text-center font-semibold underline">
                        Form Skrining
                      </p>
                      <div className="ml-auto">
                        <Button onClick={() => setShowSkor(true)}>Skor</Button>
                      </div>
                    </div>
                    <div className="border shadow bg-slate-50">
                      <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-xs uppercase tracking-normal text-slate-50">
                        Riwayat Kesehatan
                      </p>
                      <div className={cn("grid gap-2 p-2")}>
                        {skriningRiwKesehatan.map((val, idx) => (
                          <div
                            key={val.pertanyaan}
                            className={cn("flex flex-col gap-1 py-2 text-xs")}
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
                              render={({
                                field: { onChange, value, onBlur },
                              }) => (
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
                                      <div
                                        className="group inline-flex"
                                        key={jwbId}
                                      >
                                        <input
                                          type="radio"
                                          className="peer"
                                          id={`kesehatan-${idx}-${jwbId + 1}`}
                                          checked={value === skor}
                                          onBlur={onBlur}
                                          onChange={() => onChange(skor)}
                                        />
                                        <label
                                          htmlFor={`kesehatan-${idx}-${
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
                      <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-xs uppercase tracking-normal text-slate-50">
                        Riwayat Penyakit Pribadi
                      </p>
                      <div className={cn("flex flex-col gap-2 p-2")}>
                        {skriningRiwPenyakit.map((val, idx) => (
                          <div
                            key={val.pertanyaan}
                            className={cn("flex flex-col gap-1 py-2 text-xs")}
                          >
                            <p className="font-semibold">
                              {idx + 1}
                              {". "}
                              {val.pertanyaan}
                            </p>
                            <Controller
                              control={control}
                              name={`penyakit.${idx}`}
                              render={({
                                field: { onChange, value, onBlur },
                              }) => (
                                <div
                                  className={cn(
                                    "grid grid-flow-row auto-rows-fr items-start justify-start"
                                  )}
                                >
                                  {["Ya", "Tidak"]?.map((jawaban, jwbId) => {
                                    const skor = jwbId === 0 ? 1 : 0;
                                    return (
                                      <div
                                        className="group inline-flex"
                                        key={jwbId}
                                      >
                                        <input
                                          type="radio"
                                          className="peer"
                                          id={`penyakit-${idx}-${jwbId + 1}`}
                                          checked={value === skor}
                                          onBlur={onBlur}
                                          onChange={() => onChange(skor)}
                                        />
                                        <label
                                          htmlFor={`penyakit-${idx}-${
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
                      <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-xs uppercase tracking-normal text-slate-50">
                        Riwayat Penyakit Keluarga
                      </p>
                      <div className={cn("flex flex-col gap-2 p-2")}>
                        {skriningRiwKeluarga.map((val, idx) => (
                          <div
                            key={val.pertanyaan}
                            className={cn("flex flex-col gap-1 py-2 text-xs")}
                          >
                            <p className="font-semibold">
                              {idx + 1}
                              {". "}
                              {val.pertanyaan}
                            </p>
                            <Controller
                              control={control}
                              name={`penyakit_keluarga.${idx}`}
                              render={({
                                field: { onChange, value, onBlur },
                              }) => (
                                <div
                                  className={cn(
                                    "grid grid-flow-row auto-rows-fr items-start justify-start"
                                  )}
                                >
                                  {["Ya", "Tidak"]?.map((jawaban, jwbId) => {
                                    const skor = jwbId === 0 ? 1 : 0;
                                    return (
                                      <div
                                        className="group inline-flex"
                                        key={jwbId}
                                      >
                                        <input
                                          type="radio"
                                          className="peer"
                                          id={`penyakit_keluarga-${idx}-${
                                            jwbId + 1
                                          }`}
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
                      <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-xs uppercase tracking-normal text-slate-50">
                        Pola Konsumsi Makan
                      </p>
                      <div className={cn("flex flex-col gap-2 p-2")}>
                        {skriningPolaMakan.map((val, idx) => (
                          <div
                            key={val.pertanyaan}
                            className={cn("flex flex-col gap-1 py-2 text-xs")}
                          >
                            <p className="font-semibold">
                              {idx + 1}
                              {". "}
                              {val.pertanyaan}
                            </p>
                            <Controller
                              control={control}
                              name={`pola_makan.${idx}`}
                              render={({
                                field: { onChange, value, onBlur },
                              }) => (
                                <div
                                  className={cn(
                                    "grid grid-flow-row auto-rows-fr items-start justify-start"
                                  )}
                                >
                                  {["Ya", "Tidak"]?.map((jawaban, jwbId) => {
                                    const skor = jwbId === 0 ? 1 : 0;
                                    return (
                                      <div
                                        className="group inline-flex"
                                        key={jwbId}
                                      >
                                        <input
                                          type="radio"
                                          className="peer"
                                          id={`pola_makan-${idx}-${jwbId + 1}`}
                                          checked={value === skor}
                                          onBlur={onBlur}
                                          onChange={() => onChange(skor)}
                                        />
                                        <label
                                          htmlFor={`pola_makan-${idx}-${
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
                  </div>
                  <div className="mt-4 flex justify-center bg-slate-100 rounded py-1 gap-1">
                    <Button type="submit" loading={loading} color="cyan100">
                      Ubah Data
                    </Button>
                    <Button color="red" onClick={tutup}>
                      Keluar
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

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
      </Dialog>
    </Transition>
  );
}

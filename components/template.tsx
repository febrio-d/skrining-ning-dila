"use client";

import { Input } from "@/components/form";
import { SelectInput } from "@/components/select";
import { cn, getAgeAll } from "@/lib/utils";
import { Tab } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export default function Template() {
  const Schema = z.object({
    pasien: z.object({
      nik: z.string().min(1, "harus diisi"),
      nama: z.string().min(1, "harus diisi"),
      nama_kk: z.string().min(1, "harus diisi"),
      alamat: z.string().min(1, "harus diisi"),
      jenis_kelamin: z.string({ required_error: "harus dipilih" }),
      tanggal_lahir: z.string().min(1, "harus diisi"),
      agama: z.string({ required_error: "harus dipilih" }),
      hp: z.string().min(1, "harus diisi"),
      td: z
        .number({
          required_error: "harus diisi",
          invalid_type_error: "harus diisi",
        })
        .array()
        .length(2),
      gd: z.number({
        required_error: "harus diisi",
        invalid_type_error: "harus diisi",
      }),
      tb: z.number({
        required_error: "harus diisi",
        invalid_type_error: "harus diisi",
      }),
      bb: z.number({
        required_error: "harus diisi",
        invalid_type_error: "harus diisi",
      }),
    }),
    kesehatan: z.number().array(),
    penyakit: z.number().array(),
    penyakit_keluarga: z.number().array(),
    pola_makan: z.number().array(),
  });

  type SchemaT = z.infer<typeof Schema>;

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

  useEffect(() => {
    const subscription = watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  const desa = [
    "Bogotanjung",
    "Tlogoayu",
    "Wuwur",
    "Pantirejo",
    "Sugihrejo",
    "Mojolawaran",
    "Karaban",
    "Sambirejo",
    "Kosekan",
    "Kuryokalangan",
    "Gebang",
  ];
  const [desaIdx, setDesaIdx] = useState<number>(0);

  type KatPenyakit = "DM" | "HT" | "S" | "J" | "G" | "OA";
  const [skriningRiwKesehatan] = useState<
    { pertanyaan: string; jawaban: string[]; kategori?: KatPenyakit[] }[]
  >([
    {
      pertanyaan:
        "Apakah anda merasa haus pada saat melakukan aktifitas normal?",
      jawaban: [
        "Ya, sering dan selalu haus",
        "Tidak, saya merasa haus secara normal saja",
      ],
      kategori: ["DM"],
    },
    {
      pertanyaan:
        "Apakah anda sering terbangun disaat tidur malam akibat buang air kecil berkali-kali?",
      jawaban: ["Ya, lebih dari 3 kali", "Tidak"],
      kategori: ["DM"],
    },
    {
      pertanyaan:
        "Apakah anda selalu merasa lapar walaupun sudah makan besar (nasi, lauk pauk dsb) beberapa saat sebelumnya?",
      jawaban: [
        "Ya, saya selalu merasa lapar meskipun sudah makan banyak dan berkali-kali (makan lebih dari 5 kali)",
        "Tidak, saya makan 2-3 kali sehari dengan porsi normal",
      ],
      kategori: ["DM"],
    },
    {
      pertanyaan:
        "Apakah anda mempunyai kebiasaan makan-makanan yang berasa asin?",
      jawaban: [
        "Ya, hampir setiap hari saya mengkonsumsi makanan yang berasa asin",
        "Tidak",
      ],
      kategori: ["HT"],
    },
    {
      pertanyaan: "Apakah anda mengkonsumsi kopi?",
      jawaban: [
        "Ya, saya hampir selalu mengkonsumsi kopi setiap hari lebih dari 3 gelas sehari",
        "Tidak, saya tidak pernah mengkonsumsi",
      ],
      kategori: ["HT"],
    },
    {
      pertanyaan: "Apakah anda suka merokok?",
      jawaban: [
        "Ya, saya merokok hamper setiap hari lebih dari 1 bungkus",
        "Tidak",
      ],
      kategori: ["HT", "S", "J"],
    },
    {
      pertanyaan:
        "Apakah pekerjaan anda menuntut anda untuk bekerja keras, sehingga anda merasakan sering mudah lelah, susah tidur dan cepat terbangun di pagi hari?",
      jawaban: [
        "Ya, saya merasa suasana di tempat kerja saya sangat tinggi, sehingga saya merasa tidak nyaman di tempat kerja. Ketika di rumah saya merasa susah tidur dan saya tidak bisa tidur nyeyak, saya sering terbangun dini hari                ",
        "Tidak, tempat kerja kami terasa nyaman, meski penuh persaingan namun tidak menegangkan. Kami cukup tidur dan nyenyak",
      ],
      kategori: ["S", "J"],
    },
    {
      pertanyaan: "Apakah punya kebiasaan olahraga rutin dan teratur?",
      jawaban: [
        "Ya, saya rutin olahraga sedikitnya 2 kali seminggu",
        "Tidak, saya jarang berolahraga",
      ],
      kategori: ["S", "J"],
    },
    {
      pertanyaan:
        "Apakah anda pernah memperoleh hasil pemeriksaan kolesterol tinggi?",
      jawaban: [
        "Ya, hasil kolesterol saya dinyatakan tinggi",
        "Tidak, hasil kolesterol saya normal",
      ],
    },
    {
      pertanyaan: "Apakah anda punya kebiasaan kurang minum air putih?",
      jawaban: [
        "Ya, saya minum hanya bila haus",
        "Tidak, saya minum minimal 2 liter per hari",
      ],
      kategori: ["G"],
    },
    {
      pertanyaan:
        "Apakah anda punya kebiasaan minum-minuman kemasan atau soda?",
      jawaban: ["Ya", "Tidak"],
      kategori: ["G"],
    },
    {
      pertanyaan:
        "Apakah anda sering mengkonsumsi jamu-jamuan atau membeli obat terutama anti nyeri di apotek tanpa resep dokter?",
      jawaban: ["Ya", "Tidak"],
      kategori: ["G"],
    },
    {
      pertanyaan:
        "Apakah anda merasakan nyeri sendi saat posisi lutut ditekuk?",
      jawaban: ["Ya", "Tidak"],
      kategori: ["OA"],
    },
    {
      pertanyaan:
        "Apakah kaki anda terasa kaku-kaku pada saat bangun tidur di pagi hari?",
      jawaban: ["Ya", "Tidak"],
      kategori: ["OA"],
    },
    {
      pertanyaan: "Apakah saat bekerja anda sering mengangkat beban berat?",
      jawaban: ["Ya", "Tidak"],
      kategori: ["OA"],
    },
  ]);

  const [skriningRiwPenyakit] = useState<
    { pertanyaan: string; kategori?: KatPenyakit[] }[]
  >([
    { pertanyaan: "Diabetes Mellitus (kencing manis)", kategori: ["DM"] },
    { pertanyaan: "Stroke", kategori: ["S"] },
    { pertanyaan: "Penyakit pada retina/mata", kategori: ["DM"] },
    { pertanyaan: "Hipertensi/tekanan darah tinggi", kategori: ["HT"] },
    { pertanyaan: "Penyakit jantung koroner", kategori: ["J"] },
    { pertanyaan: "Kolesterol tinggi", kategori: ["S", "J"] },
    { pertanyaan: "Penyakit ginjal", kategori: ["G"] },
    { pertanyaan: "Asam urat tinggi", kategori: ["G"] },
    { pertanyaan: "Pengapuran pada sendi lutut", kategori: ["OA"] },
  ]);

  const [skriningRiwKeluarga] = useState<
    { pertanyaan: string; kategori?: KatPenyakit[] }[]
  >([
    { pertanyaan: "Hipertensi/tekanan darah tinggi", kategori: ["HT"] },
    { pertanyaan: "Diabetes Mellitus/kencing manis", kategori: ["DM"] },
    { pertanyaan: "Penyakit jantung koroner", kategori: ["J"] },
    { pertanyaan: "Penyakit ginjal", kategori: ["G"] },
    { pertanyaan: "Stroke", kategori: ["S"] },
    { pertanyaan: "Pengapuran sendi", kategori: ["OA"] },
  ]);

  const [skriningPolaMakan] = useState<
    { pertanyaan: string; kategori?: KatPenyakit[] }[]
  >([
    { pertanyaan: "Masakan bersantan", kategori: ["HT", "J", "S"] },
    {
      pertanyaan: "Masakan berminyak dan berlemak",
      kategori: ["HT", "J", "S"],
    },
    {
      pertanyaan:
        "Makanan cepat saji (Kentucky/ayam goreng tepung, French fries/kentang goreng dll)",
      kategori: ["HT", "J", "S"],
    },
    { pertanyaan: "Jerohan, otak, dll", kategori: ["HT", "J", "S"] },
    {
      pertanyaan: "Sup buntut, sup daging, sup jerohan, dll",
      kategori: ["HT", "J", "S"],
    },
    {
      pertanyaan:
        "Minuman bersoda (larutan, adem sari, coca-cola, fanta, sprite dll)",
      kategori: ["G"],
    },
    { pertanyaan: "Teh manis > 3 gelas/hari", kategori: ["DM"] },
    { pertanyaan: "Kopi > 3 gelas/hari", kategori: ["HT"] },
  ]);

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex w-full transform flex-col gap-3 overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
      <Tab.Group
        selectedIndex={desaIdx}
        onChange={(index) => {
          setDesaIdx(index);
        }}
      >
        <Tab.List className="flex space-x-0.5 rounded-md bg-gray-900/20 p-0.5">
          {desa.map((d) => (
            <Tab
              className={cn(
                "w-full rounded py-1.5 text-sm leading-5 text-gray-700 focus:outline-none ui-selected:bg-white ui-selected:shadow ui-not-selected:hover:bg-white/[0.12]  ui-selected"
              )}
              key={d}
            >
              {d}
            </Tab>
          ))}
        </Tab.List>
      </Tab.Group>
      <div
        className={cn(
          "grid sm:grid-cols-7 gap-2 rounded-md border p-2 shadow",
          "grid-cols-3"
        )}
      >
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
            {...register("pasien.nik")}
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
          className={cn(
            "grid",
            errors.pasien?.jenis_kelamin && "rounded-lg bg-red-100"
          )}
        >
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="jenis_kelamin"
              className="text-sm font-medium text-gray-900"
            >
              Jenis Kelamin
            </label>
            {errors.pasien?.jenis_kelamin ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.jenis_kelamin.message}
              </p>
            ) : null}
          </div>
          <Controller
            control={control}
            name="pasien.jenis_kelamin"
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
        <div
          className={cn(
            errors.pasien?.tanggal_lahir && "rounded-lg bg-red-100"
          )}
        >
          <div className="flex items-baseline justify-between">
            <label htmlFor="tgl" className="text-sm font-medium text-gray-900">
              Tanggal Lahir
            </label>
            {errors.pasien?.tanggal_lahir ? (
              <p className="pr-0.5 text-xs text-red-500">
                {errors.pasien.tanggal_lahir.message}
              </p>
            ) : null}
          </div>
          <Input
            className="px-2 py-1 text-xs"
            id="tgl"
            type="date"
            {...register("pasien.tanggal_lahir")}
          />
        </div>
        <div className={cn("flex flex-col")}>
          <div className="flex items-baseline justify-between">
            <label htmlFor="tgl" className="text-sm font-medium text-gray-900">
              Umur
            </label>
          </div>
          <p className="my-auto text-xs">
            {watch("pasien.tanggal_lahir")
              ? getAgeAll(new Date(watch("pasien.tanggal_lahir")))
              : ""}
          </p>
        </div>
        <div
          className={cn(
            "grid"
            // errors.pasien.hp && "rounded-lg bg-red-100"
          )}
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
            {...register("pasien.gd")}
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
                {...register("pasien.tb")}
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
                {...register("pasien.bb")}
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
          <p className="my-auto text-xs">
            {watch("pasien.tb")?.toString().length > 2 &&
            watch("pasien.bb")?.toString().length > 1
              ? (
                  watch("pasien.bb") /
                  (((watch("pasien.tb") / 100) * watch("pasien.tb")) / 100)
                ).toFixed(1)
              : ""}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="border shadow">
          <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
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
                                "bg-white px-2 py-1 text-gray-500",
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
        <div className="border shadow">
          <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
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
                                "bg-white px-2 py-1 text-gray-500",
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
        <div className="border shadow">
          <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
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
                              htmlFor={`penyakit_keluarga-${idx}-${jwbId + 1}`}
                              className={cn(
                                "relative cursor-pointer select-none",
                                "bg-white px-2 py-1 text-gray-500",
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
        <div className="border shadow">
          <p className="select-none rounded-t bg-sky-700 py-1.5 text-center text-sm uppercase tracking-normal text-slate-50">
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
                                "bg-white px-2 py-1 text-gray-500",
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
      <div
        className={cn(
          "h-fit w-full flex-1 overflow-hidden overflow-y-auto rounded shadow"
        )}
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="sticky top-0 font-semibold z-20 bg-slate-100 *:border-r *:border-r-slate-50 *:px-4 *:py-2 *:text-center xl:-top-[1px]">
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
              <td>Osteoartritis</td>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 overflow-y-auto">
            <tr className={cn("bg-white hover:text-sky-600 align-top")}>
              <td
                className={cn(
                  "whitespace-pre-wrap align-middle px-2 py-1.5",
                  "border-b border-gray-200"
                )}
              >
                <p>Riwayat Kesehatan</p>
              </td>
            </tr>
            <tr className={cn("bg-white hover:text-sky-600 align-top")}>
              <td
                className={cn(
                  "whitespace-pre-wrap align-middle px-2 py-1.5",
                  "border-b border-gray-200"
                )}
              >
                <p>Riwayat Penyakit Pribadi</p>
              </td>
            </tr>
            <tr className={cn("bg-white hover:text-sky-600 align-top")}>
              <td
                className={cn(
                  "whitespace-pre-wrap align-middle px-2 py-1.5",
                  "border-b border-gray-200"
                )}
              >
                <p>Riwayat Penyakit Keluarga</p>
              </td>
            </tr>
            <tr className={cn("bg-white hover:text-sky-600 align-top")}>
              <td
                className={cn(
                  "whitespace-pre-wrap align-middle px-2 py-1.5",
                  "border-b border-gray-200"
                )}
              >
                <p>Pola Konsumsi Makan</p>
              </td>
            </tr>
            <tr className={cn("bg-white hover:text-sky-600 align-top")}>
              <td
                className={cn(
                  "whitespace-pre-wrap align-middle px-2 py-1.5",
                  "border-b border-gray-200",
                  "font-semibold"
                )}
              >
                <p>Jumlah</p>
              </td>
            </tr>
            <tr className={cn("bg-white hover:text-sky-600 align-top")}>
              <td
                className={cn(
                  "whitespace-pre-wrap align-middle px-2 py-1.5",
                  "border-b border-gray-200",
                  "font-semibold"
                )}
              >
                <p>Total tambahan skor</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { z } from "zod";

export const Schema = z.object({
  pasien: z.object({
    nik: z.string().min(1, "harus diisi"),
    nama: z.string().min(1, "harus diisi"),
    nama_kk: z.string().min(1, "harus diisi"),
    jk: z.string({ required_error: "harus dipilih" }),
    lahir: z.string().min(1, "harus diisi"),
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

export type SchemaT = z.infer<typeof Schema>;

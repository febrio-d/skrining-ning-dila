"use client";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./form";
import Image from "next/image";
import Pati from "@/assets/img/pati.png";
import { z } from "zod";
import React from "react";
import toast from "react-hot-toast";
import type { users } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const { push } = useRouter();

  const [data, setData] = React.useState<{
    username: string;
    password: string;
  }>();
  const [error, setError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setData((prev: typeof data) => ({
      ...(prev || { username: "", password: "" }),
      [name]: value,
    }));
  };

  const UserSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

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
        <form
          className="flex flex-col gap-1"
          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            const result = UserSchema.safeParse(data);
            if (result.success) {
              try {
                const res = await fetch("api/auth", {
                  method: "POST",
                  body: JSON.stringify(data),
                });
                const json = (await res.json()) as unknown as {
                  error: boolean;
                  message: string;
                  user: users;
                };
                setLoading(false);
                if (!json?.error) {
                  toast.success(json?.message);
                  push("/");
                } else {
                  throw new Error(json?.message);
                }
              } catch (err) {
                const error = err as Error;
                toast.error(error?.message);
                setError(true);
                setLoading(false);
              }
            } else {
              toast.error("Lengkapi form login terlebih dahulu");
              setLoading(false);
            }
          }}
        >
          <Input
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Button
            className="w-full justify-center mt-4"
            type="submit"
            loading={loading}
          >
            Login
          </Button>
        </form>
      </div>
    </>
  );
}

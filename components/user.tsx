"use client";

import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { LuUser } from "react-icons/lu";

export default function User({ user }: { user: string | undefined }) {
  const { push } = useRouter();
  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("id_desa");
    push("/auth");
  };

  return (
    <div className="flex justify-end items-center">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button>
          <LuUser className="size-6" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={cn(
              "absolute right-0 z-[1010] mt-1 max-h-32 w-48 origin-top-left overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              //   "fixed z-[1020] mt-2 max-h-32 w-56 origin-top-left overflow-y-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-700"
              // "-top-2 mb-2 mt-0 -translate-y-full",
            )}
          >
            <div className="*:px-2 divide-y-[1px] divide-slate-400/80">
              <Menu.Item disabled>
                <p className="text-sm py-2">{user}</p>
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center px-2 py-2 text-xs",
                      active ? "bg-slate-100 text-slate-600" : "text-gray-900"
                    )}
                    onClick={logout}
                  >
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}

"use client";

import { penyakit } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Menu, Transition } from "@headlessui/react";
import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function EdukasiPenyakit({ className }: { className?: string }) {
  return (
    <Menu as={React.Fragment}>
      <div className="relative">
        <Menu.Button
          className={cn(
            "inline-flex text-center text-sm focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
            "rounded-md bg-gray-900/20 font-semibold text-gray-700 active:bg-slate-300",
            "p-2",
            className
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
                        active ? "bg-gray-100 text-sky-600" : "text-gray-900"
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
  );
}

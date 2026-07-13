"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User, CreditCard, Settings, LogOut, ChevronDown } from "lucide-react";

export default function ProfileDropdown({ className, ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  // Initials for avatar
  const initials = user.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "US";

  const menuItems = [
    {
      label: "Profile",
      href: isAdmin ? "/admin/dashboard" : "/dashboard",
      icon: <User className="h-4 w-4" />,
    },
    {
      label: "Subscription",
      value: isAdmin ? "ADMIN" : "CLIENT",
      href: isAdmin ? "/admin/dashboard" : "/dashboard",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: "Settings",
      href: isAdmin ? "/admin/dashboard" : "/dashboard/settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <div className={`relative ${className || ""}`} ref={dropdownRef} {...props}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] py-1.5 pl-3 pr-3.5 transition-all duration-200 hover:bg-white/[0.05] hover:border-white/[0.12] focus:outline-none backdrop-blur-md"
        type="button"
      >
        <div className="flex items-center gap-2 text-left">
          {/* Avatar circle with custom gradient border */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500/80 to-cyan-400/80 p-[1.5px] shadow-lg shadow-black/20">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#090E17] font-semibold text-[11px] text-cyan-400">
              {initials}
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold text-[13px] text-white leading-tight tracking-wide">
              {user.name}
            </div>
            <div className="text-[10px] text-zinc-400 leading-tight">
              {user.email || 'user@aritaro.com'}
            </div>
          </div>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-white" : ""
            }`}
        />
      </button>

      {/* Glassmorphic Dropdown Menu */}
      <div
        style={{ margin: "10px 0 0 0 " }}
        className={`absolute left-1/2 -translate-x-1/2 mt-2.5 w-52 origin-top rounded-xl border border-white/[0.08] bg-[#090E17]/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl transition-all duration-150 ease-out z-50 ${isOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          }`}
      >
        <div className="space-y-1 ">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              style={{ padding: "7px 10px " }}
              className="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-zinc-300 transition-all duration-150 hover:bg-white/[0.04] hover:text-white"
            >
              <div className="flex items-center gap-2.5 m-2 ">
                <span className="text-zinc-400 group-hover:text-white">{item.icon}</span>
                <span className="font-medium text-[13px]">{item.label}</span>
              </div>
              {/* {item.value && (
                <span className="rounded-md border border-cyan-500/10 bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-cyan-400">
                  {item.value}
                </span>
              )} */}
            </Link>
          ))}
        </div>

        <div className="h-px bg-white/[0.06] my-2" />

        <button
          onClick={() => {
            setIsOpen(false);
            signOut({ callbackUrl: "/" });
          }}
          style={{ padding: "7px 10px " }}
          className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-left text-red-400 transition-all duration-150 hover:bg-red-500/10 hover:text-red-300"
          type="button"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium text-[13px]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

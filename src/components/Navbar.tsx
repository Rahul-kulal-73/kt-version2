"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-16 bg-[#BBDDD5]/80 flex items-center justify-between px-8">
      <div>
        <h1 className="text-green-600 text-xl font-extrabold"><span className="text-orange-900">Kutumba</span> Tree</h1>
      </div>

      <div className="font-semibold flex gap-5">
        <Link href={"#"}>Features</Link>
        <Link href={"#"}>Pricing</Link>
        <Link href={"#"}>About</Link>
      </div>

      <div className="flex gap-4 font-semibold">
        <button className="border-2 border-black px-2 py-0.5 rounded-md">
          Login
        </button>

         <button className="border-2 border-black px-2 py-0.5 rounded-md">
          Sign Up
        </button>
      </div>
    </nav>
  )
}
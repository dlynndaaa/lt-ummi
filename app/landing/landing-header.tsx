'use client'

import Image from "next/image"
import Link from "next/link"

export default function LandingHeader() {
  return (
    <header className="bg-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo-ummi.png"
            alt="Logo LT-UMMI"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-gray-900">LT-UMMI</span>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/tentang-lab" className="text-gray-600 hover:text-gray-900">
            Tentang
          </Link>
          <Link href="/laboratorium" className="text-gray-600 hover:text-gray-900">
            Laboratorium
          </Link>
          <Link href="/informasi" className="text-gray-600 hover:text-gray-900">
            Informasi
          </Link>
          <Link href="/kontak" className="text-gray-600 hover:text-gray-900">
            Kontak
          </Link>
        </nav>

        <Link
          href="/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Login
        </Link>
      </div>
    </header>
  )
}

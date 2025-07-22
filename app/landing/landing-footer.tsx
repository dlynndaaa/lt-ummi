import Link from "next/link"
import Image from "next/image"

export default function LandingFooter() {
  return (
    <footer id="kontak" className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Deskripsi */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative">
                <Image
                  src="/logo-ummi.png"
                  alt="Logo UMMI"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">LT-UMMI</span>
            </div>
            <p className="text-gray-400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="font-bold mb-4">Navigasi</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#tentang" className="hover:text-white transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="#laboratorium" className="hover:text-white transition-colors">
                  Laboratorium
                </Link>
              </li>
              <li>
                <Link href="#informasi" className="hover:text-white transition-colors">
                  Informasi
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-white transition-colors">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Inventarisasi Digital</li>
              <li>Peminjaman Online</li>
              <li>Informasi Laboratorium</li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold mb-4">Kontak</h4>
            <div className="space-y-2 text-gray-400">
              <p>Telp. 081234567890</p>
              <p>Email: ummi.ac.id</p>
              <p>Jl. R. Syamsudin, S.H. No. 50</p>
              <p>Sukabumi, Jawa Barat, 43113</p>
              <p>Universitas Muhammadiyah Sukabumi</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 LT-UMMI. All rights reserved. | Universitas Muhammadiyah Sukabumi</p>
        </div>
      </div>
    </footer>
  )
}

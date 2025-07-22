import Link from "next/link"
import Image from "next/image"

export default function LandingHero() {
  return (
    <section className="relative py-20 px-6 bg-gray-50">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/gdg-ummi.jpg"
          alt="Gedung UMMI"
          fill
          className="object-cover brightness-75"
          priority
        />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Laboratorium Terpadu
                <span className="text-blue-500"> Universitas Muhammadiyah Sukabumi</span>
              </h1>
              <p className="text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Mulai Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

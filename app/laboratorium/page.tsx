'use client'

import Link from "next/link"

const labs = [
  {
    slug: "lab-pemrograman",
    name: "Lab Pemrograman",
    description: "Laboratorium untuk praktikum pemrograman dasar hingga lanjutan",
    equipment: ["Komputer PC", "Software IDE", "Compiler"],
    capacity: "40 Mahasiswa",
    emoji: "💻",
    color: "bg-blue-500",
  },
  {
    slug: "lab-jaringan",
    name: "Lab Jaringan",
    description: "Laboratorium untuk praktikum jaringan komputer dan keamanan sistem",
    equipment: ["Router Cisco", "Switch", "Kabel UTP", "Network Analyzer"],
    capacity: "30 Mahasiswa",
    emoji: "🌐",
    color: "bg-green-500",
  },
  {
    slug: "lab-multimedia",
    name: "Lab Multimedia",
    description: "Laboratorium untuk praktikum desain grafis dan pengolahan multimedia",
    equipment: ["Komputer High-End", "Tablet Grafis", "Camera"],
    capacity: "25 Mahasiswa",
    emoji: "🎨",
    color: "bg-purple-500",
  },
  {
    slug: "lab-hardware",
    name: "Lab Hardware",
    description: "Laboratorium untuk praktikum perakitan dan maintenance komputer",
    equipment: ["Motherboard", "Processor", "RAM", "Tools Kit"],
    capacity: "20 Mahasiswa",
    emoji: "🔧",
    color: "bg-orange-500",
  },
  {
    slug: "lab-mobile-dev",
    name: "Lab Mobile Dev",
    description: "Laboratorium untuk pengembangan aplikasi mobile dan IoT",
    equipment: ["Smartphone", "Tablet", "Arduino", "Sensor Kit"],
    capacity: "35 Mahasiswa",
    emoji: "📱",
    color: "bg-indigo-500",
  },
  {
    slug: "lab-ai-ml",
    name: "Lab AI & ML",
    description: "Laboratorium untuk praktikum artificial intelligence dan machine learning",
    equipment: ["GPU Server", "Python Environment", "TensorFlow"],
    capacity: "30 Mahasiswa",
    emoji: "🤖",
    color: "bg-cyan-500",
  },
]

export default function LabPage() {
  return (
    <>
      <section id="laboratorium" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Daftar Laboratorium</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Berikut adalah daftar laboratorium yang tersedia di UPT Lab Terpadu Universitas Muhammadiyah Sukabumi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labs.map((lab, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${lab.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {lab.emoji}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{lab.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">{lab.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="mr-1">👥</span>
                    <span>Kapasitas: {lab.capacity}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Peralatan Utama:</h4>
                  <div className="flex flex-wrap gap-1">
                    {lab.equipment.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={`/laboratorium/${lab.slug}`}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors text-center block"
                  >
                    Lebih Lanjut
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Laboratorium Terpadu UMMI. All rights reserved.
        </p>
      </footer>
    </>
  )
}

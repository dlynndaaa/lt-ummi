import { notFound } from "next/navigation"

const labData = [
  {
    slug: "lab-pemrograman",
    name: "Lab Pemrograman",
    description: "Laboratorium untuk praktikum pemrograman dasar hingga lanjutan.",
    equipment: ["Komputer PC", "Software IDE", "Compiler"],
    capacity: "40 Mahasiswa",
    emoji: "💻",
    color: "bg-blue-500",
  },
  {
    slug: "lab-jaringan",
    name: "Lab Jaringan",
    description: "Laboratorium untuk praktikum jaringan komputer dan keamanan sistem.",
    equipment: ["Router Cisco", "Switch", "Kabel UTP", "Network Analyzer"],
    capacity: "30 Mahasiswa",
    emoji: "🌐",
    color: "bg-green-500",
  },
  {
    slug: "lab-multimedia",
    name: "Lab Multimedia",
    description: "Laboratorium untuk praktikum desain grafis dan pengolahan multimedia.",
    equipment: ["Komputer High-End", "Tablet Grafis", "Camera"],
    capacity: "25 Mahasiswa",
    emoji: "🎨",
    color: "bg-purple-500",
  },
  {
    slug: "lab-hardware",
    name: "Lab Hardware",
    description: "Laboratorium untuk praktikum perakitan dan maintenance komputer.",
    equipment: ["Motherboard", "Processor", "RAM", "Tools Kit"],
    capacity: "20 Mahasiswa",
    emoji: "🔧",
    color: "bg-orange-500",
  },
  {
    slug: "lab-mobile-dev",
    name: "Lab Mobile Dev",
    description: "Laboratorium untuk pengembangan aplikasi mobile dan IoT.",
    equipment: ["Smartphone", "Tablet", "Arduino", "Sensor Kit"],
    capacity: "35 Mahasiswa",
    emoji: "📱",
    color: "bg-indigo-500",
  },
  {
    slug: "lab-ai-ml",
    name: "Lab AI & ML",
    description: "Laboratorium untuk praktikum artificial intelligence dan machine learning.",
    equipment: ["GPU Server", "Python Environment", "TensorFlow"],
    capacity: "30 Mahasiswa",
    emoji: "🤖",
    color: "bg-cyan-500",
  },
]

export default function LabDetailPage({ params }: { params: { slug: string } }) {
  const lab = labData.find((lab) => lab.slug === params.slug)

  if (!lab) return notFound()

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <div className={`w-16 h-16 ${lab.color} text-3xl flex items-center justify-center rounded-xl mx-auto`}>
            {lab.emoji}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">{lab.name}</h1>
          <p className="text-gray-600 text-lg mt-2">{lab.description}</p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detail Laboratorium</h2>
          <ul className="text-gray-700 space-y-2 text-sm">
            <li><strong>Kapasitas:</strong> {lab.capacity}</li>
            <li><strong>Peralatan Utama:</strong></li>
            <ul className="list-disc list-inside ml-4">
              {lab.equipment.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </ul>
        </div>

        <div className="text-center">
          <a
            href="/laboratorium"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Kembali ke daftar laboratorium
          </a>
        </div>
      </div>
    </section>

  )
}

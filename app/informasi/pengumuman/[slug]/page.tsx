import { notFound } from "next/navigation"

const dataPengumuman = [
  {
    slug: "jadwal-praktikum",
    title: "Pengumuman Jadwal Praktikum",
    date: "2 Juli 2025",
    content:
      "Jadwal praktikum semester ganjil telah dirilis. Silakan cek sistem informasi akademik masing-masing untuk detail waktu dan ruangan praktikum.",
  },
  {
    slug: "pendaftaran-asisten",
    title: "Pendaftaran Asisten Praktikum",
    date: "18 Juni 2025",
    content:
      "Pendaftaran asisten praktikum telah dibuka. Formulir dapat diakses melalui website resmi laboratorium. Batas waktu pendaftaran adalah 25 Juni 2025.",
  },
]

export default function PengumumanDetail({ params }: { params: { slug: string } }) {
  const item = dataPengumuman.find((p) => p.slug === params.slug)

  if (!item) return notFound()

  return (
    <div className="py-20 px-6 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{item.date}</p>
        <div className="text-gray-700 leading-relaxed text-justify">{item.content}</div>
      </div>
    </div>
  )
}

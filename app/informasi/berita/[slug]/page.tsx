import { notFound } from "next/navigation"

const dataBerita = [
  {
    slug: "pelatihan-admin-lab",
    title: "Pelatihan Admin Lab Berbasis Cloud",
    date: "20 Juni 2025",
    content:
      "UPT Lab Terpadu mengadakan pelatihan admin laboratorium berbasis cloud. Tujuan dari pelatihan ini adalah untuk meningkatkan efisiensi dalam pengelolaan laboratorium.",
  },
  {
    slug: "fitur-monitoring",
    title: "Update Fitur Monitoring",
    date: "15 Juni 2025",
    content:
      "Fitur monitoring untuk penggunaan alat dan ruang telah ditambahkan ke sistem. Fitur ini membantu admin melihat penggunaan lab secara real-time.",
  },
]

export default function BeritaDetail({ params }: { params: { slug: string } }) {
  const item = dataBerita.find((b) => b.slug === params.slug)

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

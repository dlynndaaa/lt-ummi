import Link from "next/link"

export default function LandingInformasi() {
  const informasi = [
    {
      title: "Pengumuman Jadwal Praktikum",
      date: "2 Juli 2025",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      slug: "jadwal-praktikum",
      type: "pengumuman",
    },
    {
      title: "Pemeliharaan Server",
      date: "29 Juni 2025",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      slug: "pemeliharaan-server",
      type: "pengumuman",
    },
    {
      title: "Peminjaman Alat via Mobile",
      date: "25 Juni 2025",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      slug: "peminjaman-mobile",
      type: "berita",
    },
    {
      title: "Pelatihan Admin Lab",
      date: "20 Juni 2025",
      summary:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      slug: "pelatihan-admin-lab",
      type: "berita",
    },
  ]

  return (
    <section id="informasi" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Informasi
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Grid 2 kolom per baris */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {informasi.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div>
                <p className="text-sm text-gray-400 mb-2">{item.date}</p>
                <h4 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm mb-6">{item.summary}</p>
              </div>
              <div className="mt-auto flex justify-end">
                <Link
                  href={`/informasi/${item.type}/${item.slug}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Lebih Lanjut →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol ke halaman informasi lengkap */}
        <div className="mt-10 flex justify-end">
          <Link href="/informasi" className="text-blue-600 underline text-sm font-medium">
            Informasi lainnya
          </Link>
        </div>
      </div>
    </section>
  )
}

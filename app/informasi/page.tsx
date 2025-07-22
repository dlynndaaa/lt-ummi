import Link from "next/link"

const pengumuman = [
  {
    title: "Pengumuman Jadwal Praktikum",
    date: "2 Juli 2025",
    content: "Jadwal praktikum semester ganjil telah dirilis. Silakan cek pada sistem informasi akademik masing-masing.",
    slug: "jadwal-praktikum",
  },
  {
    title: "Pendaftaran Asisten Praktikum",
    date: "18 Juni 2025",
    content: "Pendaftaran asisten praktikum telah dibuka. Syarat dan ketentuan dapat dilihat pada formulir pendaftaran.",
    slug: "pendaftaran-asisten",
  },
  {
    title: "Pemeliharaan Server",
    date: "29 Juni 2025",
    content: "Akan ada downtime sistem pada 30 Juni 2025 pukul 00.00–04.00 WIB untuk keperluan pemeliharaan server.",
    slug: "pemeliharaan-server",
  },
]

const berita = [
  {
    title: "Pelatihan Admin Lab Berbasis Cloud",
    date: "20 Juni 2025",
    content: "UPT Lab Terpadu mengadakan pelatihan admin lab berbasis cloud untuk peningkatan kualitas pelayanan laboratorium.",
    slug: "pelatihan-admin-lab",
  },
  {
    title: "Update Fitur Monitoring",
    date: "15 Juni 2025",
    content: "Fitur monitoring penggunaan alat dan ruangan kini tersedia di dashboard laboratorium.",
    slug: "fitur-monitoring",
  },
  {
    title: "Peminjaman Alat via Mobile",
    date: "25 Juni 2025",
    content: "Aplikasi mobile untuk peminjaman alat kini dapat diakses oleh seluruh mahasiswa dan dosen.",
    slug: "peminjaman-mobile",
  },
]

export default function InformasiPage() {
  return (
    <>
      <section id="informasi" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Informasi</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Halaman ini memuat seluruh informasi resmi terkait laboratorium terpadu, termasuk pengumuman dan berita terbaru.
            </p>
          </div>

          {/* Bagian Pengumuman */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📢 Pengumuman</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pengumuman.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col"
                >
                  <p className="text-sm text-gray-400 mb-1">{item.date}</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-700 text-sm mb-4">{item.content}</p>
                  <div className="mt-auto text-right">
                    <Link
                      href={`/informasi/pengumuman/${item.slug}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Selengkapnya →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian Berita */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📰 Berita</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {berita.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 flex flex-col"
                >
                  <p className="text-sm text-gray-400 mb-1">{item.date}</p>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-gray-700 text-sm mb-4">{item.content}</p>
                  <div className="mt-auto text-right">
                    <Link
                      href={`/informasi/berita/${item.slug}`}
                      className="text-blue-600 text-sm font-medium hover:underline"
                    >
                      Selengkapnya →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
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

import Image from "next/image"

export default function LandingTentang() {
  const tim = [
    {
      name: "Billyardi Ramdhan, M.Si.",
      position: "Ketua UPT Lab Terpadu UMMI",
      photo: "/pak-billy.jpg",
    },
    {
      name: "Lela Lailatul Khumaisah, M.Si.",
      position: "Kepala Lab Sains dan Pengembangan Aset-SDM",
      photo: "/bu-lela.jpg",
    },
    {
      name: "Siti Muawanah Robial, M.Si.",
      position: "Kepala Lab Teknik dan Standarisasi-Akreditasi",
      photo: "/bu-siti.jpg",
    },
    {
      name: "Erik Candra Pertala, M.Hum.",
      position: "Kepala Lab Sosial Humaniora Pendidikan dan Pengelolaan Keuangan",
      photo: "/pak-erik.jpg",
    },
    {
      name: "Fathia Frazna Azzahra, M.T.",
      position: "Kepala Lab Informatik-Komputer dan Pengenbangan Layanan-SIM",
      photo: "/bu-fathia.jpg",
    },
    {
      name: "Amir Hamzah, M.Kep.",
      position: "Kepala Lab Kesehatan dan Hilirisasi-Publikasi-Kerjasama",
      photo: "/pak-amir.jpg",
    },
    {
      name: "Sri Wahyuni, M.Si.",
      position: "Staf Keuangan UPT Lab Terpadu UMMI",
      photo: "/teh-sri.jpg",
    },
  ]

  return (
    <section id="tentang" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Tentang Lab Terpadu UMMI</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kenali struktur dan pengelola Laboratorium Terpadu UMMI yang mendukung kegiatan praktikum dan riset
            mahasiswa dengan profesionalitas dan dedikasi tinggi.
          </p>
        </div>

        {/* Tim */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {tim.map((person, index) => {
            const isLastCentered = tim.length % 3 === 1 && index === tim.length - 1
            return (
              <div
                key={index}
                className={`bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 ${
                  isLastCentered ? "lg:col-start-2" : ""
                }`}
              >
                <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden">
                  <Image
                    src={person.photo}
                    alt={person.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{person.name}</h3>
                <p className="text-sm text-gray-500">{person.position}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

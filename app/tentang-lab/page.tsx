"use client";

import Image from "next/image";

export default function TentangLabPage() {
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
  ];

  return (
    <>
      <section id="tentang" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tentang Lab Terpadu UMMI
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kenali lebih dekat Laboratorium Terpadu Universitas Muhammadiyah Sukabumi yang mendukung kegiatan akademik, praktikum, dan riset mahasiswa lintas disiplin.
            </p>
          </div>

          {/* Info: Visi, Misi, Tujuan, Fungsi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-2xl font-semibold text-blue-700 mb-2">Visi</h3>
              <p className="text-gray-700">
                Menjadi pusat laboratorium terpadu yang unggul dalam mendukung pembelajaran, penelitian, dan pengabdian kepada masyarakat di tingkat nasional maupun internasional.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-green-50 p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <h3 className="text-2xl font-semibold text-green-700 mb-2">Misi</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Menyediakan layanan laboratorium yang berkualitas untuk mendukung kegiatan akademik dan praktikum.</li>
                <li>Meningkatkan sarana dan prasarana laboratorium secara berkelanjutan.</li>
                <li>Mendorong kegiatan riset kolaboratif lintas bidang ilmu.</li>
                <li>Menyelenggarakan pelatihan, workshop, dan layanan berbasis laboratorium untuk masyarakat umum.</li>
              </ul>
            </div>

            {/* Tujuan */}
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-2xl font-semibold text-yellow-700 mb-2">Tujuan</h3>
              <p className="text-gray-700">
                Mendukung terlaksananya Tridharma Perguruan Tinggi dengan menyediakan fasilitas dan layanan laboratorium yang lengkap, modern, dan terintegrasi untuk semua program studi di Universitas Muhammadiyah Sukabumi.
              </p>
            </div>

            {/* Fungsi */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md border-l-4 border-purple-500">
              <h3 className="text-2xl font-semibold text-purple-700 mb-2">Fungsi</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Mengelola fasilitas laboratorium terpadu di lingkungan UMMI.</li>
                <li>Memastikan ketersediaan alat, bahan, dan teknisi untuk kegiatan praktikum dan penelitian.</li>
                <li>Mengembangkan sistem manajemen laboratorium berbasis standar mutu dan keamanan.</li>
                <li>Mendukung kolaborasi antara akademisi, industri, dan masyarakat melalui kegiatan berbasis laboratorium.</li>
              </ul>
            </div>
          </div>

          {/* Struktur Organisasi */}
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Struktur Organisasi
            </h3>
            <div className="max-w-4xl mx-auto rounded-lg overflow-hidden shadow">
              <Image
                src="/struktur.jpg"
                alt="Struktur Organisasi"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Tim Pengelola */}
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-10">
              Tim Pengelola
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {tim.map((person, index) => {
                const isLastCentered = tim.length % 3 === 1 && index === tim.length - 1;
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
                    <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
                    <p className="text-sm text-gray-500">{person.position}</p>
                  </div>
                );
              })}
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
  );
}

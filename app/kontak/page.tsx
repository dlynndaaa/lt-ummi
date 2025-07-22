export default function KontakPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <section id="kontak" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Judul */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Hubungi Kami</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Silakan hubungi kami untuk pertanyaan, kerjasama, atau informasi lebih lanjut mengenai Laboratorium Terpadu.
              </p>
            </div>

            {/* Kartu Informasi Kontak */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Telepon */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="text-blue-600 mb-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1c-9.39 0-17-7.61-17-17a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Telepon</h3>
                <p className="text-gray-600">081234567890</p>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="text-green-600 mb-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v2l-10 6L2 8V6c0-1.1.9-2 2-2zm0 6.5l8 4.8 8-4.8V18c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-7.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Email</h3>
                <p className="text-gray-600">info@ummi.ac.id</p>
              </div>

              {/* Alamat */}
              <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-lg transition">
                <div className="text-yellow-500 mb-4">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Alamat</h3>
                <p className="text-gray-600">
                  Jl. R. Syamsudin, S.H. No. 50<br />
                  Sukabumi, Jawa Barat, 43113<br />
                  Universitas Muhammadiyah Sukabumi
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Laboratorium Terpadu UMMI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

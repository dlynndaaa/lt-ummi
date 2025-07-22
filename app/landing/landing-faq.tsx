"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "Bagaimana cara mendaftar di SIMPEL-TI?",
    answer: "Anda dapat mendaftar melalui halaman registrasi dengan menggunakan email yang valid.",
  },
  {
    question: "Siapa saja yang bisa menggunakan sistem ini?",
    answer: "Sistem ini dapat digunakan oleh mahasiswa, dosen, dan staff laboratorium Teknik Informatika.",
  },
  {
    question: "Bagaimana cara meminjam alat laboratorium?",
    answer:
      "Anda dapat login ke sistem, memilih peralatan yang ingin dipinjam, mengisi formulir peminjaman, dan menunggu persetujuan dari admin laboratorium.",
  },
  {
    question: "Berapa lama proses persetujuan peminjaman?",
    answer:
      "Proses persetujuan peminjaman biasanya membutuhkan waktu 1-2 hari kerja tergantung pada ketersediaan admin.",
  },
  {
    question: "Apa yang terjadi jika saya terlambat mengembalikan peralatan?",
    answer: "Keterlambatan pengembalian akan dikenakan sanksi sesuai dengan kebijakan laboratorium yang berlaku.",
  },
  {
    question: "Bagaimana cara mengembalikan peralatan peminjaman?",
    answer: "Peralatan dapat dikembalikan langsung ke laboratorium dengan melaporkan kondisi alat kepada admin.",
  },
]

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">FAQ (Frequently Asked Question)</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 text-sm md:text-base">{item.question}</span>
                <span className="text-gray-500 flex-shrink-0 ml-2">{openIndex === index ? "−" : "+"}</span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4">
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client";

import { logoUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { FaArrowLeft, FaDownload, FaGlobe } from "react-icons/fa";
import { Container } from "../(site)/components/Container";
import Footer from "../(site)/components/Footer";

export default function CVPageClient() {
  const router = useRouter();
  const [language, setLanguage] = useState<"english" | "spanish">("english");

  const cvFiles = {
    english: {
      pdf: "/cv/Pablo Barbero CV eng.pdf",
      download: "/cv/Pablo Barbero CV eng.pdf",
      label: "English",
      downloadText: "Download (EN)",
    },
    spanish: {
      pdf: "/cv/Pablo Barbero CV esp.pdf",
      download: "/cv/Pablo Barbero CV esp.pdf",
      label: "Español",
      downloadText: "Descargar (ES)",
    },
  };

  const currentCV = cvFiles[language];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Simple Header */}
      <nav className="flex items-center justify-center bg-myGreenComplement/50 w-full">
        <Container noPadding className="flex items-center justify-around sticky z-50 top-0 sm:justify-between w-full px-0.5 py-5 sm:px-12 shadow-sm">
          <button
            className="absolute top-1/2 transform -translate-y-1/2 w-[150px] h-[67px] hidden lg:block cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Image src={logoUrl} alt="logo" fill className="object-contain" sizes="100%" />
          </button>
          <div className="flex flex-1 justify-center">{/* Empty spacer to center content */}</div>
          <div className="mr-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-myGray hover:text-myGreen hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </Container>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-myGrayDark mb-2">Pablo Barbero</h1>
                <p className="text-lg text-myGray">Fullstack Developer (Frontend-Heavy)</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {/* Language Toggle */}
                <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setLanguage("english")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      language === "english" ? "bg-myGreen text-myGrayDark shadow-md" : "text-myGray hover:text-myGrayDark"
                    }`}
                  >
                    <FaGlobe className="w-4 h-4" />
                    <span className="font-medium">English</span>
                  </button>
                  <button
                    onClick={() => setLanguage("spanish")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                      language === "spanish" ? "bg-myGreen text-myGrayDark shadow-md" : "text-myGray hover:text-myGrayDark"
                    }`}
                  >
                    <FaGlobe className="w-4 h-4" />
                    <span className="font-medium">Español</span>
                  </button>
                </div>

                {/* Download Button */}
                <a
                  href={currentCV.download}
                  download
                  className="flex items-center gap-2 px-6 py-3 bg-myGreen hover:bg-myGreenBold text-myGrayDark rounded-lg transition-all duration-300 hover:scale-105 shadow-lg font-medium cursor-pointer"
                >
                  <FaDownload className="w-4 h-4" />
                  {currentCV.downloadText}
                </a>
              </div>
            </div>
          </div>

          {/* PDF Viewer Card */}
          <div className="shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-myGreen to-myGreenBold p-4 text-myGrayDark">
              <p className="text-sm font-medium">Viewing: {currentCV.label} Version</p>
            </div>

            {/* PDF Iframe */}
            <div className="relative bg-gray-100">
              <iframe
                src={currentCV.pdf}
                className="w-full h-[80vh] border-0"
                title={`Pablo Barbero Resume - ${currentCV.label}`}
                key={language} // Force re-render when language changes
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-md inline-block">
              <p className="text-myGrayDark mb-3">
                <span className="font-semibold">Looking to collaborate?</span>
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/about" className="px-5 py-2 bg-myGreen hover:bg-myGreenBold text-myGrayDark rounded-lg transition-colors font-medium text-sm">
                  Learn More About The Project
                </Link>
                <a
                  href="mailto:pablobarbero220@gmail.com"
                  className="px-5 py-2 bg-myGray hover:bg-myGrayDark text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

"use client";

import Link from "next/link";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-myGrayDark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">About This Project</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              A fullstack vacation rental platform built to showcase modern web development skills. This portfolio project demonstrates expertise in React,
              Next.js, TypeScript, advanced frontend development and security.
            </p>
            <Link href="/about" className="inline-block text-myGreen hover:text-myGreenBold transition-colors text-sm font-medium">
              Learn more about this project →
            </Link>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                <FaEnvelope className="w-5 h-5 text-myGreen" />
                <a href="mailto:pablobarbero220@gmail.com" className="text-sm">
                  pablobarbero220@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/in/barberopablo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <FaLinkedin className="w-5 h-5 text-myGreen" />
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/BarberoPablo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
                >
                  <FaGithub className="w-5 h-5 text-myGreen" />
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>

          {/* Resume Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">My Resume</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              View my professional experience, skills, and qualifications. Available in English and Spanish.
            </p>
            <Link
              href="/cv"
              className="inline-flex items-center gap-2 bg-myGreen hover:bg-myGreenBold text-myGrayDark px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium w-full justify-center shadow-lg"
            >
              View Resume →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              Built by <span className="text-myGreen font-semibold">Pablo Barbero</span> · Portfolio Project
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/BarberoPablo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-myGreen transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/barberopablo/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-myGreen transition-colors"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

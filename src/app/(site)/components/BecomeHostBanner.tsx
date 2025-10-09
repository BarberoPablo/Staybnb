"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IoAddCircleOutline, IoHomeOutline } from "react-icons/io5";

export default function BecomeHostBanner() {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-myGreen to-myGreenBold p-12 md:p-16"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10">
            <IoHomeOutline className="w-32 h-32 text-white" />
          </div>
          <div className="absolute bottom-10 right-10">
            <IoHomeOutline className="w-24 h-24 text-white" />
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Become a host</h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">Share your space and earn extra income while meeting travelers from around the world</p>

          <Link
            href="/hosting/create"
            className="inline-flex items-center gap-2 bg-white text-myGreenBold px-8 py-4 rounded-full font-semibold text-lg hover:bg-myGreenExtraLight hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <IoAddCircleOutline className="w-6 h-6" />
            Start hosting
          </Link>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div>
              <div className="text-3xl font-bold mb-2">Easy</div>
              <p className="text-white/80">Simple setup process with step by step guidance</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Flexible</div>
              <p className="text-white/80">You decide when to host and at what price</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Secure</div>
              <p className="text-white/80">We provide protection for your property</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

import { generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import { FaEnvelope, FaFileAlt, FaGithub, FaLinkedin, FaReact, FaServer } from "react-icons/fa";
import { SiNextdotjs, SiPostgresql, SiPrisma, SiSupabase, SiTailwindcss, SiTypescript } from "react-icons/si";
import { Container } from "../components/Container";

export const metadata = generateSEOMetadata({
  title: "About This Project - Portfolio by Pablo Barbero",
  description:
    "Learn about this fullstack (frontend-heavy) vacation rental platform built with Next.js, TypeScript, React, and modern frontend technologies. A portfolio project showcasing advanced web development skills.",
  keywords: ["portfolio", "fullstack", "frontend developer", "Next.js", "TypeScript", "React", "web development", "Pablo Barbero"],
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container>
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-myGrayDark">About This Project</h1>
          <p className="text-xl text-myGray max-w-2xl mx-auto">
            A fullstack (frontend-heavy) vacation rental platform built to showcase modern web development expertise
          </p>
        </section>

        {/* Important Notice */}
        <section className="bg-gradient-to-r from-myGreenExtraLight to-myGreenLight rounded-2xl p-8 border-l-4 border-myGreen">
          <h2 className="text-2xl font-bold text-myGrayDark mb-4">📢 Portfolio Project Notice</h2>
          <div className="space-y-3 text-myGrayDark">
            <p className="leading-relaxed">
              <strong>This is a portfolio project</strong> created to demonstrate fullstack web development skills with a focus on frontend excellence. All
              listings, reservations, and content are for demonstration purposes only.
            </p>
            <p className="leading-relaxed">
              <strong>No payment system has been implemented</strong> for this project. Since all listings are fictional, I chose not to include payment
              processing to avoid any legal or ethical complications. This decision prioritizes transparency and responsible development practices.
            </p>
            <p className="leading-relaxed text-sm">
              If you&apos;re a recruiter or potential employer, please explore the application to see the features and code quality. For any questions or
              to discuss opportunities, feel free to reach out!
            </p>
          </div>
        </section>

        {/* About the Developer */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-myGrayDark">About the Developer</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-semibold text-myGrayDark mb-4">Pablo Barbero</h3>
            <p className="text-myGray leading-relaxed mb-6">
              Fullstack developer with a strong focus on frontend development, passionate about building scalable, user-friendly web applications. This
              project showcases my ability to design and implement complex features, from authentication and responsive UI to real-time search and
              interactive booking systems.
            </p>

            {/* Contact Links */}
            <div className="flex flex-wrap gap-4 mb-6">
              <a
                href="mailto:pablobarbero220@gmail.com"
                className="flex items-center gap-2 bg-myGray text-background px-4 py-2 rounded-lg hover:bg-myGrayDark transition-colors"
              >
                <FaEnvelope className="w-4 h-4" />
                Email Me
              </a>
              <a
                href="https://www.linkedin.com/in/barberopablo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-background px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="https://github.com/BarberoPablo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-800 text-background px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors"
              >
                <FaGithub className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={process.env.NEXT_PUBLIC_BASE_URL + "/cv"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-myPurpleBold text-background px-4 py-2 rounded-lg hover:bg-myPurpleBold/80 transition-colors"
              >
                <FaFileAlt className="w-4 h-4" />
                My CV
              </a>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-myGrayDark">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <FaReact className="w-8 h-8 text-blue-500" />
                <h3 className="text-xl font-semibold text-myGrayDark">Frontend</h3>
              </div>
              <ul className="space-y-2 text-myGray">
                <li className="flex items-center gap-2">
                  <SiNextdotjs className="w-5 h-5" />
                  <span>
                    <strong>Next.js 15</strong> - App Router, Server Components, ISR
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <SiTypescript className="w-5 h-5 text-blue-600" />
                  <span>
                    <strong>TypeScript</strong> - Type-safe development
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <SiTailwindcss className="w-5 h-5 text-cyan-500" />
                  <span>
                    <strong>Tailwind CSS</strong> - Modern styling
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FaReact className="w-5 h-5 text-cyan-400" />
                  <span>
                    <strong>Framer Motion</strong> - Animations
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <FaServer className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-semibold text-myGrayDark">Backend</h3>
              </div>
              <ul className="space-y-2 text-myGray">
                <li className="flex items-center gap-2">
                  <SiPrisma className="w-5 h-5" />
                  <span>
                    <strong>Prisma ORM</strong> - Database management
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <SiPostgresql className="w-5 h-5 text-blue-700" />
                  <span>
                    <strong>PostgreSQL</strong> - Relational database
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <SiSupabase className="w-5 h-5 text-green-500" />
                  <span>
                    <strong>Supabase</strong> - Authentication & Storage
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FaReact className="w-5 h-5 text-cyan-400" />
                  <span>
                    <strong>Zustand</strong> - Lightweight state management
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-myGrayDark">Key Features Implemented</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Authentication System", desc: "Secure user authentication with Supabase Auth" },
              { title: "Advanced Search", desc: "Filter by location, dates, guests, and amenities" },
              { title: "Booking System", desc: "Real-time availability calendar with date selection" },
              { title: "State Management", desc: "Complex state handling with React hooks and Zustand" },
              { title: "Host Dashboard", desc: "Complete listing management and reservations tracking" },
              { title: "Image Management", desc: "Multiple image upload with UploadThing" },
              { title: "Favorites System", desc: "Save and manage favorite listings" },
              { title: "Responsive Design", desc: "Mobile-first design that works on all devices" },
              { title: "SEO Optimization", desc: "Server-side rendering, metadata, and structured data" },
              { title: "Email Notifications", desc: "Automated emails for bookings and confirmations" },
              { title: "Dynamic Pricing", desc: "Promotional pricing and special offers" },
              { title: "Reviews & Ratings", desc: "User feedback and rating system" },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:border-myGreen transition-colors">
                <h3 className="font-semibold text-myGrayDark mb-2">{feature.title}</h3>
                <p className="text-sm text-myGray">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code Quality */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-myGrayDark">Code Quality & Best Practices</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <ul className="space-y-3 text-myGray">
              <li className="flex items-start gap-3">
                <span className="text-myGreen text-xl">✓</span>
                <span>
                  <strong>Type Safety:</strong> Comprehensive TypeScript usage with strict mode enabled
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-myGreen text-xl">✓</span>
                <span>
                  <strong>Code Organization:</strong> Clean architecture with separation of concerns
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-myGreen text-xl">✓</span>
                <span>
                  <strong>Performance:</strong> Server components, ISR, and optimized images
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-myGreen text-xl">✓</span>
                <span>
                  <strong>Error Handling:</strong> Comprehensive error boundaries and validation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-myGreen text-xl">✓</span>
                <span>
                  <strong>Security:</strong> Input validation, SQL injection prevention, and secure payments
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-myGreen text-xl">✓</span>
                <span>
                  <strong>Accessibility:</strong> Semantic HTML and ARIA attributes
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Source Code */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-myGrayDark">View the Source Code</h2>
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white">
            <p className="mb-6 leading-relaxed">
              Want to see how it&apos;s built? The complete source code is available on GitHub. Feel free to explore the codebase, architecture decisions,
              and implementation details.
            </p>
            <a
              href="https://github.com/BarberoPablo/Staybnb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              <FaGithub className="w-5 h-5" />
              View on GitHub
            </a>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center space-y-6 pt-8">
          <h2 className="text-3xl font-bold text-myGrayDark">Let&apos;s Connect!</h2>
          <p className="text-xl text-myGray max-w-2xl mx-auto">
            I&apos;m actively seeking opportunities to contribute my skills to innovative projects. If you think I&apos;d be a good fit for your team,
            let&apos;s talk!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:pablobarbero220@gmail.com"
              className="flex items-center gap-2 bg-myGreen hover:bg-myGreenBold text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FaEnvelope className="w-5 h-5" />
              Get in Touch
            </a>
            <Link
              href="/"
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-myGrayDark px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg border-2 border-gray-200"
            >
              Explore the App
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}

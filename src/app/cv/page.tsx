import { generateSEOMetadata } from "@/lib/seo";
import CVPageClient from "./CVPageClient";

export const metadata = generateSEOMetadata({
  title: "Pablo Barbero - Resume",
  description: "Fullstack (Frontend-Heavy) Developer Resume. View and download in English or Spanish.",
  keywords: ["Pablo Barbero", "Resume", "CV", "Frontend Developer", "Fullstack Developer", "React", "Next.js"],
  path: "/cv",
});

export default function ResumePage() {
  return <CVPageClient />;
}

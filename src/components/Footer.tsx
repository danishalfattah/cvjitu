import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border-color)] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <Image
              src="/logo.svg"
              width={100}
              height={100}
              quality={100}
              alt="logo"
            />
            <span className="text-gray-600">—</span>
            <span className="text-gray-600">Memberdayakan Pekerjaan Layak</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-6 text-sm text-gray-600">
              <a
                href="/terms"
                className="hover:text-[var(--red-normal)] transition-colors"
              >
                Syarat
              </a>
              <a
                href="/privacy"
                className="hover:text-[var(--red-normal)] transition-colors"
              >
                Privasi
              </a>
            </div>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-gray-500 hover:text-[var(--red-normal)] cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-500 hover:text-[var(--red-normal)] cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-500 hover:text-[var(--red-normal)] cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-500 hover:text-[var(--red-normal)] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
            <p className="text-sm text-gray-500 mb-4 sm:mb-0">
              © {new Date().getFullYear()} CVJitu. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with ❤️ for better careers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

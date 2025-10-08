import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--border-color)] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[var(--red-normal)] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">CV</span>
              </div>
              <span className="font-poppins font-semibold text-xl text-[var(--neutral-ink)]">CVJitu</span>
            </div>
            <span className="text-gray-600">—</span>
            <span className="text-gray-600">Memberdayakan Pekerjaan Layak (SDG 8)</span>
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">8</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-[var(--red-normal)] transition-colors">Syarat</a>
              <a href="#" className="hover:text-[var(--red-normal)] transition-colors">Privasi</a>
              <a href="#" className="hover:text-[var(--red-normal)] transition-colors">Kontak</a>
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

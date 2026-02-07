"use client"

import Link from "next/link";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-0">
            <span>© {currentYear} KutumbaTree. All rights reserved.</span>
            <span>•</span>
            <a href="#" className="hover:text-kutumba-maroon transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="#" className="hover:text-kutumba-maroon transition-colors">
              Terms
            </a>
            <span>•</span>
            <a href="#" className="hover:text-kutumba-maroon transition-colors">
              Security
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span>Built for Indian families</span>
            <div className="flex items-center gap-2 px-2 py-1 bg-accent rounded">
              <div className="w-2 h-2 bg-kutumba-green rounded-full"></div>
              <span className="text-xs font-medium">🇮🇳 India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
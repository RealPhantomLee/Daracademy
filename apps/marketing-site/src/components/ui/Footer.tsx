"use client";

import { BookOpen, Linkedin, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-color-navy text-color-ivory mt-20 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Logo + Tagline */}
        <div className="flex items-center gap-3">
          <BookOpen
            size={24}
            className="text-accent-primary"
            strokeWidth={1.5}
          />
          <div>
            <h3 className="text-xl font-serif font-bold text-color-ivory">
              Daracademy
            </h3>
            <p className="text-sm text-color-neutral-200">
              Empowering minds through education.
            </p>
          </div>
        </div>

        {/* Links + Social */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Footer Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-color-ivory">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="#about"
                className="text-color-neutral-200 hover:text-accent-primary transition-colors text-sm"
              >
                About
              </a>
              <a
                href="#subjects"
                className="text-color-neutral-200 hover:text-accent-primary transition-colors text-sm"
              >
                Subjects
              </a>
              <a
                href="#contact"
                className="text-color-neutral-200 hover:text-accent-primary transition-colors text-sm"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-color-ivory">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-accent-primary" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} className="text-accent-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-accent-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} className="text-accent-primary" />
              </a>
            </div>
          </div>

          {/* Spacer for grid alignment */}
          <div />
        </div>

        {/* Copyright */}
        <div className="border-t border-color-neutral-700 pt-6 text-center">
          <p className="text-sm text-color-neutral-300">
            © 2025 Daracademy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

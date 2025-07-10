'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Settings } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-lg' 
        : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              CV <span className="text-red-600">Reswara Praptama</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                Home
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                Services
              </Link>
              <Link href="#portfolio" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                Portfolio
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                About
              </Link>
              <Link href="#team" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                Team
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-500 hover:text-red-600 px-3 py-2 text-sm font-medium transition-colors duration-300">
                <Settings size={18} />
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-600 transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link href="/" className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Home
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Services
            </Link>
            <Link href="#portfolio" className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Portfolio
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              About
            </Link>
            <Link href="#team" className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Team
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Contact
            </Link>
            <Link href="/admin" className="text-gray-500 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
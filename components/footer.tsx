'use client';

import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold mb-4">
                CV <span className="text-red-600">Reswara Praptama</span>
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Professional engineering consulting services delivering innovative solutions 
                for your complex engineering challenges. Excellence in every project.
              </p>
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail size={18} className="mr-3 text-red-600" />
                  <span>info@cvreswarapraptama.com</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone size={18} className="mr-3 text-red-600" />
                  <span>+62 123 456 7890</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin size={18} className="mr-3 text-red-600" />
                  <span>Jakarta, Indonesia</span>
                </div>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Structural Engineering
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Mechanical Design
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Project Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Technical Consulting
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#portfolio" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-red-600 transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; 2024 CV Reswara Praptama. All rights reserved.
            </p>
            <p className="text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-2 text-red-600" /> for engineering excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
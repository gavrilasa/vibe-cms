'use client';

import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600 to-blue-600"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-xl opacity-20"></div>
      </div>
      
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                CV Reswara Praptama
              </h3>
              <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                Professional engineering consulting services delivering innovative solutions 
                for your complex engineering challenges. Excellence in every project.
              </p>
              <div className="flex items-center text-gray-300 mb-4">
                <Mail size={18} className="mr-3 text-purple-400" />
                <span>info@cvreswarapraptama.com</span>
              </div>
              <div className="flex items-center text-gray-300 mb-4">
                <Phone size={18} className="mr-3 text-blue-400" />
                <span>+62 123 456 7890</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin size={18} className="mr-3 text-green-400" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                    Structural Engineering
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    Mechanical Design
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-green-400 transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    Project Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-orange-400 transition-colors duration-300 flex items-center">
                    <span className="w-2 h-2 bg-orange-400 rounded-full mr-3"></span>
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
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#team" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                    Our Team
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-orange-400 transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-700/50 py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
              &copy; 2024 CV Reswara Praptama. All rights reserved.
            </p>
            <p className="text-gray-400 flex items-center">
              Made with <Heart size={16} className="mx-2 text-red-400" /> for engineering excellence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
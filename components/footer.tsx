import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">CV Reswara Praptama</h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Professional engineering consulting services delivering innovative solutions 
              for your complex engineering challenges.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-400">
                <Mail size={18} className="mr-2" />
                <span>info@cvreswarapraptama.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Structural Engineering</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mechanical Design</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Project Management</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Technical Consulting</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>+62 123 456 7890</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CV Reswara Praptama. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
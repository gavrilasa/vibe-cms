'use client';

import { useState, useEffect } from 'react';
import { Wrench, Building, Calculator, Zap, Cog, Shield } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

const iconMap = {
  Wrench,
  Building,
  Calculator,
  Zap,
  Cog,
  Shield,
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/admin/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const defaultServices = [
    {
      id: '1',
      title: 'Structural Engineering',
      description: 'Design and analysis of building structures, ensuring safety and compliance with industry standards.',
      icon: 'Building',
      order: 1,
    },
    {
      id: '2',
      title: 'Mechanical Design',
      description: 'Innovative mechanical system design and optimization for industrial and commercial applications.',
      icon: 'Cog',
      order: 2,
    },
    {
      id: '3',
      title: 'Project Management',
      description: 'Comprehensive project management services from conception to completion.',
      icon: 'Shield',
      order: 3,
    },
    {
      id: '4',
      title: 'Technical Consulting',
      description: 'Expert technical consultation and problem-solving for complex engineering challenges.',
      icon: 'Wrench',
      order: 4,
    },
    {
      id: '5',
      title: 'Quality Assurance',
      description: 'Rigorous quality control and assurance processes to ensure project excellence.',
      icon: 'Calculator',
      order: 5,
    },
    {
      id: '6',
      title: 'Electrical Systems',
      description: 'Electrical system design, installation, and maintenance for various applications.',
      icon: 'Zap',
      order: 6,
    },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive engineering solutions tailored to meet your specific needs and requirements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayServices.map((service) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Wrench;
            
            return (
              <div
                key={service.id}
                className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <IconComponent size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                <div className="mt-6">
                  <button className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                    Learn More →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
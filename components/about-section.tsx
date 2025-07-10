'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Award, Users, TrendingUp } from 'lucide-react';

export function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('about');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: Award, value: '10+', label: 'Years Experience', color: 'from-purple-500 to-pink-500' },
    { icon: Users, value: '50+', label: 'Projects Completed', color: 'from-blue-500 to-cyan-500' },
    { icon: TrendingUp, value: '25+', label: 'Happy Clients', color: 'from-green-500 to-emerald-500' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate', color: 'from-orange-500 to-red-500' },
  ];

  const features = [
    {
      title: 'Quality Assurance',
      description: 'Rigorous quality control processes',
      icon: CheckCircle,
    },
    {
      title: 'Expert Team',
      description: 'Highly skilled engineering professionals',
      icon: Users,
    },
    {
      title: 'Innovation',
      description: 'Cutting-edge solutions and technologies',
      icon: TrendingUp,
    },
    {
      title: 'Support',
      description: '24/7 customer support and maintenance',
      icon: Award,
    },
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-purple-100 to-transparent rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-100 to-transparent rounded-full blur-3xl opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About CV Reswara
              <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                Praptama
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              With over a decade of experience in engineering consulting, CV Reswara Praptama has established itself as a trusted partner for businesses seeking innovative and reliable engineering solutions.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our commitment to excellence, attention to detail, and customer-focused approach have made us a preferred choice for clients across various industries.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 rounded-xl bg-gradient-to-r ${stat.color} transform hover:scale-105 transition-all duration-300 shadow-lg`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/90 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-purple-100">
                <div className="space-y-6">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                      style={{ animationDelay: `${(index + 4) * 200}ms` }}
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Award, Users, TrendingUp, Target } from 'lucide-react';

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
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: Users, value: '50+', label: 'Projects Completed' },
    { icon: TrendingUp, value: '25+', label: 'Happy Clients' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate' },
  ];

  const features = [
    {
      title: 'Quality Assurance',
      description: 'Rigorous quality control processes ensure excellence in every project',
      icon: CheckCircle,
    },
    {
      title: 'Expert Team',
      description: 'Highly skilled engineering professionals with proven expertise',
      icon: Users,
    },
    {
      title: 'Innovation',
      description: 'Cutting-edge solutions using the latest technologies and methodologies',
      icon: Target,
    },
    {
      title: 'Support',
      description: '24/7 customer support and comprehensive maintenance services',
      icon: Award,
    },
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              About Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About CV Reswara
              <span className="block text-red-600">Praptama</span>
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
                  className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <stat.icon className="w-8 h-8 text-red-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Us</h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                    style={{ animationDelay: `${(index + 4) * 200}ms` }}
                  >
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
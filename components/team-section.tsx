'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Linkedin, User, Star } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl?: string | null;
  email?: string | null;
  linkedin?: string | null;
  order: number;
}

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/admin/team');
        if (response.ok) {
          const data = await response.json();
          data.sort((a: TeamMember, b: TeamMember) => a.order - b.order);
          setTeam(data);
        }
      } catch (error) {
        console.error('Error fetching team:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('team');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-600 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-600 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            Our Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our
            <span className="block text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
              Expert Team
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the skilled professionals behind our engineering excellence
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 mt-4">Loading team members...</p>
          </div>
        ) : team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.id}
                className={`group bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Profile Image */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <User size={48} className="text-gray-500" />
                    )}
                  </div>
                  {/* Status Indicator */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Star size={12} className="text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-semibold mb-4 bg-purple-50 px-3 py-1 rounded-full inline-block">
                  {member.position}
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {member.description}
                </p>
                
                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Mail size={18} className="text-white" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Linkedin size={18} className="text-white" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Section Coming Soon</h3>
              <p className="text-gray-600">Our team section is currently being updated.</p>
              <p className="text-gray-500 text-sm mt-2">Please check back soon!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
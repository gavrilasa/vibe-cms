'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Linkedin, User } from 'lucide-react';

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
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Our Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet Our <span className="text-red-600">Expert Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the skilled professionals behind our engineering excellence
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-500 mt-4">Loading team members...</p>
          </div>
        ) : team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={member.id}
                className={`group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Profile Image */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-red-50 shadow-lg group-hover:border-red-100 transition-colors duration-300">
                    {member.imageUrl ? (
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-red-600 font-semibold mb-4 bg-red-50 px-3 py-1 rounded-full inline-block">
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
                      className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                    >
                      <Mail size={18} className="text-white" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
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
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-gray-100 max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={32} className="text-red-600" />
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
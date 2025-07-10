'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; // <-- 1. Impor komponen Image
import { Mail, Linkedin, User } from 'lucide-react';

// Define the TeamMember type to match the data from your API
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
  }, []);

  return (
    <section id="team" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the skilled professionals behind our engineering excellence
          </p>
        </div>
        
        {isLoading ? (
          <div className="text-center text-gray-500">Loading team members...</div>
        ) : team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* 2. Ubah div pembungkus gambar */}
                <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {member.imageUrl ? (
                    // 3. Gunakan komponen <Image>
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
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.position}</p>
                <p className="text-gray-600 mb-6 leading-relaxed">{member.description}</p>
                
                <div className="flex justify-center space-x-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Mail size={18} className="text-white" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin size={18} className="text-white" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
            <p>Our team section is currently being updated.</p>
            <p className="mt-2 text-sm">Please check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
}

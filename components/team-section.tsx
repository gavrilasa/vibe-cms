'use client';

import { useState, useEffect } from 'react';
import { Mail, Linkedin } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
  imageUrl?: string;
  email?: string;
  linkedin?: string;
  order: number;
}

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/admin/team');
        if (response.ok) {
          const data = await response.json();
          setTeam(data);
        }
      } catch (error) {
        console.error('Error fetching team:', error);
      }
    };

    fetchTeam();
  }, []);

  const defaultTeam = [
    {
      id: '1',
      name: 'Reswara Praptama',
      position: 'Principal Engineer',
      description: 'Lead engineer with extensive experience in structural and mechanical engineering.',
      imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
      email: 'reswara@example.com',
      linkedin: 'https://linkedin.com/in/reswara',
      order: 1,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: 'Senior Structural Engineer',
      description: 'Specialized in high-rise building design and seismic analysis.',
      imageUrl: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
      email: 'sarah@example.com',
      linkedin: 'https://linkedin.com/in/sarah',
      order: 2,
    },
    {
      id: '3',
      name: 'Michael Chen',
      position: 'Mechanical Systems Engineer',
      description: 'Expert in HVAC systems and mechanical design optimization.',
      imageUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
      email: 'michael@example.com',
      linkedin: 'https://linkedin.com/in/michael',
      order: 3,
    },
  ];

  const displayTeam = team.length > 0 ? team : defaultTeam;

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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayTeam.map((member) => (
            <div
              key={member.id}
              className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                {member.imageUrl ? (
                  <img 
                    src={member.imageUrl} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
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
      </div>
    </section>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, User } from 'lucide-react';

// Define the TeamMember type based on your Prisma schema
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

export default function ManageTeam() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // State for the form (add/edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<Partial<TeamMember>>({
    name: '',
    position: '',
    description: '',
    imageUrl: '',
    email: '',
    linkedin: '',
    order: 0,
  });

  // Fetch all team members when the component mounts
  useEffect(() => {
    checkAuth();
    fetchTeamMembers();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      } else {
        setError('Failed to fetch team members.');
      }
    } catch (err) {
      setError('An error occurred while fetching team members.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const url = isEditing ? `/api/admin/team/${currentMember.id}` : '/api/admin/team';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMember),
      });

      if (response.ok) {
        setMessage(`Team member ${isEditing ? 'updated' : 'created'} successfully!`);
        closeForm();
        fetchTeamMembers(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'An error occurred.');
      }
    } catch (err) {
      setError('A network error occurred.');
    }
  };

  const openFormForAdd = () => {
    setIsEditing(false);
    setCurrentMember({
      name: '',
      position: '',
      description: '',
      imageUrl: '',
      email: '',
      linkedin: '',
      order: teamMembers.length,
    });
    setIsFormOpen(true);
  };

  const openFormForEdit = (member: TeamMember) => {
    setIsEditing(true);
    setCurrentMember(member);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/team/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Team member deleted successfully!');
        fetchTeamMembers(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete team member.');
      }
    } catch (err) {
      setError('A network error occurred while deleting.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Team</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800">{message}</div>}
        {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}

        <div className="flex justify-end mb-6">
          <button
            onClick={openFormForAdd}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Add Team Member</span>
          </button>
        </div>

        {isLoading ? (
          <p>Loading team members...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <li key={member.id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="h-8 w-8 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                        <p className="text-sm text-gray-600 mt-1">{member.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => openFormForEdit(member)} className="text-gray-400 hover:text-blue-600">
                        <Edit size={20} />
                      </button>
                      <button onClick={() => handleDelete(member.id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Team Member' : 'Add New Member'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={currentMember.name || ''}
                  onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={currentMember.position || ''}
                  onChange={(e) => setCurrentMember({ ...currentMember, position: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={currentMember.description || ''}
                  onChange={(e) => setCurrentMember({ ...currentMember, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={currentMember.imageUrl || ''}
                  onChange={(e) => setCurrentMember({ ...currentMember, imageUrl: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
                <input
                  type="email"
                  value={currentMember.email || ''}
                  onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL (Optional)</label>
                <input
                  type="url"
                  value={currentMember.linkedin || ''}
                  onChange={(e) => setCurrentMember({ ...currentMember, linkedin: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  value={currentMember.order || 0}
                  onChange={(e) => setCurrentMember({ ...currentMember, order: parseInt(e.target.value, 10) || 0 })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={closeForm} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  {isEditing ? 'Save Changes' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

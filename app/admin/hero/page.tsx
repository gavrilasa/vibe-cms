'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
}

export default function HeroEditor() {
  const router = useRouter();
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuth();
    fetchHeroContent();
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

  const fetchHeroContent = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      if (response.ok) {
        const data = await response.json();
        setHeroContent(data || {
          id: '',
          title: 'Engineering Excellence',
          subtitle: 'CV Reswara Praptama',
          description: 'Delivering innovative engineering solutions with precision, expertise, and commitment to excellence.',
          imageUrl: ''
        });
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!heroContent) return;

    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(heroContent),
      });

      if (response.ok) {
        setMessage('Hero content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error updating hero content');
      }
    } catch (error) {
      setMessage('Error updating hero content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Edit Hero Section</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={heroContent?.subtitle || ''}
                  onChange={(e) => setHeroContent(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CV Reswara Praptama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={heroContent?.title || ''}
                  onChange={(e) => setHeroContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Engineering Excellence"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={heroContent?.description || ''}
                  onChange={(e) => setHeroContent(prev => prev ? { ...prev, description: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Delivering innovative engineering solutions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={heroContent?.imageUrl || ''}
                  onChange={(e) => setHeroContent(prev => prev ? { ...prev, imageUrl: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category: string;
  projectUrl?: string | null;
  order: number;
}

export default function ManagePortfolio() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // State for the form (add/edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPortfolio, setCurrentPortfolio] = useState<Partial<Portfolio>>({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    projectUrl: '',
    order: 0,
  });

  const categories = [
    'Structural Engineering',
    'Mechanical Design',
    'Electrical Systems',
    'Civil Engineering',
    'Industrial Design',
    'Infrastructure'
  ];

  useEffect(() => {
    checkAuth();
    fetchPortfolios();
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

  const fetchPortfolios = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolios(data);
      } else {
        setError('Failed to fetch portfolio items.');
      }
    } catch (err) {
      setError('An error occurred while fetching portfolio items.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const url = isEditing ? `/api/admin/portfolio/${currentPortfolio.id}` : '/api/admin/portfolio';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPortfolio),
      });

      if (response.ok) {
        setMessage(`Portfolio item ${isEditing ? 'updated' : 'created'} successfully!`);
        closeForm();
        fetchPortfolios();
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
    setCurrentPortfolio({
      title: '',
      description: '',
      imageUrl: '',
      category: categories[0],
      projectUrl: '',
      order: portfolios.length,
    });
    setIsFormOpen(true);
  };

  const openFormForEdit = (portfolio: Portfolio) => {
    setIsEditing(true);
    setCurrentPortfolio(portfolio);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleDelete = async (portfolioId: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/portfolio/${portfolioId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Portfolio item deleted successfully!');
        fetchPortfolios();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete portfolio item.');
      }
    } catch (err) {
      setError('A network error occurred while deleting.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Portfolio</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-6">
          <button
            onClick={openFormForAdd}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add Portfolio Item</span>
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading portfolio items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 relative">
                  {portfolio.imageUrl ? (
                    <img
                      src={portfolio.imageUrl}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {portfolio.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{portfolio.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {portfolio.projectUrl && (
                        <a
                          href={portfolio.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <span className="text-xs text-gray-500">Order: {portfolio.order}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openFormForEdit(portfolio)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl max-h-full overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {isEditing ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={currentPortfolio.title || ''}
                  onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={currentPortfolio.description || ''}
                  onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={currentPortfolio.category || ''}
                  onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={currentPortfolio.imageUrl || ''}
                  onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project URL (Optional)</label>
                <input
                  type="url"
                  value={currentPortfolio.projectUrl || ''}
                  onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, projectUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://project-url.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                <input
                  type="number"
                  value={currentPortfolio.order || 0}
                  onChange={(e) => setCurrentPortfolio({ ...currentPortfolio, order: parseInt(e.target.value, 10) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Create Portfolio Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
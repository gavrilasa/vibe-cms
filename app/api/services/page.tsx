'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Edit, Trash2, Wrench, Building, Calculator, Zap, Cog, Shield } from 'lucide-react';

// Define the Service type based on your Prisma schema
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

// A map of available icons to render them dynamically
const iconMap: { [key: string]: React.ElementType } = {
  Wrench,
  Building,
  Calculator,
  Zap,
  Cog,
  Shield,
};

export default function ManageServices() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // State for the form (add/edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Wrench',
    order: 0,
  });

  // Fetch all services when the component mounts
  useEffect(() => {
    checkAuth();
    fetchServices();
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

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      } else {
        setError('Failed to fetch services.');
      }
    } catch (err) {
      setError('An error occurred while fetching services.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const url = isEditing ? `/api/admin/services/${currentService.id}` : '/api/admin/services';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentService),
      });

      if (response.ok) {
        setMessage(`Service ${isEditing ? 'updated' : 'created'} successfully!`);
        closeForm();
        fetchServices(); // Refresh the list
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
    setCurrentService({ title: '', description: '', icon: 'Wrench', order: services.length });
    setIsFormOpen(true);
  };

  const openFormForEdit = (service: Service) => {
    setIsEditing(true);
    setCurrentService(service);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentService({});
    setMessage('');
    setError('');
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Service deleted successfully!');
        fetchServices(); // Refresh the list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete service.');
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
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Manage Services</h1>
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
            <span>Add New Service</span>
          </button>
        </div>

        {isLoading ? (
          <p>Loading services...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {services.map((service) => {
                const IconComponent = iconMap[service.icon] || Wrench;
                return (
                  <li key={service.id} className="p-4 sm:p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Order: {service.order}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button onClick={() => openFormForEdit(service)} className="text-gray-400 hover:text-blue-600">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDelete(service.id)} className="text-gray-400 hover:text-red-600">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={currentService.title || ''}
                  onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={currentService.description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Icon</label>
                <select
                  value={currentService.icon || 'Wrench'}
                  onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(iconMap).map(iconName => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                  ))}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                <input
                  type="number"
                  value={currentService.order || 0}
                  onChange={(e) => setCurrentService({ ...currentService, order: parseInt(e.target.value, 10) || 0 })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={closeForm} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  {isEditing ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

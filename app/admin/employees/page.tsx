'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, User, Shield, Plus } from 'lucide-react';

interface Employee {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ManageEmployees() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // State untuk form registrasi
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ email: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);

  const fetchEmployees = async () => {
    try {
      const employeesRes = await fetch('/api/admin/employees');
      if (!employeesRes.ok) throw new Error('Failed to fetch employees');
      const data = await employeesRes.json();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const verifyAndFetch = async () => {
      try {
        const verifyRes = await fetch('/api/auth/verify');
        if (!verifyRes.ok) throw new Error('Not authenticated');
        
        const { user } = await verifyRes.json();
        if (user.role !== 'ADMIN') throw new Error('Not authorized');

        fetchEmployees();
      } catch (err: any) {
        setError(err.message);
        if (err.message === 'Not authenticated') router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    verifyAndFetch();
  }, [router]);
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');
    setMessage('');

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEmployee),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(`Employee ${data.user.email} created successfully!`);
            setIsFormOpen(false);
            setNewEmployee({ email: '', password: '' });
            fetchEmployees(); // Refresh daftar employee
        } else {
            setError(data.error || 'Registration failed.');
        }
    } catch (err) {
        setError('A network error occurred during registration.');
    } finally {
        setIsRegistering(false);
    }
  };


  const handleDelete = async (employeeId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete employee: ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Employee deleted successfully!');
        setEmployees(employees.filter((e) => e.id !== employeeId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete employee.');
      }
    } catch (err) {
      setError('A network error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={() => router.push('/admin')} className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Manage Employees</h1>
            <div />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800">{message}</div>}
        {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800">{error}</div>}

        <div className="flex justify-end mb-6">
            <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus size={18} />
                <span>Add New Employee</span>
            </button>
        </div>

        {isLoading ? (
          <p>Loading employees...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {employees.map((employee) => (
                <li key={employee.id} className="p-4 sm:p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${employee.role === 'ADMIN' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        {employee.role === 'ADMIN' ? <Shield className="h-6 w-6 text-blue-600" /> : <User className="h-6 w-6 text-gray-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{employee.email}</p>
                        <p className="text-xs text-gray-500">
                          Role: <span className={`font-medium ${employee.role === 'ADMIN' ? 'text-blue-600' : 'text-gray-700'}`}>{employee.role}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Joined: {new Date(employee.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {employee.role === 'EMPLOYEE' && (
                       <button onClick={() => handleDelete(employee.id, employee.email)} className="text-gray-400 hover:text-red-600">
                         <Trash2 size={20} />
                       </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Modal Form untuk Registrasi Employee Baru */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Register New Employee</h2>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={isRegistering} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {isRegistering ? 'Registering...' : 'Register Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Building2, User, Lock, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { empId: string; role: 'employee' | 'ld_team' | 'intern'; name: string }) => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [selectedRole, setSelectedRole] = useState<'intern' | 'employee' | 'admin' | 'mentor'>('employee');
  const [credentials, setCredentials] = useState({
    empId: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Simple user database for demo
  const users = [
    // Regular employees
    { empId: 'EMP001', password: 'password123', role: 'employee' as const, name: 'Rajesh Kumar' },
    { empId: 'EMP002', password: 'password123', role: 'employee' as const, name: 'Priya Sharma' },
    { empId: 'EMP003', password: 'password123', role: 'employee' as const, name: 'Amit Patel' },
    
    // L&D Team members
    { empId: 'IOCLAdmin', password: 'admin123', role: 'ld_team' as const, name: 'Dr. Suresh Gupta' },
    { empId: 'L&DAdmin', password: 'admin123', role: 'ld_team' as const, name: 'Ms. Kavita Singh' },
    { empId: 'AdminLD', password: 'admin123', role: 'ld_team' as const, name: 'Mr. Vikram Mehta' },
    
    // Interns
    { empId: 'IOCL-123456', password: 'intern123', role: 'intern' as const, name: 'Rahul Sharma' },
    { empId: 'IOCL-123457', password: 'intern123', role: 'intern' as const, name: 'Priya Patel' },
    { empId: 'IOCL-123458', password: 'intern123', role: 'intern' as const, name: 'Amit Singh' },
    
    // Mentors
    { empId: 'MENTOR001', password: 'mentor123', role: 'mentor' as const, name: 'Dr. Rajesh Kumar' },
    { empId: 'MENTOR002', password: 'mentor123', role: 'mentor' as const, name: 'Ms. Priya Sharma' },
    { empId: 'MENTOR003', password: 'mentor123', role: 'mentor' as const, name: 'Mr. Amit Patel' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Filter users based on selected role
    let filteredUsers = users;
    if (selectedRole === 'intern') {
      filteredUsers = users.filter(u => u.role === 'intern');
    } else if (selectedRole === 'employee') {
      filteredUsers = users.filter(u => u.role === 'employee');
    } else if (selectedRole === 'admin') {
      filteredUsers = users.filter(u => u.role === 'ld_team');
    } else if (selectedRole === 'mentor') {
      filteredUsers = users.filter(u => u.role === 'mentor');
    }

    const user = filteredUsers.find(u => u.empId === credentials.empId && u.password === credentials.password);

    if (user) {
      onLogin({
        empId: user.empId,
        role: user.role as 'employee' | 'ld_team' | 'intern' | 'mentor',
        name: user.name
      });
    } else {
      setError(`Invalid ${selectedRole === 'admin' ? 'Admin' : selectedRole === 'mentor' ? 'Mentor' : selectedRole === 'intern' ? 'Intern' : 'Employee'} ID or Password`);
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {onBack && (
          <div className="mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-blue-200 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Building2 className="h-12 w-12 text-orange-400" />
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">IOCL Portal</h1>
              <p className="text-blue-200 text-sm">Intern Onboarding System</p>
            </div>
          </div>
          <p className="text-blue-200">
            Secure login with your assigned credentials
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Your Role
            </label>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedRole('employee')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedRole === 'employee'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedRole === 'admin'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('mentor')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedRole === 'mentor'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mentor
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('intern')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedRole === 'intern'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Intern
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="empId"
                  value={credentials.empId}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    selectedRole === 'employee' ? 'Enter Employee ID (e.g., EMP001)' :
                    selectedRole === 'admin' ? 'Enter Admin ID (e.g., IOCLAdmin)' :
                    selectedRole === 'mentor' ? 'Enter Mentor ID (e.g., MENTOR001)' :
                    'Enter Intern ID (e.g., IOCL-123456)'
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Credentials:</h4>
            <div className="space-y-3 text-xs text-gray-600">
              {selectedRole === 'employee' && (
                <div className="bg-gray-50 p-2 rounded">
                  <p><strong>Employee:</strong> EMP001 / password123</p>
                  <p><strong>Employee:</strong> EMP002 / password123</p>
                </div>
              )}
              {selectedRole === 'admin' && (
                <div className="bg-gray-50 p-2 rounded">
                  <p><strong>Admin:</strong> IOCLAdmin / admin123</p>
                  <p><strong>Admin:</strong> L&DAdmin / admin123</p>
                </div>
              )}
              {selectedRole === 'mentor' && (
                <div className="bg-gray-50 p-2 rounded">
                  <p><strong>Mentor:</strong> MENTOR001 / mentor123</p>
                  <p><strong>Mentor:</strong> MENTOR002 / mentor123</p>
                </div>
              )}
              {selectedRole === 'intern' && (
                <div className="bg-gray-50 p-2 rounded">
                  <p><strong>Intern:</strong> IOCL-123456 / intern123</p>
                  <p><strong>Intern:</strong> IOCL-123457 / intern123</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            © 2025 Indian Oil Corporation Limited. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React from 'react';
import { Building2, Target, Users, Award, ChevronRight, Upload } from 'lucide-react';

interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
}

interface HomepageProps {
  user: User;
}

const Homepage: React.FC<HomepageProps> = ({ user }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          <Building2 className="h-12 w-12 text-orange-400" />
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-blue-100 text-lg">Empowering the next generation of energy professionals</p>
          </div>
        </div>
        <p className="text-blue-100 text-lg leading-relaxed">
          {user.role === 'ld_team' 
            ? 'As an L&D team member, you have full access to manage intern applications, assign mentors, track progress, and generate certificates.'
            : user.role === 'intern'
            ? 'As an intern, you can submit your project reports and track your internship progress through this portal.'
            : user.role === 'mentor'
            ? 'As a mentor, you can manage your assigned interns, assign tasks, provide feedback, and review their project submissions.'
            : 'As an IOCL employee, you can refer potential interns by filling their details in the system. Your referrals will be reviewed by the L&D team.'
          }
        </p>
      </div>

      {/* Role-specific Information */}
      {user.role === 'employee' && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-800">Employee Access</h3>
          </div>
          <p className="text-orange-700 mb-4">
            As an IOCL employee, you can refer potential interns to our program. Your role includes:
          </p>
          <ul className="text-orange-700 space-y-2">
            <li>• Fill intern details and upload required documents</li>
            <li>• Submit referral applications for L&D team review</li>
            <li>• Track the status of your referrals</li>
          </ul>
        </div>
      )}

      {user.role === 'intern' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800">Intern Access</h3>
          </div>
          <p className="text-blue-700 mb-4">
            As an intern, you have access to submit your project reports and track your progress. Your access includes:
          </p>
          <ul className="text-blue-700 space-y-2">
            <li>• Submit project reports in PDF format</li>
            <li>• Track your project submission status</li>
            <li>• Download completion certificates upon approval</li>
            <li>• View feedback from your assigned mentor</li>
          </ul>
        </div>
      )}

      {user.role === 'mentor' && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800">Mentor Access</h3>
          </div>
          <p className="text-purple-700 mb-4">
            As a mentor, you have comprehensive access to guide and evaluate your assigned interns:
          </p>
          <ul className="text-purple-700 space-y-2">
            <li>• View and manage all interns assigned to you</li>
            <li>• Assign tasks and track intern progress</li>
            <li>• Provide ratings and detailed feedback</li>
            <li>• Schedule and manage meetings with interns</li>
            <li>• Review and approve/reject project submissions</li>
            <li>• Grade completed projects and provide feedback</li>
          </ul>
        </div>
      )}

      {user.role === 'ld_team' && (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-800">L&D Team Access</h3>
          </div>
          <p className="text-green-700 mb-4">
            As an L&D team member, you have comprehensive access to manage the entire intern lifecycle:
          </p>
          <ul className="text-green-700 space-y-2">
            <li>• Review and approve/reject intern applications</li>
            <li>• Assign mentors to approved interns</li>
            <li>• Track intern progress and manage tasks</li>
            <li>• Generate approval letters and completion certificates</li>
            <li>• Manage project submissions and evaluations</li>
          </ul>
        </div>
      )}

      {/* Company Vision */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Target className="h-8 w-8 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          To be the Energy of India - A globally admired company contributing to India's energy security 
          in an environmentally sustainable manner through innovative and efficient energy solutions.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="font-semibold text-blue-800 mb-2">Innovation</h3>
            <p className="text-gray-600">Fostering cutting-edge solutions in energy sector</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-6">
            <h3 className="font-semibold text-orange-800 mb-2">Sustainability</h3>
            <p className="text-gray-600">Commitment to environmental responsibility</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-2">Excellence</h3>
            <p className="text-gray-600">Delivering superior quality in all operations</p>
          </div>
        </div>
      </div>

      {/* Portal Features */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Portal Features</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Comprehensive Onboarding</h3>
                <p className="text-gray-600">Complete intern registration and document management</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Mentor Assignment</h3>
                <p className="text-gray-600">Efficient mentor allocation and management system</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Application Tracking</h3>
                <p className="text-gray-600">Real-time status updates and transparency</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Dashboard Analytics</h3>
                <p className="text-gray-600">Comprehensive intern progress monitoring</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Automated Certificates</h3>
                <p className="text-gray-600">Digital approval letters and completion certificates</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ChevronRight className="h-5 w-5 text-orange-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">Project Submission</h3>
                <p className="text-gray-600">Secure project report submission system</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Access Information */}
      <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="h-6 w-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-orange-800">Access Information</h3>
        </div>
        <p className="text-orange-700">
          <strong>Authorized Personnel:</strong> This portal is exclusively designed for IOCL employees, 
          with role-based access for employees and L&D team members. All activities are logged 
          and monitored for security and compliance purposes.
        </p>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Building2 className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Contact Information</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Toll Free Number</h3>
              <p className="text-blue-700 text-lg font-mono">1800-2333-555</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-800 mb-2">Commercial LPG Helpline</h3>
              <p className="text-orange-700 text-lg font-mono">1860-5991-111</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">LPG Emergency Helpline</h3>
              <p className="text-red-700 text-lg font-mono">1906</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Last Updated</h3>
              <p className="text-gray-700">16/07/2025 01:05 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
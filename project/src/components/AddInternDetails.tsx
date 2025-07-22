import React, { useState } from 'react';
import { UserPlus, Save, FileText, Upload, AlertCircle, Camera } from 'lucide-react';

interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
}

interface AddInternDetailsProps {
  user: User;
}

const AddInternDetails: React.FC<AddInternDetailsProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    course: '',
    semester: '',
    rollNumber: '',
    department: '',
    startDate: '',
    endDate: '',
    address: '',
    photo: null as File | null,
    resume: null as File | null,
    collegeId: null as File | null,
    lastSemesterResult: null as File | null,
    noc: null as File | null,
    idProof: null as File | null,
    otherDocument: null as File | null,
    referredBy: user.name,
    referredByEmpId: user.empId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Human Resources',
    'Information Technology',
    'Marketing',
    'Finance',
    'Operations',
    'Engineering',
    'Research & Development',
    'Quality Assurance',
    'Pipelines Division',
    'Refineries',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College name is required';
    if (!formData.course.trim()) newErrors.course = 'Course is required';
    if (!formData.semester.trim()) newErrors.semester = 'Semester is required';
    if (!formData.rollNumber.trim()) newErrors.rollNumber = 'Roll number is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (!formData.resume) newErrors.resume = 'Resume is required';
    if (!formData.collegeId) newErrors.collegeId = 'College ID is required';
    if (!formData.lastSemesterResult) newErrors.lastSemesterResult = 'Last semester result is required';
    if (!formData.idProof) newErrors.idProof = 'ID proof is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate Intern ID
      const internId = `IOCL-${Date.now().toString().slice(-6)}`;
      
      alert(`Intern registered successfully!\nIntern ID: ${internId}`);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        collegeName: '',
        course: '',
        semester: '',
        rollNumber: '',
        department: '',
        startDate: '',
        endDate: '',
        address: '',
        photo: null,
        resume: null,
        collegeId: null,
        lastSemesterResult: null,
        noc: null,
        idProof: null,
        otherDocument: null,
        referredBy: user.name,
        referredByEmpId: user.empId,
      });
      
      // Reset file inputs
      const fileInputs = ['photo', 'resume', 'collegeId', 'lastSemesterResult', 'noc', 'idProof', 'otherDocument'];
      fileInputs.forEach(inputId => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) input.value = '';
      });
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type based on field
      const allowedTypes: Record<string, string[]> = {
        photo: ['image/jpeg', 'image/jpg', 'image/png'],
        resume: ['application/pdf'],
        collegeId: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        lastSemesterResult: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        noc: ['application/pdf'],
        idProof: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        otherDocument: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
      };

      if (allowedTypes[fieldName] && !allowedTypes[fieldName].includes(file.type)) {
        alert(`Please select a valid file type for ${fieldName}`);
        e.target.value = '';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));

      // Clear error when file is selected
      if (errors[fieldName]) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: ''
        }));
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <UserPlus className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {user.role === 'employee' ? 'Refer an Intern' : 'Add Intern Details'}
          </h2>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
          <p className="text-blue-700">
            {user.role === 'employee' 
              ? 'Fill in the details of the intern you want to refer. Your referral will be reviewed by the L&D team.'
              : 'Add comprehensive intern details including all required documents for the onboarding process.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Referral Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Referral Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referred By
                </label>
                <input
                  type="text"
                  value={formData.referredBy}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID
                </label>
                <input
                  type="text"
                  value={formData.referredByEmpId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Intern's Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter complete address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Photo Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Photo <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <Camera className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload photo</span>
                      <input
                        id="photo"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) => handleFileChange(e, 'photo')}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">JPG, PNG up to 5MB</p>
                  {formData.photo && (
                    <p className="text-sm text-green-600">{formData.photo.name}</p>
                  )}
                </div>
              </div>
              {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Intern's Academic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College/University Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.collegeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter college/university name"
                />
                {errors.collegeName && <p className="text-red-500 text-sm mt-1">{errors.collegeName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.course ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter course name"
                />
                {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester/Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.semester ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter semester/year"
                />
                {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rollNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter roll number"
                />
                {errors.rollNumber && <p className="text-red-500 text-sm mt-1">{errors.rollNumber}</p>}
              </div>
            </div>
          </div>

          {/* Internship Details */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Internship Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              <Upload className="inline h-5 w-5 mr-2" />
              Document Uploads
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Resume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="resume" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload resume</span>
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, 'resume')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 5MB</p>
                    {formData.resume && (
                      <p className="text-sm text-green-600">{formData.resume.name}</p>
                    )}
                  </div>
                </div>
                {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
              </div>

              {/* College ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College ID <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="collegeId" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload college ID</span>
                        <input
                          id="collegeId"
                          type="file"
                          accept=".pdf,image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleFileChange(e, 'collegeId')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    {formData.collegeId && (
                      <p className="text-sm text-green-600">{formData.collegeId.name}</p>
                    )}
                  </div>
                </div>
                {errors.collegeId && <p className="text-red-500 text-sm mt-1">{errors.collegeId}</p>}
              </div>

              {/* Last Semester Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Semester Result <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="lastSemesterResult" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload result</span>
                        <input
                          id="lastSemesterResult"
                          type="file"
                          accept=".pdf,image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleFileChange(e, 'lastSemesterResult')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    {formData.lastSemesterResult && (
                      <p className="text-sm text-green-600">{formData.lastSemesterResult.name}</p>
                    )}
                  </div>
                </div>
                {errors.lastSemesterResult && <p className="text-red-500 text-sm mt-1">{errors.lastSemesterResult}</p>}
              </div>

              {/* ID Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Proof (Aadhar/PAN) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="idProof" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload ID proof</span>
                        <input
                          id="idProof"
                          type="file"
                          accept=".pdf,image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleFileChange(e, 'idProof')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    {formData.idProof && (
                      <p className="text-sm text-green-600">{formData.idProof.name}</p>
                    )}
                  </div>
                </div>
                {errors.idProof && <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>}
              </div>

              {/* NOC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NOC (No Objection Certificate)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="noc" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload NOC</span>
                        <input
                          id="noc"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, 'noc')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF up to 5MB</p>
                    {formData.noc && (
                      <p className="text-sm text-green-600">{formData.noc.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Other Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Document (if asked by guide)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-6 w-6 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="otherDocument" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload document</span>
                        <input
                          id="otherDocument"
                          type="file"
                          accept=".pdf,image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleFileChange(e, 'otherDocument')}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                    {formData.otherDocument && (
                      <p className="text-sm text-green-600">{formData.otherDocument.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Submitting...' : user.role === 'employee' ? 'Submit Referral' : 'Submit Application'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInternDetails;
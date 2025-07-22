import React, { useState } from 'react';
import { Upload, FileText, Download, CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';

interface ProjectSubmission {
  id: string;
  internId: string;
  internName: string;
  department: string;
  projectTitle: string;
  submissionDate: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  fileUrl?: string;
  feedback?: string;
  grade?: string;
}

interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
}

interface ProjectSubmissionProps {
  user?: User;
}

const ProjectSubmission: React.FC<ProjectSubmissionProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('submit');
  const [submissionForm, setSubmissionForm] = useState({
    internId: '',
    projectTitle: '',
    description: '',
    file: null as File | null,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const submissions: ProjectSubmission[] = [
    {
      id: '1',
      internId: 'IOCL-123456',
      internName: 'Rahul Sharma',
      department: 'Engineering',
      projectTitle: 'Pipeline Safety Analysis System',
      submissionDate: '2025-01-18',
      status: 'Approved',
      fileUrl: '/reports/pipeline-safety-analysis.pdf',
      feedback: 'Excellent work on safety protocols analysis. Well-structured report with practical recommendations.',
      grade: 'A+',
    },
    {
      id: '2',
      internId: 'IOCL-123457',
      internName: 'Priya Patel',
      department: 'Information Technology',
      projectTitle: 'Database Optimization for Inventory Management',
      submissionDate: '2025-01-19',
      status: 'Under Review',
      fileUrl: '/reports/database-optimization.pdf',
    },
    {
      id: '3',
      internId: 'IOCL-123458',
      internName: 'Amit Singh',
      department: 'Human Resources',
      projectTitle: 'Employee Satisfaction Survey Analysis',
      submissionDate: '2025-01-20',
      status: 'Submitted',
      fileUrl: '/reports/employee-satisfaction.pdf',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSubmissionForm(prev => ({ ...prev, file }));
      } else {
        alert('Please select a PDF file only.');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submissionForm.internId && submissionForm.projectTitle && submissionForm.file) {
      alert('Project report submitted successfully!');
      setSubmissionForm({
        internId: '',
        projectTitle: '',
        description: '',
        file: null,
      });
      // Reset file input
      const fileInput = document.getElementById('project-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Under Review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateCompletionCertificate = (submission: ProjectSubmission) => {
    // Send email notification (simulated)
    alert(`Completion certificate has been sent to ${submission.internName}'s email address.`);
    
    // Create a new window for the completion certificate
    const certificateWindow = window.open('', '_blank', 'width=800,height=1000');
    if (certificateWindow) {
      certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Completion Certificate - ${submission.internId}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 0;
              padding: 40px;
              background: white;
              color: #000;
            }
            .certificate-border {
              border: 10px solid #1E40AF;
              border-radius: 15px;
              padding: 40px;
              background: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%);
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              min-height: 900px;
              position: relative;
            }
            .certificate-border::before {
              content: '';
              position: absolute;
              top: 20px;
              left: 20px;
              right: 20px;
              bottom: 20px;
              border: 2px solid #F97316;
              border-radius: 10px;
              pointer-events: none;
            }
            .logo-placeholder {
              width: 100px;
              height: 100px;
              background: linear-gradient(135deg, #1E40AF, #3B82F6);
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 28px;
              box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
            }
            .letterhead {
              text-align: center;
              border-bottom: 4px solid #F97316;
              padding-bottom: 20px;
              margin-bottom: 30px;
              position: relative;
            }
            .company-name {
              font-size: 32px;
              font-weight: bold;
              color: #1E40AF;
              margin-bottom: 5px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
              letter-spacing: 1px;
            }
            .company-subtitle {
              font-size: 20px;
              color: #F97316;
              margin-bottom: 10px;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .certificate-title {
              text-align: center;
              font-size: 28px;
              font-weight: bold;
              color: #1E40AF;
              margin: 30px 0;
              text-decoration: underline;
              text-decoration-color: #F97316;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
              letter-spacing: 1px;
            }
            .recipient {
              text-align: left;
              margin-bottom: 20px;
              font-size: 18px;
            }
            .content {
              text-align: justify;
              margin: 20px 0;
              font-size: 18px;
              line-height: 1.8;
            }
            .details-table {
              width: 100%;
              border-collapse: collapse;
              margin: 30px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .details-table th,
            .details-table td {
              padding: 15px 20px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
              font-size: 16px;
            }
            .details-table th {
              background-color: #1E40AF;
              color: white;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .details-table tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .details-table tr:hover {
              background-color: #e2e8f0;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 80px;
              align-items: end;
            }
            .signature-box {
              text-align: center;
              width: 200px;
            }
            .signature-line {
              border-bottom: 2px solid #1E40AF;
              margin-bottom: 10px;
              height: 60px;
            }
            .date-box {
              text-align: left;
              font-size: 16px;
              font-weight: bold;
            }
            .seal-area {
              width: 120px;
              height: 120px;
              border: 3px dashed #F97316;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              color: #F97316;
              text-align: center;
              font-weight: bold;
              background: rgba(249, 115, 22, 0.05);
            }
            .decorative-element {
              position: absolute;
              width: 50px;
              height: 50px;
              background: linear-gradient(45deg, #F97316, #EA580C);
              border-radius: 50%;
              opacity: 0.1;
            }
            .decorative-element.top-left {
              top: 40px;
              left: 40px;
            }
            .decorative-element.top-right {
              top: 40px;
              right: 40px;
            }
            .decorative-element.bottom-left {
              bottom: 40px;
              left: 40px;
            }
            .decorative-element.bottom-right {
              bottom: 40px;
              right: 40px;
            }
            @media print {
              body { padding: 15px; font-size: 14px; }
              .certificate-border { border-width: 4px; padding: 20px; }
              .details-table th, .details-table td { padding: 10px 15px; font-size: 14px; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-border">
            <div class="decorative-element top-left"></div>
            <div class="decorative-element top-right"></div>
            <div class="decorative-element bottom-left"></div>
            <div class="decorative-element bottom-right"></div>
            
            <div class="letterhead">
              <div class="logo-placeholder">IOCL</div>
              <div class="company-name">INDIAN OIL CORPORATION LIMITED</div>
              <div class="company-subtitle">Pipelines Division, Noida</div>
            </div>
            
            <div class="certificate-title">
              INDUSTRIAL INTERNSHIP COMPLETION CERTIFICATE
            </div>
            
            <div class="recipient">
              <strong>To</strong><br>
              ${submission.internName}'s Institute
            </div>
            
            <div class="content">
              This is to certify that the below student has successfully completed the Industrial 
              Internship Project for the period from <strong>[Start Date]</strong> to 
              <strong>[End Date]</strong> at Indian Oil Corporation Limited, Pipelines Division, Noida.
            </div>
            
            <table class="details-table">
              <tr>
                <th>Particulars</th>
                <th>Details</th>
              </tr>
              <tr>
                <td><strong>Name of the Student</strong></td>
                <td>${submission.internName}</td>
              </tr>
              <tr>
                <td><strong>Intern ID</strong></td>
                <td>${submission.internId}</td>
              </tr>
              <tr>
                <td><strong>Department</strong></td>
                <td>${submission.department}</td>
              </tr>
              <tr>
                <td><strong>Project Title</strong></td>
                <td>${submission.projectTitle}</td>
              </tr>
              <tr>
                <td><strong>Grade</strong></td>
                <td>${submission.grade || 'N/A'}</td>
              </tr>
              <tr>
                <td><strong>Name of the Industry Mentor</strong></td>
                <td>[Auto fetched data]</td>
              </tr>
              <tr>
                <td><strong>Email ID of the Industry Mentor</strong></td>
                <td>[Auto fetched data]</td>
              </tr>
              <tr>
                <td><strong>Contact No of the Industry Mentor</strong></td>
                <td>[Auto fetched data]</td>
              </tr>
              <tr>
                <td><strong>Name of the HR</strong></td>
                <td>[To be filled by HR]</td>
              </tr>
              <tr>
                <td><strong>HR Email ID</strong></td>
                <td>[Auto fetched data]</td>
              </tr>
              <tr>
                <td><strong>HR Contact No</strong></td>
                <td>[Auto fetched data]</td>
              </tr>
            </table>
            
            <div class="content">
              We wish him/her all the best in his/her future endeavors.
            </div>
            
            <div class="signature-section">
              <div class="date-box">
                <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}
              </div>
              <div class="seal-area">
                OFFICIAL<br>SEAL
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div style="font-size: 14px; font-weight: bold;">
                  (Digitally/uploaded signature of<br>L&D section head with designation)
                </div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      certificateWindow.document.close();
    }
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.internId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Upload className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Project Submission</h2>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <p className="text-green-700">
            {user?.role === 'intern' 
              ? 'Submit your project report in PDF format and track the review status. Make sure to follow all submission guidelines.'
              : 'This section allows interns to submit their project reports in PDF format and track the review status. L&D team can manage all submissions here.'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        {user?.role === 'ld_team' && (
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('submit')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'submit'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Submit Project</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Manage Submissions</span>
            </button>
          </div>
        )}

        {/* Intern-only interface */}
        {user?.role === 'intern' && (
          <div className="mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Submit Your Project Report</h3>
              <p className="text-blue-700">
                Upload your completed project report in PDF format. Make sure your report includes all required sections and follows the project guidelines.
              </p>
            </div>
          </div>
        )}

        {/* Submit Project Tab */}
        {(activeTab === 'submit' || user?.role === 'intern') && (
          <div className="space-y-6">
            {user?.role === 'ld_team' && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Submit Project Report</h3>
                <p className="text-blue-700">
                  Upload your completed project report in PDF format. Make sure your report includes all required sections and follows the project guidelines.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Intern ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={user?.role === 'intern' ? user.empId : submissionForm.internId}
                    onChange={(e) => setSubmissionForm(prev => ({ ...prev, internId: e.target.value }))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      user?.role === 'intern' ? 'bg-gray-100' : ''
                    }`}
                    placeholder="Enter your Intern ID"
                    disabled={user?.role === 'intern'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={submissionForm.projectTitle}
                    onChange={(e) => setSubmissionForm(prev => ({ ...prev, projectTitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter project title"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <textarea
                  value={submissionForm.description}
                  onChange={(e) => setSubmissionForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of your project (optional)"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Report (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="project-file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="project-file"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF files only, up to 10MB</p>
                    {submissionForm.file && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {submissionForm.file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Upload className="h-4 w-4" />
                  <span>Submit Project Report</span>
                </button>
              </div>
            </form>

            {/* Guidelines */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-800 mb-2">Submission Guidelines</h4>
              <ul className="text-yellow-700 space-y-1 text-sm">
                <li>• Project report must be in PDF format only</li>
                <li>• Maximum file size: 10MB</li>
                <li>• Report should include: Abstract, Introduction, Methodology, Results, Conclusion</li>
                <li>• Ensure all references and citations are properly formatted</li>
                <li>• Include acknowledgments section mentioning your mentor</li>
                <li>• Submit only the final version of your report</li>
              </ul>
            </div>
          </div>
        )}

        {/* Manage Submissions Tab */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Project Submissions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search submissions..."
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredSubmissions.map(submission => (
                <div key={submission.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{submission.projectTitle}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span>{submission.status}</span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Intern:</strong> {submission.internName}</p>
                          <p><strong>ID:</strong> {submission.internId}</p>
                        </div>
                        <div>
                          <p><strong>Department:</strong> {submission.department}</p>
                          <p><strong>Submitted:</strong> {submission.submissionDate}</p>
                        </div>
                        <div>
                          {submission.grade && (
                            <p><strong>Grade:</strong> {submission.grade}</p>
                          )}
                        </div>
                      </div>
                      {submission.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Feedback:</strong> {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                      {submission.status === 'Approved' && (
                        <button
                          onClick={() => generateCompletionCertificate(submission)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Send Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No project submissions found matching your criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSubmission;
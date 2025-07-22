import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Intern, Mentor, Application, Assignment, Task, Project } from './models';
import DatabaseConnection from './config/database';
import { logger } from './config/logger';

async function main() {
  console.log('🌱 Starting database seed...');

  // Connect to database
  await DatabaseConnection.connect();

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Intern.deleteMany({}),
    Mentor.deleteMany({}),
    Application.deleteMany({}),
    Assignment.deleteMany({}),
    Task.deleteMany({}),
    Project.deleteMany({}),
  ]);

  // Create default users
  const users = [
    // Admin users (L&D Team)
    {
      username: 'IOCLAdmin',
      password: 'Adm1n@IOCL2025',
      role: 'ADMIN' as const,
      empId: 'IOCLAdmin',
      name: 'Dr. Suresh Gupta',
      email: 'suresh.gupta@iocl.in',
      department: 'Learning & Development',
    },
    {
      username: 'L&DAdmin',
      password: 'Adm1n@IOCL2025',
      role: 'ADMIN' as const,
      empId: 'L&DAdmin',
      name: 'Ms. Kavita Singh',
      email: 'kavita.singh@iocl.in',
      department: 'Learning & Development',
    },
    {
      username: 'AdminLD',
      password: 'Adm1n@IOCL2025',
      role: 'ADMIN' as const,
      empId: 'AdminLD',
      name: 'Mr. Vikram Mehta',
      email: 'vikram.mehta@iocl.in',
      department: 'Learning & Development',
    },

    // Employee users
    {
      username: 'EMP001',
      password: 'password123',
      role: 'EMPLOYEE' as const,
      empId: 'EMP001',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@iocl.in',
      department: 'Engineering',
    },
    {
      username: 'EMP002',
      password: 'password123',
      role: 'EMPLOYEE' as const,
      empId: 'EMP002',
      name: 'Priya Sharma',
      email: 'priya.sharma@iocl.in',
      department: 'Human Resources',
    },
    {
      username: 'EMP003',
      password: 'password123',
      role: 'EMPLOYEE' as const,
      empId: 'EMP003',
      name: 'Amit Patel',
      email: 'amit.patel@iocl.in',
      department: 'Information Technology',
    },

    // Intern users
    {
      username: 'IOCL-123456',
      password: 'intern123',
      role: 'INTERN' as const,
      empId: 'IOCL-123456',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@college.edu',
      department: 'Engineering',
    },
    {
      username: 'IOCL-123457',
      password: 'intern123',
      role: 'INTERN' as const,
      empId: 'IOCL-123457',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      department: 'Information Technology',
    },
    {
      username: 'IOCL-123458',
      password: 'intern123',
      role: 'INTERN' as const,
      empId: 'IOCL-123458',
      name: 'Amit Singh',
      email: 'amit.singh@college.edu',
      department: 'Human Resources',
    },
  ];

  // Create users
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
  }

  console.log('✅ Users created');

  // Create mentors
  const mentors = [
    {
      empId: 'MENTOR001',
      name: 'Dr. Rajesh Kumar',
      department: 'Engineering',
      email: 'rajesh.kumar@iocl.in',
      phone: '9876543210',
      experience: '15 years',
      maxCapacity: 4,
    },
    {
      empId: 'MENTOR002',
      name: 'Ms. Priya Sharma',
      department: 'Human Resources',
      email: 'priya.sharma@iocl.in',
      phone: '9876543211',
      experience: '12 years',
      maxCapacity: 3,
    },
    {
      empId: 'MENTOR003',
      name: 'Mr. Amit Patel',
      department: 'Information Technology',
      email: 'amit.patel@iocl.in',
      phone: '9876543212',
      experience: '10 years',
      maxCapacity: 5,
    },
    {
      empId: 'MENTOR004',
      name: 'Dr. Sunita Verma',
      department: 'Engineering',
      email: 'sunita.verma@iocl.in',
      phone: '9876543213',
      experience: '18 years',
      maxCapacity: 3,
    },
    {
      empId: 'MENTOR005',
      name: 'Mr. Vikram Singh',
      department: 'Information Technology',
      email: 'vikram.singh@iocl.in',
      phone: '9876543214',
      experience: '8 years',
      maxCapacity: 4,
    },
  ];

  for (const mentorData of mentors) {
    const mentor = new Mentor(mentorData);
    await mentor.save();
  }

  console.log('✅ Mentors created');

  // Create sample interns
  const interns = [
    {
      internId: 'IOCL-123456',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@college.edu',
      phone: '9876543210',
      institute: 'IIT Delhi',
      course: 'B.Tech Computer Science',
      semester: '6th',
      rollNumber: 'CS2021001',
      department: 'Engineering',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-03-15'),
      address: 'New Delhi',
      referredBy: 'Rajesh Kumar',
      referredByEmpId: 'EMP001',
      status: 'APPROVED' as const,
      documents: {
        photo: 'photo.jpg',
        resume: 'resume.pdf',
        collegeId: 'college_id.pdf',
        lastSemesterResult: 'result.pdf',
        noc: 'noc.pdf',
        idProof: 'aadhar.pdf',
      },
    },
    {
      internId: 'IOCL-123457',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      phone: '9876543211',
      institute: 'NIT Surat',
      course: 'B.Tech Information Technology',
      semester: '7th',
      rollNumber: 'IT2020045',
      department: 'Information Technology',
      startDate: new Date('2025-01-20'),
      endDate: new Date('2025-03-20'),
      address: 'Surat, Gujarat',
      referredBy: 'Priya Sharma',
      referredByEmpId: 'EMP002',
      status: 'APPROVED' as const,
      documents: {
        photo: 'photo.jpg',
        resume: 'resume.pdf',
        collegeId: 'college_id.pdf',
        lastSemesterResult: 'result.pdf',
        idProof: 'pan.pdf',
      },
    },
    {
      internId: 'IOCL-123458',
      name: 'Amit Singh',
      email: 'amit.singh@college.edu',
      phone: '9876543212',
      institute: 'Delhi University',
      course: 'MBA Human Resources',
      semester: '3rd',
      rollNumber: 'MBA2023012',
      department: 'Human Resources',
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-04-01'),
      address: 'Delhi',
      referredBy: 'Amit Patel',
      referredByEmpId: 'EMP003',
      status: 'APPROVED' as const,
      documents: {
        photo: 'photo.jpg',
        resume: 'resume.pdf',
        collegeId: 'college_id.pdf',
        lastSemesterResult: 'result.pdf',
        noc: 'noc.pdf',
        idProof: 'aadhar.pdf',
        otherDocument: 'recommendation.pdf',
      },
    },
  ];

  const createdInterns = [];
  for (const internData of interns) {
    const intern = new Intern(internData);
    await intern.save();
    createdInterns.push(intern);
  }

  console.log('✅ Interns created');

  // Create applications for interns
  for (const intern of createdInterns) {
    const application = new Application({
      internId: intern._id,
      status: 'APPROVED',
    });
    await application.save();
  }

  console.log('✅ Applications created');

  // Create mentor assignments
  const assignments = [
    { internId: 'IOCL-123456', mentorEmpId: 'MENTOR001', department: 'Engineering' },
    { internId: 'IOCL-123457', mentorEmpId: 'MENTOR003', department: 'Information Technology' },
    { internId: 'IOCL-123458', mentorEmpId: 'MENTOR002', department: 'Human Resources' },
  ];

  for (const assignment of assignments) {
    const intern = await Intern.findOne({ internId: assignment.internId });
    const mentor = await Mentor.findOne({ empId: assignment.mentorEmpId });

    if (intern && mentor) {
      const newAssignment = new Assignment({
        internId: intern._id,
        mentorId: mentor._id,
        department: assignment.department,
      });
      await newAssignment.save();

      // Update mentor's current intern count
      await Mentor.findByIdAndUpdate(mentor._id, {
        $inc: { currentInterns: 1 },
      });
    }
  }

  console.log('✅ Assignments created');

  // Create sample tasks
  const tasks = [
    {
      internId: 'IOCL-123456',
      mentorEmpId: 'MENTOR001',
      title: 'Pipeline Safety Analysis',
      description: 'Analyze safety protocols for oil pipeline systems',
      dueDate: new Date('2025-01-25'),
      priority: 'HIGH' as const,
    },
    {
      internId: 'IOCL-123457',
      mentorEmpId: 'MENTOR003',
      title: 'Database Optimization',
      description: 'Optimize database queries for better performance',
      dueDate: new Date('2025-01-28'),
      priority: 'MEDIUM' as const,
    },
  ];

  for (const taskData of tasks) {
    const intern = await Intern.findOne({ internId: taskData.internId });
    const mentor = await Mentor.findOne({ empId: taskData.mentorEmpId });

    if (intern && mentor) {
      const task = new Task({
        internId: intern._id,
        mentorId: mentor._id,
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
      });
      await task.save();
    }
  }

  console.log('✅ Tasks created');

  // Create sample projects
  const projects = [
    {
      internId: 'IOCL-123456',
      mentorEmpId: 'MENTOR001',
      title: 'Pipeline Safety Analysis System',
      description: 'Comprehensive analysis of pipeline safety protocols with recommendations for improvement',
      status: 'SUBMITTED' as const,
    },
  ];

  for (const projectData of projects) {
    const intern = await Intern.findOne({ internId: projectData.internId });
    const mentor = await Mentor.findOne({ empId: projectData.mentorEmpId });

    if (intern && mentor) {
      const project = new Project({
        internId: intern._id,
        mentorId: mentor._id,
        title: projectData.title,
        description: projectData.description,
        status: projectData.status,
      });
      await project.save();
    }
  }

  console.log('✅ Projects created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await DatabaseConnection.disconnect();
  });
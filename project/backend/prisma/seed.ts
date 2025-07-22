import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BCRYPT_ROUNDS } from '../src/config/env';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

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
    const hashedPassword = await bcrypt.hash(userData.password, BCRYPT_ROUNDS);
    
    await prisma.user.upsert({
      where: { username: userData.username },
      update: {},
      create: {
        ...userData,
        password: hashedPassword,
      },
    });
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
    await prisma.mentor.upsert({
      where: { empId: mentorData.empId },
      update: {},
      create: mentorData,
    });
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

  for (const internData of interns) {
    await prisma.intern.upsert({
      where: { internId: internData.internId },
      update: {},
      create: internData,
    });
  }

  console.log('✅ Interns created');

  // Create applications for interns
  const internRecords = await prisma.intern.findMany();
  for (const intern of internRecords) {
    await prisma.application.upsert({
      where: { internId: intern.id },
      update: {},
      create: {
        internId: intern.id,
        status: 'APPROVED',
      },
    });
  }

  console.log('✅ Applications created');

  // Create mentor assignments
  const assignments = [
    { internId: 'IOCL-123456', mentorEmpId: 'MENTOR001', department: 'Engineering' },
    { internId: 'IOCL-123457', mentorEmpId: 'MENTOR003', department: 'Information Technology' },
    { internId: 'IOCL-123458', mentorEmpId: 'MENTOR002', department: 'Human Resources' },
  ];

  for (const assignment of assignments) {
    const intern = await prisma.intern.findUnique({
      where: { internId: assignment.internId },
    });
    
    const mentor = await prisma.mentor.findUnique({
      where: { empId: assignment.mentorEmpId },
    });

    if (intern && mentor) {
      await prisma.assignment.upsert({
        where: {
          internId_mentorId: {
            internId: intern.id,
            mentorId: mentor.id,
          },
        },
        update: {},
        create: {
          internId: intern.id,
          mentorId: mentor.id,
          department: assignment.department,
        },
      });

      // Update mentor's current intern count
      await prisma.mentor.update({
        where: { id: mentor.id },
        data: {
          currentInterns: {
            increment: 1,
          },
        },
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
    const intern = await prisma.intern.findUnique({
      where: { internId: taskData.internId },
    });
    
    const mentor = await prisma.mentor.findUnique({
      where: { empId: taskData.mentorEmpId },
    });

    if (intern && mentor) {
      await prisma.task.create({
        data: {
          internId: intern.id,
          mentorId: mentor.id,
          title: taskData.title,
          description: taskData.description,
          dueDate: taskData.dueDate,
          priority: taskData.priority,
        },
      });
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
    const intern = await prisma.intern.findUnique({
      where: { internId: projectData.internId },
    });
    
    const mentor = await prisma.mentor.findUnique({
      where: { empId: projectData.mentorEmpId },
    });

    if (intern && mentor) {
      await prisma.project.create({
        data: {
          internId: intern.id,
          mentorId: mentor.id,
          title: projectData.title,
          description: projectData.description,
          status: projectData.status,
        },
      });
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
    await prisma.$disconnect();
  });
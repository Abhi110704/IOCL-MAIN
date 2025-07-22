// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateEmpId = (empId: string, role: string): boolean => {
  switch (role) {
    case 'employee':
      return /^EMP\d{3}$/.test(empId);
    case 'ld_team':
      return /^(IOCLAdmin|L&DAdmin|AdminLD)$/.test(empId);
    case 'mentor':
      return /^MENTOR\d{3}$/.test(empId);
    case 'intern':
      return /^IOCL-\d{6}$/.test(empId);
    default:
      return false;
  }
};

export const validateFileSize = (file: File, maxSize: number = 10 * 1024 * 1024): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end > start;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

export const validateNumericRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Form validation schemas
export const applicationValidationSchema = {
  fullName: (value: string) => validateRequired(value) && validateMinLength(value, 2),
  email: (value: string) => validateRequired(value) && validateEmail(value),
  phone: (value: string) => validateRequired(value) && validatePhone(value),
  collegeName: (value: string) => validateRequired(value) && validateMinLength(value, 3),
  course: (value: string) => validateRequired(value) && validateMinLength(value, 3),
  semester: (value: string) => validateRequired(value),
  rollNumber: (value: string) => validateRequired(value) && validateMinLength(value, 3),
  department: (value: string) => validateRequired(value),
  startDate: (value: string) => validateRequired(value),
  endDate: (value: string, startDate: string) => validateRequired(value) && validateDateRange(startDate, value),
  address: (value: string) => validateRequired(value) && validateMinLength(value, 10),
};

export const mentorValidationSchema = {
  name: (value: string) => validateRequired(value) && validateMinLength(value, 2),
  email: (value: string) => validateRequired(value) && validateEmail(value),
  phone: (value: string) => validatePhone(value),
  department: (value: string) => validateRequired(value),
  experience: (value: string) => validateRequired(value),
  maxCapacity: (value: number) => validateNumericRange(value, 1, 10),
};

export const taskValidationSchema = {
  title: (value: string) => validateRequired(value) && validateMinLength(value, 3),
  description: (value: string) => validateRequired(value) && validateMinLength(value, 10),
  dueDate: (value: string) => validateRequired(value),
  internId: (value: string) => validateRequired(value),
};

export const projectValidationSchema = {
  title: (value: string) => validateRequired(value) && validateMinLength(value, 5),
  description: (value: string) => validateMinLength(value, 20),
  internId: (value: string) => validateRequired(value),
};
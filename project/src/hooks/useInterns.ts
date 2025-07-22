import { useState, useEffect } from 'react';
import { internAPI, InternApplication } from '../utils/api';

export const useInterns = (filters?: { status?: string; department?: string }) => {
  const [applications, setApplications] = useState<InternApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await internAPI.getApplications(filters);
      
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        setError(response.error || 'Failed to fetch applications');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filters?.status, filters?.department]);

  const createApplication = async (applicationData: Partial<InternApplication>): Promise<boolean> => {
    try {
      const response = await internAPI.createApplication(applicationData);
      
      if (response.success) {
        await fetchApplications(); // Refresh the list
        return true;
      } else {
        setError(response.error || 'Failed to create application');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create application');
      return false;
    }
  };

  const updateApplicationStatus = async (id: string, status: string, mentorId?: string): Promise<boolean> => {
    try {
      const response = await internAPI.updateApplicationStatus(id, status, mentorId);
      
      if (response.success) {
        await fetchApplications(); // Refresh the list
        return true;
      } else {
        setError(response.error || 'Failed to update application');
        return false;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update application');
      return false;
    }
  };

  return {
    applications,
    isLoading,
    error,
    createApplication,
    updateApplicationStatus,
    refetch: fetchApplications,
  };
};
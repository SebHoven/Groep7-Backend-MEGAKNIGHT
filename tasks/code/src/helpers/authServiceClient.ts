// Helper to fetch students from auth-service
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3015';

interface StudentResponse {
  success: boolean;
  data: any;
}

export async function getStudentsByIds(studentIds: number[]): Promise<any[]> {
  if (!studentIds || studentIds.length === 0) return [];
  
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/students?ids=${studentIds.join(',')}`);
    if (!response.ok) {
      throw new Error(`Auth service responded with ${response.status}`);
    }
    const result: StudentResponse = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching students from auth-service:', error);
    return [];
  }
}

export async function getStudentById(studentId: number): Promise<any | null> {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/students/${studentId}`);
    if (!response.ok) {
      throw new Error(`Auth service responded with ${response.status}`);
    }
    const result: StudentResponse = await response.json();
    return result.data || null;
  } catch (error) {
    console.error('Error fetching student from auth-service:', error);
    return null;
  }
}

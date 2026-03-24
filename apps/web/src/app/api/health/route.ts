import { NextResponse } from 'next/server';
import { globalStore } from '../courses/route';

// GET /api/health — health check & system status
export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    service: 'CertChain API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    stats: {
      totalCourses: globalStore.__courses?.length || 0,
      totalCertificates: globalStore.__certificates?.length || 0,
      totalEnrollments: Array.from(globalStore.__enrollments?.values() || []).reduce(
        (sum, set) => sum + set.size, 0
      ),
    },
    endpoints: {
      'GET  /api/health': 'System health check',
      'GET  /api/courses': 'List all courses',
      'POST /api/courses': 'Create a new course',
      'GET  /api/courses/:id': 'Get course by ID',
      'POST /api/students/enroll': 'Enroll in a course',
      'GET  /api/students/enroll?studentAddress=': 'Get enrolled courses',
      'POST /api/students/complete-module': 'Complete a module',
      'GET  /api/students/complete-module?studentAddress=&courseId=': 'Get module progress',
      'POST /api/students/quiz': 'Submit quiz answers',
      'POST /api/certificates/mint': 'Mint certificate NFT',
      'GET  /api/certificates/mint': 'List all certificates',
      'GET  /api/certificates/mint?studentAddress=': 'Get student certificates',
    },
  });
}

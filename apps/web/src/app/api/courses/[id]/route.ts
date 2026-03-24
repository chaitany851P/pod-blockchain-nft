import { NextResponse } from 'next/server';
import { globalStore } from '../route';

// GET /api/courses/[id] — get a specific course
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const courseId = parseInt(params.id);
  
  if (isNaN(courseId)) {
    return NextResponse.json({ success: false, error: 'Invalid course ID' }, { status: 400 });
  }

  const course = globalStore.__courses?.find((c) => c.id === courseId);
  
  if (!course) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: course });
}

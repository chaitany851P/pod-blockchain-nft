import { NextResponse } from 'next/server';
import { globalStore } from '../../courses/route';

// POST /api/students/enroll — enroll a student in a course
// Body: { studentAddress: string, courseId: number }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentAddress, courseId } = body;

    if (!studentAddress || courseId === undefined) {
      return NextResponse.json(
        { success: false, error: 'studentAddress and courseId are required' },
        { status: 400 }
      );
    }

    const course = globalStore.__courses?.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, error: `Course with id ${courseId} not found` },
        { status: 404 }
      );
    }

    // Get or create enrollments for this student
    if (!globalStore.__enrollments!.has(studentAddress)) {
      globalStore.__enrollments!.set(studentAddress, new Set());
    }

    const studentEnrollments = globalStore.__enrollments!.get(studentAddress)!;

    if (studentEnrollments.has(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Student is already enrolled in this course' },
        { status: 409 }
      );
    }

    studentEnrollments.add(courseId);
    course.enrolledCount += 1;

    // Initialize module progress
    if (!globalStore.__moduleProgress!.has(studentAddress)) {
      globalStore.__moduleProgress!.set(studentAddress, new Map());
    }
    globalStore.__moduleProgress!.get(studentAddress)!.set(courseId, new Set());

    return NextResponse.json({
      success: true,
      message: `Student ${studentAddress} enrolled in "${course.title}"`,
      data: {
        studentAddress,
        courseId,
        courseName: course.title,
        enrolledAt: new Date().toISOString(),
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

// GET /api/students/enroll?studentAddress=0x... — get enrolled courses for a student
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentAddress = searchParams.get('studentAddress');

  if (!studentAddress) {
    return NextResponse.json(
      { success: false, error: 'studentAddress query param is required' },
      { status: 400 }
    );
  }

  const enrolledIds = globalStore.__enrollments!.get(studentAddress);
  if (!enrolledIds || enrolledIds.size === 0) {
    return NextResponse.json({
      success: true,
      data: [],
      message: 'No enrollments found',
    });
  }

  const enrolledCourses = globalStore.__courses!.filter((c) =>
    enrolledIds.has(c.id)
  );

  return NextResponse.json({
    success: true,
    data: enrolledCourses.map((c) => ({
      courseId: c.id,
      title: c.title,
      category: c.category,
      difficulty: c.difficulty,
      totalModules: c.modules.length,
    })),
    total: enrolledCourses.length,
  });
}

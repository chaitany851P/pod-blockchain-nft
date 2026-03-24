import { NextResponse } from 'next/server';
import { globalStore } from '../../courses/route';

// POST /api/students/complete-module — mark a module as complete
// Body: { studentAddress: string, courseId: number, moduleId: number }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentAddress, courseId, moduleId } = body;

    if (!studentAddress || courseId === undefined || moduleId === undefined) {
      return NextResponse.json(
        { success: false, error: 'studentAddress, courseId, and moduleId are required' },
        { status: 400 }
      );
    }

    // Check enrollment
    const enrollments = globalStore.__enrollments!.get(studentAddress);
    if (!enrollments || !enrollments.has(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Student is not enrolled in this course' },
        { status: 403 }
      );
    }

    const course = globalStore.__courses!.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    const moduleExists = course.modules.find((m) => m.id === moduleId);
    if (!moduleExists) {
      return NextResponse.json(
        { success: false, error: `Module ${moduleId} not found in course ${courseId}` },
        { status: 404 }
      );
    }

    // Get progress
    if (!globalStore.__moduleProgress!.has(studentAddress)) {
      globalStore.__moduleProgress!.set(studentAddress, new Map());
    }
    const studentProgress = globalStore.__moduleProgress!.get(studentAddress)!;
    if (!studentProgress.has(courseId)) {
      studentProgress.set(courseId, new Set());
    }

    const completedModules = studentProgress.get(courseId)!;

    if (completedModules.has(moduleId)) {
      return NextResponse.json(
        { success: false, error: 'Module already completed' },
        { status: 409 }
      );
    }

    completedModules.add(moduleId);

    const totalModules = course.modules.length;
    const completedCount = completedModules.size;
    const progress = Math.round((completedCount / totalModules) * 100);
    const allComplete = completedCount === totalModules;

    return NextResponse.json({
      success: true,
      message: `Module "${moduleExists.title}" marked as complete`,
      data: {
        studentAddress,
        courseId,
        moduleId,
        moduleTitle: moduleExists.title,
        completedModules: completedCount,
        totalModules,
        progress: `${progress}%`,
        allModulesComplete: allComplete,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

// GET /api/students/complete-module?studentAddress=0x...&courseId=0 — get module progress
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentAddress = searchParams.get('studentAddress');
  const courseIdStr = searchParams.get('courseId');

  if (!studentAddress || !courseIdStr) {
    return NextResponse.json(
      { success: false, error: 'studentAddress and courseId query params are required' },
      { status: 400 }
    );
  }

  const courseId = parseInt(courseIdStr);
  const course = globalStore.__courses!.find((c) => c.id === courseId);
  if (!course) {
    return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
  }

  const completedModules = globalStore.__moduleProgress!.get(studentAddress)?.get(courseId);
  const completedIds = completedModules ? Array.from(completedModules) : [];

  return NextResponse.json({
    success: true,
    data: {
      studentAddress,
      courseId,
      courseName: course.title,
      totalModules: course.modules.length,
      completedModules: completedIds.length,
      completedModuleIds: completedIds,
      progress: `${Math.round((completedIds.length / course.modules.length) * 100)}%`,
      allModulesComplete: completedIds.length === course.modules.length,
      modules: course.modules.map((m) => ({
        id: m.id,
        title: m.title,
        completed: completedIds.includes(m.id),
      })),
    },
  });
}

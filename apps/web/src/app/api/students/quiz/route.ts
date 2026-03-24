import { NextResponse } from 'next/server';
import { globalStore } from '../../courses/route';

// POST /api/students/quiz — submit quiz answers
// Body: { studentAddress: string, courseId: number, answers: Record<number, number> }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentAddress, courseId, answers } = body;

    if (!studentAddress || courseId === undefined || !answers) {
      return NextResponse.json(
        { success: false, error: 'studentAddress, courseId, and answers are required' },
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

    // Check all modules complete
    const completedModules = globalStore.__moduleProgress!.get(studentAddress)?.get(courseId);
    const course = globalStore.__courses!.find((c) => c.id === courseId);

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
    }

    if (!completedModules || completedModules.size < course.modules.length) {
      return NextResponse.json(
        {
          success: false,
          error: 'All modules must be completed before taking the quiz',
          data: {
            completedModules: completedModules?.size || 0,
            totalModules: course.modules.length,
          },
        },
        { status: 403 }
      );
    }

    // Check all quiz answers are provided
    if (Object.keys(answers).length < course.quizzes.length) {
      return NextResponse.json(
        {
          success: false,
          error: `All ${course.quizzes.length} questions must be answered. Got ${Object.keys(answers).length}.`,
        },
        { status: 400 }
      );
    }

    // Grade the quiz
    let correct = 0;
    const details: Array<{
      questionId: number;
      question: string;
      yourAnswer: number;
      correctAnswer: number;
      isCorrect: boolean;
    }> = [];

    course.quizzes.forEach((q) => {
      const studentAnswer = answers[q.id];
      const isCorrect = studentAnswer === q.correctIndex;
      if (isCorrect) correct++;
      details.push({
        questionId: q.id,
        question: q.question,
        yourAnswer: studentAnswer,
        correctAnswer: q.correctIndex,
        isCorrect,
      });
    });

    const score = Math.round((correct / course.quizzes.length) * 100);
    const passed = score >= 60;

    // Store quiz score
    if (!globalStore.__quizScores!.has(studentAddress)) {
      globalStore.__quizScores!.set(studentAddress, new Map());
    }
    globalStore.__quizScores!.get(studentAddress)!.set(courseId, score);

    return NextResponse.json({
      success: true,
      message: passed
        ? `🎉 Passed! Score: ${score}%. You can now mint your certificate.`
        : `Score: ${score}%. You need at least 60% to pass. Try again!`,
      data: {
        studentAddress,
        courseId,
        courseName: course.title,
        score: `${score}%`,
        correctAnswers: correct,
        totalQuestions: course.quizzes.length,
        passed,
        canMintCertificate: passed,
        details,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

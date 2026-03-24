import { NextResponse } from 'next/server';
import { globalStore } from '../../courses/route';

// POST /api/certificates/mint — mint a certificate NFT
// Body: { studentAddress: string, courseId: number, studentName: string }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentAddress, courseId, studentName } = body;

    if (!studentAddress || courseId === undefined || !studentName) {
      return NextResponse.json(
        { success: false, error: 'studentAddress, courseId, and studentName are required' },
        { status: 400 }
      );
    }

    // Validate course
    const course = globalStore.__courses!.find((c) => c.id === courseId);
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
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
    if (!completedModules || completedModules.size < course.modules.length) {
      return NextResponse.json(
        { success: false, error: 'All modules must be completed before minting' },
        { status: 403 }
      );
    }

    // Check quiz passed
    const quizScore = globalStore.__quizScores!.get(studentAddress)?.get(courseId);
    if (quizScore === undefined || quizScore < 60) {
      return NextResponse.json(
        {
          success: false,
          error: 'Quiz must be passed with at least 60% before minting',
          data: { currentScore: quizScore !== undefined ? `${quizScore}%` : 'Not taken' },
        },
        { status: 403 }
      );
    }

    // Check not already minted
    const existingCert = globalStore.__certificates!.find(
      (c) => c.studentAddress === studentAddress && c.courseId === courseId
    );
    if (existingCert) {
      return NextResponse.json(
        {
          success: false,
          error: 'Certificate already minted for this course',
          data: { existingTokenId: existingCert.tokenId, txHash: existingCert.txHash },
        },
        { status: 409 }
      );
    }

    // Mint certificate
    const tokenId = globalStore.__nextTokenId!;
    globalStore.__nextTokenId! += 1;

    const txHash = '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const certificate = {
      tokenId,
      courseId,
      courseName: course.title,
      studentName: studentName.trim(),
      studentAddress,
      completionDate: new Date().toISOString(),
      skills: course.skills,
      totalModules: course.modules.length,
      quizScore,
      txHash,
    };

    globalStore.__certificates!.push(certificate);
    course.completedCount += 1;

    return NextResponse.json({
      success: true,
      message: `🎓 Certificate NFT minted successfully! Token ID: #${tokenId}`,
      data: {
        ...certificate,
        type: 'Soulbound (Non-Transferable)',
        blockchain: 'Arbitrum',
      },
    }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

// GET /api/certificates/mint — get all certificates (optionally filter by student)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentAddress = searchParams.get('studentAddress');

  let certs = globalStore.__certificates!;

  if (studentAddress) {
    certs = certs.filter((c) => c.studentAddress === studentAddress);
  }

  return NextResponse.json({
    success: true,
    data: certs,
    total: certs.length,
  });
}

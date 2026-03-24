import { NextResponse } from 'next/server';

// ─── In-Memory Data Store ────────────────────────────────
// This simulates a database for demo/testing purposes

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: 'video' | 'reading' | 'lab' | 'project';
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  instructorTitle: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  modules: Module[];
  quizzes: Quiz[];
  enrolledCount: number;
  completedCount: number;
  rating: number;
  duration: string;
}

// Shared in-memory store
const globalStore = globalThis as unknown as {
  __courses?: Course[];
  __enrollments?: Map<string, Set<number>>;
  __moduleProgress?: Map<string, Map<number, Set<number>>>;
  __quizScores?: Map<string, Map<number, number>>;
  __certificates?: Array<{
    tokenId: number;
    courseId: number;
    courseName: string;
    studentName: string;
    studentAddress: string;
    completionDate: string;
    skills: string[];
    totalModules: number;
    quizScore: number;
    txHash: string;
  }>;
  __nextTokenId?: number;
};

if (!globalStore.__courses) {
  globalStore.__courses = [
    {
      id: 0,
      title: 'Blockchain Fundamentals',
      description: 'Master the core concepts of blockchain technology, from cryptographic hashing to consensus mechanisms.',
      instructor: 'Dr. Satoshi Nakamura',
      instructorTitle: 'Lead Researcher, MIT Digital Currency Initiative',
      category: 'Blockchain',
      difficulty: 'Beginner',
      skills: ['Cryptography', 'Consensus', 'Distributed Ledger', 'Hashing', 'P2P Networks'],
      modules: [
        { id: 0, title: 'Introduction to Blockchain', description: 'What is blockchain? History, evolution, and why it matters.', duration: '45 min', type: 'video' },
        { id: 1, title: 'Cryptographic Foundations', description: 'SHA-256 hashing, public-key cryptography, and digital signatures.', duration: '60 min', type: 'reading' },
        { id: 2, title: 'Consensus Mechanisms', description: 'Proof of Work, Proof of Stake, and alternative consensus algorithms.', duration: '55 min', type: 'video' },
        { id: 3, title: 'Blockchain Architecture', description: 'Blocks, chains, Merkle trees, and network topology.', duration: '50 min', type: 'lab' },
        { id: 4, title: 'Real-World Applications', description: 'DeFi, supply chain, healthcare, and governance use cases.', duration: '40 min', type: 'project' },
      ],
      quizzes: [
        { id: 0, question: 'What is the primary purpose of a hash function in blockchain?', options: ['Encrypt data for privacy', 'Create a fixed-size fingerprint of data', 'Store large files on-chain', 'Generate random numbers'], correctIndex: 1 },
        { id: 1, question: 'Which consensus mechanism does Ethereum currently use?', options: ['Proof of Work', 'Proof of Stake', 'Delegated Proof of Stake', 'Proof of Authority'], correctIndex: 1 },
        { id: 2, question: 'What makes a blockchain immutable?', options: ['Government regulation', 'Each block references the previous hash', 'Files are stored in the cloud', 'Passwords protect each block'], correctIndex: 1 },
      ],
      enrolledCount: 2847,
      completedCount: 1892,
      rating: 4.9,
      duration: '4.2 hours',
    },
    {
      id: 1,
      title: 'Smart Contract Development',
      description: 'Learn to write, test, and deploy Solidity smart contracts on Ethereum.',
      instructor: 'Elena Vitalova',
      instructorTitle: 'Senior Smart Contract Engineer, OpenZeppelin',
      category: 'Development',
      difficulty: 'Intermediate',
      skills: ['Solidity', 'EVM', 'Smart Contracts', 'Testing', 'Security Auditing'],
      modules: [
        { id: 0, title: 'Solidity Basics', description: 'Variables, functions, modifiers, and data types.', duration: '60 min', type: 'video' },
        { id: 1, title: 'Contract Architecture', description: 'Inheritance, interfaces, libraries, and interactions.', duration: '70 min', type: 'reading' },
        { id: 2, title: 'Token Standards', description: 'ERC-20, ERC-721, ERC-1155 token contracts.', duration: '65 min', type: 'lab' },
        { id: 3, title: 'Testing & Debugging', description: 'Hardhat, Foundry, unit tests, debugging.', duration: '55 min', type: 'lab' },
        { id: 4, title: 'Security Best Practices', description: 'Reentrancy, overflow, access control, audit patterns.', duration: '60 min', type: 'video' },
        { id: 5, title: 'Deployment & Verification', description: 'Deploying to testnets and mainnet.', duration: '45 min', type: 'project' },
      ],
      quizzes: [
        { id: 0, question: 'What is "msg.sender" in Solidity?', options: ['The contract address', 'The address calling the function', 'The block miner', 'A random address'], correctIndex: 1 },
        { id: 1, question: 'What does the "view" modifier indicate?', options: ['Function modifies state', 'Function only reads state', 'Function is payable', 'Function is private'], correctIndex: 1 },
        { id: 2, question: 'What is a reentrancy attack?', options: ['Calling a function too many times', 'When a contract calls back into the calling contract before the first call finishes', 'A type of front-running', 'Overflowing a uint256'], correctIndex: 1 },
      ],
      enrolledCount: 1983,
      completedCount: 821,
      rating: 4.8,
      duration: '5.9 hours',
    },
    {
      id: 2,
      title: 'DeFi Protocol Design',
      description: 'Deep dive into Decentralized Finance protocol architecture.',
      instructor: 'Andre DeFi',
      instructorTitle: 'Founder, Yield Protocol',
      category: 'DeFi',
      difficulty: 'Advanced',
      skills: ['AMM Design', 'Yield Farming', 'Liquidity Pools', 'Governance', 'Tokenomics'],
      modules: [
        { id: 0, title: 'DeFi Landscape', description: 'Overview of the DeFi ecosystem, TVL, and major protocols.', duration: '50 min', type: 'video' },
        { id: 1, title: 'Automated Market Makers', description: 'Uniswap v2/v3, constant product formula, impermanent loss.', duration: '75 min', type: 'reading' },
        { id: 2, title: 'Lending & Borrowing', description: 'Aave, Compound — interest rate models and liquidation.', duration: '70 min', type: 'lab' },
        { id: 3, title: 'Yield Strategies', description: 'Yield farming, vaults, auto-compounding.', duration: '65 min', type: 'video' },
        { id: 4, title: 'Governance & DAOs', description: 'On-chain voting, delegation, timelock controllers.', duration: '55 min', type: 'project' },
      ],
      quizzes: [
        { id: 0, question: 'What formula does Uniswap v2 use?', options: ['x + y = k', 'x * y = k', 'x / y = k', 'x ^ y = k'], correctIndex: 1 },
        { id: 1, question: 'What is impermanent loss?', options: ['Losing your private key', 'Temporary value difference vs holding', 'Gas fees on failed transactions', 'A bug in smart contracts'], correctIndex: 1 },
      ],
      enrolledCount: 967,
      completedCount: 398,
      rating: 4.7,
      duration: '5.3 hours',
    },
    {
      id: 3,
      title: 'NFT Engineering & Standards',
      description: 'Everything about NFTs — from ERC-721/1155 implementation to metadata standards.',
      instructor: 'Maya Tokenis',
      instructorTitle: 'Head of Engineering, Art Blocks',
      category: 'NFT',
      difficulty: 'Intermediate',
      skills: ['ERC-721', 'ERC-1155', 'IPFS', 'Metadata Standards', 'Soulbound Tokens'],
      modules: [
        { id: 0, title: 'NFT Concepts', description: 'What are NFTs? Digital ownership, provenance, and use cases.', duration: '40 min', type: 'video' },
        { id: 1, title: 'ERC-721 Deep Dive', description: 'Implementing ERC-721 from scratch.', duration: '70 min', type: 'lab' },
        { id: 2, title: 'ERC-1155 Multi-Token', description: 'Batch operations, fungible + non-fungible.', duration: '60 min', type: 'reading' },
        { id: 3, title: 'Metadata & IPFS', description: 'Token URI, JSON metadata, IPFS pinning.', duration: '55 min', type: 'lab' },
        { id: 4, title: 'Soulbound Tokens (SBTs)', description: 'Non-transferable tokens for identity.', duration: '45 min', type: 'project' },
      ],
      quizzes: [
        { id: 0, question: 'What makes an NFT "non-fungible"?', options: ['It is very expensive', 'Each token has a unique identifier', 'It cannot be divided', 'It is stored on IPFS'], correctIndex: 1 },
        { id: 1, question: 'What is a Soulbound Token?', options: ['An NFT with a soul', 'A non-transferable token bound to an address', 'A token that burns after use', 'A governance token'], correctIndex: 1 },
      ],
      enrolledCount: 2456,
      completedCount: 1134,
      rating: 4.9,
      duration: '4.5 hours',
    },
  ];
}

if (!globalStore.__enrollments) globalStore.__enrollments = new Map();
if (!globalStore.__moduleProgress) globalStore.__moduleProgress = new Map();
if (!globalStore.__quizScores) globalStore.__quizScores = new Map();
if (!globalStore.__certificates) globalStore.__certificates = [];
if (!globalStore.__nextTokenId) globalStore.__nextTokenId = 0;

export { globalStore };

// GET /api/courses — list all courses
export async function GET() {
  return NextResponse.json({
    success: true,
    data: globalStore.__courses,
    total: globalStore.__courses!.length,
  });
}

// POST /api/courses — create a new course (admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, instructor, instructorTitle, category, difficulty, skills, modules, quizzes, duration } = body;

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'title and description are required' }, { status: 400 });
    }

    const newCourse: Course = {
      id: globalStore.__courses!.length,
      title,
      description,
      instructor: instructor || 'Unknown',
      instructorTitle: instructorTitle || '',
      category: category || 'General',
      difficulty: difficulty || 'Beginner',
      skills: skills || [],
      modules: modules || [],
      quizzes: quizzes || [],
      enrolledCount: 0,
      completedCount: 0,
      rating: 0,
      duration: duration || '0 hours',
    };

    globalStore.__courses!.push(newCourse);

    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
  }
}

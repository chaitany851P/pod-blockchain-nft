'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/wallet-button';

// ─── Types ─────────────────────────────────────────────
interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'reading' | 'lab' | 'project';
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

interface Course {
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
  image: string;
  accent: string;
  rating: number;
  duration: string;
}

interface Certificate {
  tokenId: number;
  courseName: string;
  studentName: string;
  completionDate: Date;
  skills: string[];
  totalModules: number;
  quizScore: number;
  txHash: string;
}

type ViewState = 'catalog' | 'course' | 'quiz' | 'mint' | 'certificates';

// ─── Demo Courses Data ─────────────────────────────────
const DEMO_COURSES: Course[] = [
  {
    id: 0,
    title: 'Blockchain Fundamentals',
    description: 'Master the core concepts of blockchain technology, from cryptographic hashing to consensus mechanisms. Build a solid foundation for your Web3 journey with hands-on exercises.',
    instructor: 'Dr. Satoshi Nakamura',
    instructorTitle: 'Lead Researcher, MIT Digital Currency Initiative',
    category: 'Blockchain',
    difficulty: 'Beginner',
    skills: ['Cryptography', 'Consensus', 'Distributed Ledger', 'Hashing', 'P2P Networks'],
    modules: [
      { id: 0, title: 'Introduction to Blockchain', description: 'What is blockchain? History, evolution, and why it matters today.', duration: '45 min', completed: false, type: 'video' },
      { id: 1, title: 'Cryptographic Foundations', description: 'SHA-256 hashing, public-key cryptography, and digital signatures.', duration: '60 min', completed: false, type: 'reading' },
      { id: 2, title: 'Consensus Mechanisms', description: 'Proof of Work, Proof of Stake, and alternative consensus algorithms.', duration: '55 min', completed: false, type: 'video' },
      { id: 3, title: 'Blockchain Architecture', description: 'Blocks, chains, Merkle trees, and network topology.', duration: '50 min', completed: false, type: 'lab' },
      { id: 4, title: 'Real-World Applications', description: 'DeFi, supply chain, healthcare, and governance use cases.', duration: '40 min', completed: false, type: 'project' },
    ],
    quizzes: [
      { id: 0, question: 'What is the primary purpose of a hash function in blockchain?', options: ['Encrypt data for privacy', 'Create a fixed-size fingerprint of data', 'Store large files on-chain', 'Generate random numbers'], correctIndex: 1 },
      { id: 1, question: 'Which consensus mechanism does Ethereum currently use?', options: ['Proof of Work', 'Proof of Stake', 'Delegated Proof of Stake', 'Proof of Authority'], correctIndex: 1 },
      { id: 2, question: 'What makes a blockchain immutable?', options: ['Government regulation', 'Each block references the previous hash', 'Files are stored in the cloud', 'Passwords protect each block'], correctIndex: 1 },
    ],
    enrolledCount: 2847,
    completedCount: 1892,
    image: '🔗',
    accent: '#00d4ff',
    rating: 4.9,
    duration: '4.2 hours',
  },
  {
    id: 1,
    title: 'Smart Contract Development',
    description: 'Learn to write, test, and deploy Solidity smart contracts on Ethereum. From basic syntax to advanced design patterns and security best practices with real-world projects.',
    instructor: 'Elena Vitalova',
    instructorTitle: 'Senior Smart Contract Engineer, OpenZeppelin',
    category: 'Development',
    difficulty: 'Intermediate',
    skills: ['Solidity', 'EVM', 'Smart Contracts', 'Testing', 'Security Auditing'],
    modules: [
      { id: 0, title: 'Solidity Basics', description: 'Variables, functions, modifiers, and data types in Solidity.', duration: '60 min', completed: false, type: 'video' },
      { id: 1, title: 'Contract Architecture', description: 'Inheritance, interfaces, libraries, and contract interactions.', duration: '70 min', completed: false, type: 'reading' },
      { id: 2, title: 'Token Standards', description: 'ERC-20, ERC-721, ERC-1155 — implementing token contracts.', duration: '65 min', completed: false, type: 'lab' },
      { id: 3, title: 'Testing & Debugging', description: 'Hardhat, Foundry, unit tests, and debugging techniques.', duration: '55 min', completed: false, type: 'lab' },
      { id: 4, title: 'Security Best Practices', description: 'Reentrancy, overflow, access control, and audit patterns.', duration: '60 min', completed: false, type: 'video' },
      { id: 5, title: 'Deployment & Verification', description: 'Deploying to testnets and mainnet, contract verification.', duration: '45 min', completed: false, type: 'project' },
    ],
    quizzes: [
      { id: 0, question: 'What is the "msg.sender" in Solidity?', options: ['The contract address', 'The address calling the function', 'The block miner', 'A random address'], correctIndex: 1 },
      { id: 1, question: 'What does the "view" modifier indicate?', options: ['Function modifies state', 'Function only reads state', 'Function is payable', 'Function is private'], correctIndex: 1 },
      { id: 2, question: 'What is a reentrancy attack?', options: ['Calling a function too many times', 'When a contract calls back into the calling contract before the first call finishes', 'A type of front-running', 'Overflowing a uint256'], correctIndex: 1 },
    ],
    enrolledCount: 1983,
    completedCount: 821,
    image: '📝',
    accent: '#8b5cf6',
    rating: 4.8,
    duration: '5.9 hours',
  },
  {
    id: 2,
    title: 'DeFi Protocol Design',
    description: 'Deep dive into Decentralized Finance protocol architecture. Learn AMMs, lending protocols, yield strategies, and governance token design from real protocol builders.',
    instructor: 'Andre DeFi',
    instructorTitle: 'Founder, Yield Protocol',
    category: 'DeFi',
    difficulty: 'Advanced',
    skills: ['AMM Design', 'Yield Farming', 'Liquidity Pools', 'Governance', 'Tokenomics'],
    modules: [
      { id: 0, title: 'DeFi Landscape', description: 'Overview of the DeFi ecosystem, TVL, and major protocols.', duration: '50 min', completed: false, type: 'video' },
      { id: 1, title: 'Automated Market Makers', description: 'Uniswap v2/v3, constant product formula, impermanent loss.', duration: '75 min', completed: false, type: 'reading' },
      { id: 2, title: 'Lending & Borrowing', description: 'Aave, Compound — interest rate models and liquidation.', duration: '70 min', completed: false, type: 'lab' },
      { id: 3, title: 'Yield Strategies', description: 'Yield farming, vaults, and auto-compounding mechanisms.', duration: '65 min', completed: false, type: 'video' },
      { id: 4, title: 'Governance & DAOs', description: 'On-chain voting, delegation, timelock controllers.', duration: '55 min', completed: false, type: 'project' },
    ],
    quizzes: [
      { id: 0, question: 'What formula does Uniswap v2 use?', options: ['x + y = k', 'x * y = k', 'x / y = k', 'x ^ y = k'], correctIndex: 1 },
      { id: 1, question: 'What is impermanent loss?', options: ['Losing your private key', 'Temporary value difference vs holding', 'Gas fees on failed transactions', 'A bug in smart contracts'], correctIndex: 1 },
    ],
    enrolledCount: 967,
    completedCount: 398,
    image: '💰',
    accent: '#22c55e',
    rating: 4.7,
    duration: '5.3 hours',
  },
  {
    id: 3,
    title: 'NFT Engineering & Standards',
    description: 'Everything about NFTs — from ERC-721/1155 implementation to metadata standards, marketplaces, and soulbound tokens. Build your own NFT collection from scratch.',
    instructor: 'Maya Tokenis',
    instructorTitle: 'Head of Engineering, Art Blocks',
    category: 'NFT',
    difficulty: 'Intermediate',
    skills: ['ERC-721', 'ERC-1155', 'IPFS', 'Metadata Standards', 'Soulbound Tokens'],
    modules: [
      { id: 0, title: 'NFT Concepts', description: 'What are NFTs? Digital ownership, provenance, and use cases.', duration: '40 min', completed: false, type: 'video' },
      { id: 1, title: 'ERC-721 Deep Dive', description: 'Implementing ERC-721 from scratch with full functionality.', duration: '70 min', completed: false, type: 'lab' },
      { id: 2, title: 'ERC-1155 Multi-Token', description: 'Batch operations, fungible + non-fungible in one contract.', duration: '60 min', completed: false, type: 'reading' },
      { id: 3, title: 'Metadata & IPFS', description: 'Token URI, JSON metadata, IPFS pinning, and Arweave.', duration: '55 min', completed: false, type: 'lab' },
      { id: 4, title: 'Soulbound Tokens (SBTs)', description: 'Non-transferable tokens for identity and credentials.', duration: '45 min', completed: false, type: 'project' },
    ],
    quizzes: [
      { id: 0, question: 'What makes an NFT "non-fungible"?', options: ['It is very expensive', 'Each token has a unique identifier', 'It cannot be divided', 'It is stored on IPFS'], correctIndex: 1 },
      { id: 1, question: 'What is a Soulbound Token?', options: ['An NFT with a soul', 'A non-transferable token bound to an address', 'A token that burns after use', 'A governance token'], correctIndex: 1 },
    ],
    enrolledCount: 2456,
    completedCount: 1134,
    image: '🎨',
    accent: '#f59e0b',
    rating: 4.9,
    duration: '4.5 hours',
  },
];

// ─── Unique Visual Components ──────────────────────────

function BlockchainViz() {
  return (
    <div className="blockchain-viz" aria-hidden="true">
      <svg width="400" height="80" viewBox="0 0 400 80" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x={i * 80 + 10}
              y="20"
              width="40"
              height="40"
              rx="8"
              fill="none"
              stroke="url(#blockGrad)"
              strokeWidth="1.5"
              opacity={0.4 + i * 0.15}
              className="blockchain-block"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
            <text
              x={i * 80 + 30}
              y="44"
              textAnchor="middle"
              fill="rgba(0, 212, 255, 0.5)"
              fontSize="9"
              fontFamily="'JetBrains Mono', monospace"
              style={{ animationDelay: `${i * 0.3}s` }}
              className="blockchain-block"
            >
              #{18420000 + i}
            </text>
            {i < 4 && (
              <line
                x1={i * 80 + 52}
                y1="40"
                x2={i * 80 + 88}
                y2="40"
                stroke="rgba(0, 212, 255, 0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                className="blockchain-link"
                style={{ animationDelay: `${i * 0.3 + 0.15}s` }}
              />
            )}
          </g>
        ))}
        <defs>
          <linearGradient id="blockGrad" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#00d4ff" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LiveNetworkBar() {
  const [mounted, setMounted] = useState(false);
  const [blockNum, setBlockNum] = useState(18420156);
  const [gasPrice, setGasPrice] = useState(12);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBlockNum((n) => n + 1);
      setGasPrice(Math.floor(8 + Math.random() * 20));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div className="live-network-bar">
      <div className="network-item">
        <span className="network-dot live" />
        <span className="network-label">Arbitrum</span>
      </div>
      <div className="network-item">
        <span className="network-label">Block</span>
        <span className="network-value mono">{blockNum.toLocaleString()}</span>
      </div>
      <div className="network-item">
        <span className="network-label">Gas</span>
        <span className="network-value mono">{gasPrice} gwei</span>
      </div>
      <div className="network-item">
        <span className="network-label">NFTs Minted</span>
        <span className="network-value">2,847</span>
      </div>
    </div>
  );
}

// ─── Helper Components ─────────────────────────────────

// Deterministic seed function to avoid hydration mismatch
function seededValue(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function ParticleBackground() {
  return (
    <div className="particles-bg">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${seededValue(i * 4 + 1) * 100}%`,
            top: `${seededValue(i * 4 + 2) * 100}%`,
            animationDelay: `${seededValue(i * 4 + 3) * 10}s`,
            animationDuration: `${8 + seededValue(i * 4 + 4) * 10}s`,
          }}
        />
      ))}
    </div>
  );
}

function GlowOrb({ color, size, top, left }: { color: string; size: number; top: string; left: string }) {
  return (
    <div
      className="glow-orb"
      style={{
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        width: size,
        height: size,
        top,
        left,
      }}
    />
  );
}

function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Beginner: 'badge-beginner',
    Intermediate: 'badge-intermediate',
    Advanced: 'badge-advanced',
  };
  return <span className={`difficulty-badge ${colors[level] || ''}`}>{level}</span>;
}

function ProgressRing({ progress, size = 60, strokeWidth = 4, color = '#00d4ff' }: { progress: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="progress-ring-circle"
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="white" fontSize={size * 0.22} fontWeight="700" fontFamily="'Outfit', sans-serif">
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

function ModuleTypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = { video: '🎬', reading: '📖', lab: '🧪', project: '🚀' };
  return <span title={type} style={{ fontSize: 14 }}>{icons[type] || '📄'}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#f59e0b' }}>
      ⭐ {rating.toFixed(1)}
    </span>
  );
}

function ConfettiBurst() {
  const colors = ['#00d4ff', '#8b5cf6', '#22c55e', '#f59e0b', '#f43f5e', '#3b82f6'];
  return (
    <div className="confetti-container">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${seededValue(i * 6 + 100) * 100}%`,
            background: colors[Math.floor(seededValue(i * 6 + 101) * colors.length)],
            animationDuration: `${2 + seededValue(i * 6 + 102) * 3}s`,
            animationDelay: `${seededValue(i * 6 + 103) * 0.8}s`,
            width: `${6 + seededValue(i * 6 + 104) * 8}px`,
            height: `${6 + seededValue(i * 6 + 105) * 8}px`,
            borderRadius: seededValue(i * 6 + 106) > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

// NFT Certificate Visual Card
function CertificateCard({ cert, compact = false }: { cert: Certificate; compact?: boolean }) {
  return (
    <div className={`certificate-card ${compact ? 'compact' : ''}`}>
      <div className="cert-glow" />
      <div className="cert-header">
        <div className="cert-badge">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
            <circle cx="21" cy="21" r="19" stroke="url(#certGrad)" strokeWidth="2" />
            <path d="M14 21l5 5 9-9" stroke="#00d4ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="certGrad" x1="0" y1="0" x2="42" y2="42">
                <stop stopColor="#00d4ff" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="cert-title-area">
          <span className="cert-label">BLOCKCHAIN CERTIFICATE</span>
          <h3 className="cert-course-name">{cert.courseName}</h3>
        </div>
      </div>
      <div className="cert-body">
        <div className="cert-field">
          <span className="cert-field-label">Issued To</span>
          <span className="cert-field-value">{cert.studentName}</span>
        </div>
        <div className="cert-field">
          <span className="cert-field-label">Date</span>
          <span className="cert-field-value">{cert.completionDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="cert-field">
          <span className="cert-field-label">Quiz Score</span>
          <span className="cert-field-value">{cert.quizScore}%</span>
        </div>
        <div className="cert-field">
          <span className="cert-field-label">Token ID</span>
          <span className="cert-field-value mono">#{cert.tokenId}</span>
        </div>
      </div>
      {!compact && (
        <div className="cert-skills">
          <span className="cert-field-label">Skills Verified</span>
          <div className="cert-skill-tags">
            {cert.skills.map((s, i) => (
              <span key={i} className="cert-skill-tag">{s}</span>
            ))}
          </div>
        </div>
      )}
      <div className="cert-footer">
        <div className="cert-chain-badge">
          <span className="cert-chain-dot" />
          Soulbound · On-Chain
        </div>
        {cert.txHash && (
          <span className="cert-tx mono">{cert.txHash.slice(0, 10)}...{cert.txHash.slice(-8)}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Page Component ───────────────────────────────
export default function CourseNFTPage() {
  const { address, isConnected } = useAccount();
  const [view, setView] = useState<ViewState>('catalog');
  const [courses, setCourses] = useState<Course[]>(DEMO_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const getCourseProgress = useCallback((course: Course) => {
    const completedModules = course.modules.filter((m) => m.completed).length;
    return Math.round((completedModules / course.modules.length) * 100);
  }, []);

  const isAllModulesComplete = useCallback((course: Course) => {
    return course.modules.every((m) => m.completed);
  }, []);

  const handleEnroll = (courseId: number) => {
    setEnrolledCourses((prev) => new Set([...prev, courseId]));
  };

  const handleCompleteModule = (courseId: number, moduleId: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, modules: c.modules.map((m) => m.id === moduleId ? { ...m, completed: true } : m) }
          : c
      )
    );
    if (selectedCourse?.id === courseId) {
      setSelectedCourse((prev) =>
        prev ? { ...prev, modules: prev.modules.map((m) => m.id === moduleId ? { ...m, completed: true } : m) } : null
      );
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedCourse) return;
    let correct = 0;
    selectedCourse.quizzes.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) correct++;
    });
    const score = Math.round((correct / selectedCourse.quizzes.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleMint = async () => {
    if (!selectedCourse || !studentName.trim()) return;
    setIsMinting(true);
    await new Promise((r) => setTimeout(r, 3000));

    const newCert: Certificate = {
      tokenId: certificates.length,
      courseName: selectedCourse.title,
      studentName: studentName.trim(),
      completionDate: new Date(),
      skills: selectedCourse.skills,
      totalModules: selectedCourse.modules.length,
      quizScore,
      txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };

    setCertificates((prev) => [...prev, newCert]);
    setIsMinting(false);
    setMintSuccess(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setMintSuccess(false);
    setStudentName('');
    setView('course');
  };

  const goBack = () => {
    setView('catalog');
    setSelectedCourse(null);
  };

  useEffect(() => {
    if (selectedCourse) {
      const updated = courses.find((c) => c.id === selectedCourse.id);
      if (updated) setSelectedCourse(updated);
    }
  }, [courses]);

  // ─── Render: Catalog View ────────────────────────────
  const renderCatalog = () => (
    <div className="catalog-view fade-in">
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-value">{courses.length}</span>
          <span className="stat-label">Courses</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{enrolledCourses.size}</span>
          <span className="stat-label">Enrolled</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{certificates.length}</span>
          <span className="stat-label">Certificates</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{courses.reduce((acc, c) => acc + c.skills.length, 0)}</span>
          <span className="stat-label">Skills</span>
        </div>
      </div>

      <div className="course-grid">
        {courses.map((course, idx) => {
          const progress = getCourseProgress(course);
          const isEnrolled = enrolledCourses.has(course.id);
          const hasCert = certificates.some((c) => c.courseName === course.title);

          return (
            <div
              key={course.id}
              className="course-card"
              style={{ '--accent': course.accent, animationDelay: `${idx * 0.1}s` } as React.CSSProperties}
              onClick={() => openCourse(course)}
            >
              <div className="course-card-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${course.accent}12, transparent 70%)` }} />

              <div className="course-card-header">
                <span className="course-emoji">{course.image}</span>
                <div className="course-card-meta">
                  <DifficultyBadge level={course.difficulty} />
                  <span className="course-category">{course.category}</span>
                </div>
              </div>

              <h3 className="course-card-title">{course.title}</h3>
              <p className="course-card-desc">{course.description.slice(0, 110)}...</p>

              <div className="course-card-skills">
                {course.skills.slice(0, 3).map((s, i) => (
                  <span key={i} className="skill-chip" style={{ borderColor: `${course.accent}40`, color: course.accent }}>
                    {s}
                  </span>
                ))}
                {course.skills.length > 3 && (
                  <span className="skill-chip more">+{course.skills.length - 3}</span>
                )}
              </div>

              <div className="course-card-footer">
                <div className="course-card-stats">
                  <span>📚 {course.modules.length} modules</span>
                  <span>⏱ {course.duration}</span>
                  <StarRating rating={course.rating} />
                </div>
                {isEnrolled && !hasCert && (
                  <div className="progress-mini">
                    <div className="progress-mini-bar">
                      <div className="progress-mini-fill" style={{ width: `${progress}%`, background: course.accent }} />
                    </div>
                    <span className="progress-mini-text" style={{ color: course.accent }}>{progress}%</span>
                  </div>
                )}
                {hasCert && (
                  <div className="cert-mini-badge">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="#22c55e" strokeWidth="1.5" />
                      <path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Certified
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2 className="how-it-works-title">How It Works</h2>
        <p className="how-it-works-subtitle">Four simple steps to earn your on-chain certificate</p>
        <div className="steps-grid">
          {[
            { icon: '📚', title: 'Enroll', desc: 'Browse courses and enroll in the one that interests you.' },
            { icon: '✅', title: 'Complete', desc: 'Work through all modules and hands-on labs.' },
            { icon: '📝', title: 'Pass Quiz', desc: 'Score at least 60% on the final quiz to prove mastery.' },
            { icon: '🎓', title: 'Mint NFT', desc: 'Mint your soulbound certificate NFT on-chain.' },
          ].map((step, i) => (
            <div key={i} className="step-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="step-number">{i + 1}</span>
              <span className="step-icon">{step.icon}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {certificates.length > 0 && (
        <div className="my-certs-section" style={{ marginTop: 56 }}>
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">🏆</span>
              My Certificates
            </h2>
            <button className="btn-ghost" onClick={() => setView('certificates')}>
              View All →
            </button>
          </div>
          <div className="certs-scroll">
            {certificates.map((cert) => (
              <CertificateCard key={cert.tokenId} cert={cert} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ─── Render: Course Detail View ──────────────────────
  const renderCourse = () => {
    if (!selectedCourse) return null;
    const progress = getCourseProgress(selectedCourse);
    const allDone = isAllModulesComplete(selectedCourse);
    const isEnrolled = enrolledCourses.has(selectedCourse.id);
    const hasCert = certificates.some((c) => c.courseName === selectedCourse.title);

    return (
      <div className="course-detail-view fade-in">
        <button className="btn-back" onClick={goBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Catalog
        </button>

        <div className="course-hero" style={{ '--accent': selectedCourse.accent } as React.CSSProperties}>
          <div className="course-hero-glow" style={{ background: `radial-gradient(ellipse at 30% 50%, ${selectedCourse.accent}10, transparent 60%)` }} />
          <div className="course-hero-content">
            <div className="course-hero-left">
              <div className="course-hero-meta">
                <DifficultyBadge level={selectedCourse.difficulty} />
                <span className="course-category">{selectedCourse.category}</span>
                <StarRating rating={selectedCourse.rating} />
                <span className="course-instructor">by {selectedCourse.instructor}</span>
              </div>
              <h1 className="course-hero-title">{selectedCourse.image} {selectedCourse.title}</h1>
              <p className="course-hero-desc">{selectedCourse.description}</p>
              <div className="course-hero-skills">
                {selectedCourse.skills.map((s, i) => (
                  <span key={i} className="skill-chip-lg" style={{ borderColor: `${selectedCourse.accent}50`, color: selectedCourse.accent }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="course-hero-right">
              <ProgressRing progress={progress} size={130} strokeWidth={6} color={selectedCourse.accent} />
              <div className="course-hero-stats">
                <span>{selectedCourse.modules.filter((m) => m.completed).length}/{selectedCourse.modules.length} modules</span>
                <span>{selectedCourse.enrolledCount.toLocaleString()} enrolled</span>
                <span>{selectedCourse.duration} total</span>
              </div>
              {!isEnrolled && !hasCert && (
                <button className="btn-primary btn-enroll" style={{ background: selectedCourse.accent }} onClick={() => handleEnroll(selectedCourse.id)}>
                  Enroll Now — Free
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="modules-section">
          <h2 className="section-title">
            <span className="section-icon">📖</span>
            Course Modules
          </h2>
          <div className="modules-list">
            {selectedCourse.modules.map((mod, idx) => (
              <div key={mod.id} className={`module-item ${mod.completed ? 'completed' : ''}`} style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="module-status">
                  {mod.completed ? (
                    <div className="module-check" style={{ background: selectedCourse.accent }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="module-number">{idx + 1}</div>
                  )}
                  {idx < selectedCourse.modules.length - 1 && <div className={`module-line ${mod.completed ? 'active' : ''}`} style={mod.completed ? { background: selectedCourse.accent } : {}} />}
                </div>
                <div className="module-content">
                  <div className="module-header">
                    <h3 className="module-title">
                      <ModuleTypeIcon type={mod.type} /> {mod.title}
                    </h3>
                    <span className="module-duration">{mod.duration}</span>
                  </div>
                  <p className="module-desc">{mod.description}</p>
                  {isEnrolled && !mod.completed && (
                    <button
                      className="btn-module-complete"
                      style={{ color: selectedCourse.accent, borderColor: `${selectedCourse.accent}40` }}
                      onClick={(e) => { e.stopPropagation(); handleCompleteModule(selectedCourse.id, mod.id); }}
                    >
                      Mark as Complete ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {isEnrolled && allDone && !hasCert && (
          <div className="completion-section">
            <div className="completion-banner" style={{ borderColor: `${selectedCourse.accent}30` }}>
              <div className="completion-banner-glow" style={{ background: `radial-gradient(ellipse at 50% 50%, ${selectedCourse.accent}10, transparent 70%)` }} />
              <h2 className="completion-title">🎉 All Modules Completed!</h2>
              <p className="completion-desc">
                {!quizSubmitted
                  ? "Take the final quiz to test your knowledge, then mint your NFT certificate."
                  : quizScore >= 60
                  ? `Great job! You scored ${quizScore}%. You're ready to mint your certificate.`
                  : `You scored ${quizScore}%. Keep studying and try again!`}
              </p>
              {!quizSubmitted ? (
                <button className="btn-primary btn-quiz" style={{ background: selectedCourse.accent }} onClick={() => setView('quiz')}>
                  Take Final Quiz →
                </button>
              ) : quizScore >= 60 ? (
                <button className="btn-primary btn-mint-navigate" onClick={() => setView('mint')}>
                  🎓 Mint Certificate NFT
                </button>
              ) : (
                <button className="btn-secondary" onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); setView('quiz'); }}>
                  Retry Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {hasCert && (
          <div className="completion-section">
            <div className="completion-banner certified" style={{ borderColor: '#22c55e30' }}>
              <h2 className="completion-title">✅ Certificate Minted!</h2>
              <p className="completion-desc">Your NFT certificate for this course is safely stored on-chain forever.</p>
              <button className="btn-ghost" onClick={() => setView('certificates')}>
                View My Certificates →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Render: Quiz View ───────────────────────────────
  const renderQuiz = () => {
    if (!selectedCourse) return null;
    return (
      <div className="quiz-view fade-in">
        <button className="btn-back" onClick={() => setView('course')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Course
        </button>

        <div className="quiz-header">
          <h1 className="quiz-title">📝 Final Quiz: {selectedCourse.title}</h1>
          <p className="quiz-subtitle">Answer all questions. You need at least 60% to pass and mint your NFT certificate.</p>
        </div>

        <div className="quiz-questions">
          {selectedCourse.quizzes.map((q, idx) => (
            <div key={q.id} className="quiz-question" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="quiz-q-header">
                <span className="quiz-q-number">Q{idx + 1}</span>
                <h3 className="quiz-q-text">{q.question}</h3>
              </div>
              <div className="quiz-options">
                {q.options.map((opt, optIdx) => {
                  const isSelected = quizAnswers[q.id] === optIdx;
                  const isCorrect = quizSubmitted && optIdx === q.correctIndex;
                  const isWrong = quizSubmitted && isSelected && optIdx !== q.correctIndex;
                  return (
                    <button
                      key={optIdx}
                      className={`quiz-option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''}`}
                      onClick={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [q.id]: optIdx }))}
                      disabled={quizSubmitted}
                    >
                      <span className="quiz-option-letter">{String.fromCharCode(65 + optIdx)}</span>
                      <span className="quiz-option-text">{opt}</span>
                      {isCorrect && <span className="quiz-correct-icon">✓</span>}
                      {isWrong && <span className="quiz-wrong-icon">✗</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!quizSubmitted && (
          <div className="quiz-submit-area">
            <button
              className="btn-primary btn-quiz-submit"
              disabled={Object.keys(quizAnswers).length < selectedCourse.quizzes.length}
              onClick={handleSubmitQuiz}
            >
              Submit Answers
            </button>
          </div>
        )}

        {quizSubmitted && (
          <div className="quiz-results">
            <div className={`quiz-result-card ${quizScore >= 60 ? 'pass' : 'fail'}`}>
              <h2>{quizScore >= 60 ? '🎉 Passed!' : '😔 Not Yet'}</h2>
              <p className="quiz-result-score">Score: {quizScore}%</p>
              <p>{quizScore >= 60 ? "You're ready to mint your NFT certificate!" : 'Study the material and try again.'}</p>
              <button
                className="btn-primary"
                onClick={() => {
                  if (quizScore >= 60) setView('mint');
                  else { setQuizAnswers({}); setQuizSubmitted(false); }
                }}
              >
                {quizScore >= 60 ? '🎓 Mint Certificate' : '🔄 Retry Quiz'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Render: Mint View ───────────────────────────────
  const renderMint = () => {
    if (!selectedCourse) return null;

    if (mintSuccess) {
      const lastCert = certificates[certificates.length - 1];
      return (
        <div className="mint-view fade-in">
          <div className="mint-success">
            <div className="mint-success-animation">
              <div className="success-ring" />
              <div className="success-ring delay-1" />
              <div className="success-ring delay-2" />
              <svg className="success-check" width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="35" stroke="#22c55e" strokeWidth="3" />
                <path d="M24 40l10 10 22-22" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="check-draw" />
              </svg>
            </div>
            <h1 className="mint-success-title">Certificate Minted! 🎓</h1>
            <p className="mint-success-desc">Your achievement is now permanently recorded on the blockchain. No one can fake or revoke it.</p>
            {lastCert && <CertificateCard cert={lastCert} />}
            <div className="mint-success-actions">
              <button className="btn-primary" onClick={goBack}>Back to Courses</button>
              <button className="btn-ghost" onClick={() => setView('certificates')}>View All Certificates</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mint-view fade-in">
        <button className="btn-back" onClick={() => setView('course')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Course
        </button>

        <div className="mint-container">
          <div className="mint-preview">
            <h2 className="mint-preview-title">Certificate Preview</h2>
            <div className="mint-cert-preview">
              <div className="preview-cert">
                <div className="preview-cert-header">
                  <span className="preview-cert-label">BLOCKCHAIN CERTIFICATE</span>
                  <h3>{selectedCourse.title}</h3>
                </div>
                <div className="preview-cert-body">
                  <p><strong>Student:</strong> {studentName || 'Your Name'}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p><strong>Modules:</strong> {selectedCourse.modules.length} completed</p>
                  <p><strong>Quiz Score:</strong> {quizScore}%</p>
                </div>
                <div className="preview-cert-skills">
                  {selectedCourse.skills.map((s, i) => (
                    <span key={i} className="preview-skill-tag">{s}</span>
                  ))}
                </div>
                <div className="preview-cert-footer">
                  <span>Soulbound NFT · Non-Transferable</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mint-form">
            <h2 className="mint-form-title">🎓 Mint Your Certificate</h2>
            <p className="mint-form-desc">This will create a soulbound NFT on the blockchain, permanently proving your course completion.</p>

            <div className="mint-details">
              <div className="mint-detail-row">
                <span className="mint-detail-label">Course</span>
                <span className="mint-detail-value">{selectedCourse.title}</span>
              </div>
              <div className="mint-detail-row">
                <span className="mint-detail-label">Modules</span>
                <span className="mint-detail-value">{selectedCourse.modules.length}/{selectedCourse.modules.length} ✅</span>
              </div>
              <div className="mint-detail-row">
                <span className="mint-detail-label">Quiz Score</span>
                <span className="mint-detail-value">{quizScore}%</span>
              </div>
              <div className="mint-detail-row">
                <span className="mint-detail-label">Wallet</span>
                <span className="mint-detail-value mono">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}</span>
              </div>
              <div className="mint-detail-row">
                <span className="mint-detail-label">Type</span>
                <span className="mint-detail-value">Soulbound (Non-Transferable)</span>
              </div>
            </div>

            <div className="mint-input-group">
              <label htmlFor="studentName" className="mint-label">Your Name (stored on-chain)</label>
              <input
                id="studentName"
                type="text"
                className="mint-input"
                placeholder="Enter your full name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <button className="btn-primary btn-mint" onClick={handleMint} disabled={isMinting || !studentName.trim()}>
              {isMinting ? (
                <span className="mint-loading">
                  <span className="spinner" />
                  Minting on Blockchain...
                </span>
              ) : (
                '🔗 Mint Certificate NFT'
              )}
            </button>

            <p className="mint-note">
              ⛽ Gas fees apply. The certificate is permanently stored on-chain and cannot be transferred or revoked.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render: All Certificates View ───────────────────
  const renderCertificates = () => (
    <div className="certificates-view fade-in">
      <button className="btn-back" onClick={goBack}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to Catalog
      </button>

      <div className="certs-page-header">
        <h1 className="certs-page-title">🏆 My Certificates</h1>
        <p className="certs-page-subtitle">
          {certificates.length > 0
            ? `You have ${certificates.length} on-chain certificate${certificates.length > 1 ? 's' : ''} — permanently verifiable, forever yours.`
            : 'Complete courses to earn soulbound NFT certificates'}
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="certs-empty">
          <div className="certs-empty-icon">📜</div>
          <h3>No Certificates Yet</h3>
          <p>Enroll in a course, complete all modules and the quiz to earn your first NFT certificate!</p>
          <button className="btn-primary" onClick={goBack}>Browse Courses</button>
        </div>
      ) : (
        <div className="certs-grid">
          {certificates.map((cert) => (
            <CertificateCard key={cert.tokenId} cert={cert} />
          ))}
        </div>
      )}
    </div>
  );

  // ─── Main Render ─────────────────────────────────────
  return (
    <main className="course-nft-page">
      {showConfetti && <ConfettiBurst />}
      <div className="mesh-gradient" />
      <div className="grid-pattern" />
      <ParticleBackground />
      <GlowOrb color="#00d4ff" size={700} top="-250px" left="-250px" />
      <GlowOrb color="#8b5cf6" size={550} top="55%" left="78%" />
      <GlowOrb color="#22c55e" size={450} top="75%" left="5%" />

      <nav className="top-nav">
        <div className="nav-left">
          <button className="nav-logo" onClick={goBack}>
            <span className="nav-logo-icon">🎓</span>
            <span className="nav-logo-text">CertChain</span>
          </button>
        </div>
        <div className="nav-center">
          <button className={`nav-tab ${view === 'catalog' ? 'active' : ''}`} onClick={goBack}>
            Courses
          </button>
          <button
            className={`nav-tab ${view === 'certificates' ? 'active' : ''}`}
            onClick={() => setView('certificates')}
          >
            Certificates
            {certificates.length > 0 && <span className="nav-tab-badge">{certificates.length}</span>}
          </button>
        </div>
        <div className="nav-right">
          <WalletButton />
        </div>
      </nav>

      {view === 'catalog' && (
        <>
          <LiveNetworkBar />
          <div className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot" />
                Powered by Arbitrum Blockchain
              </div>
              <h1 className="hero-title">
                Learn. Prove. <span className="hero-gradient">Own It Forever.</span>
              </h1>
              <p className="hero-subtitle">
                Complete courses and mint verifiable, soulbound NFT certificates on the blockchain.
                Your achievements — permanently on-chain, impossible to fake.
              </p>
              <BlockchainViz />
              <div className="hero-features">
                <div className="hero-feature">
                  <span className="hero-feature-icon">🔒</span>
                  <span>Soulbound NFTs</span>
                </div>
                <div className="hero-feature">
                  <span className="hero-feature-icon">⛓️</span>
                  <span>On-Chain Proof</span>
                </div>
                <div className="hero-feature">
                  <span className="hero-feature-icon">✅</span>
                  <span>Instantly Verifiable</span>
                </div>
                <div className="hero-feature">
                  <span className="hero-feature-icon">♾️</span>
                  <span>Permanent Record</span>
                </div>
                <div className="hero-feature">
                  <span className="hero-feature-icon">🛡️</span>
                  <span>Tamper-Proof</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="content-wrapper">
        {view === 'catalog' && renderCatalog()}
        {view === 'course' && renderCourse()}
        {view === 'quiz' && renderQuiz()}
        {view === 'mint' && renderMint()}
        {view === 'certificates' && renderCertificates()}
      </div>

      {/* ─── Footer ─────────────────────────── */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🎓</span>
            <span className="footer-name">CertChain</span>
          </div>
          <div className="footer-links">
            <button className="footer-link" onClick={goBack}>Courses</button>
            <button className="footer-link" onClick={() => setView('certificates')}>Certificates</button>
            <span className="footer-link" style={{ cursor: 'default' }}>Smart Contract</span>
            <span className="footer-link" style={{ cursor: 'default' }}>API Docs</span>
          </div>
          <div className="footer-tech">
            <span className="footer-tech-badge">⚡ Next.js 14</span>
            <span className="footer-tech-badge">🔗 Solidity</span>
            <span className="footer-tech-badge">🌐 Arbitrum</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CertChain — Soulbound On-Chain Certification</span>
          <span className="footer-hackathon">
            <span style={{ fontSize: 14 }}>🏆</span>
            Built for Blockchain Hackathon
          </span>
          <span>Powered by Ethereum · ERC-721 Soulbound</span>
        </div>
      </footer>
    </main>
  );
}

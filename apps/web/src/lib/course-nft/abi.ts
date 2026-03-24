export const COURSE_NFT_ABI = [
  // Course Management
  {
    name: "createCourse",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string" },
      { name: "_description", type: "string" },
      { name: "_totalModules", type: "uint256" },
      { name: "_totalQuizzes", type: "uint256" },
      { name: "_skills", type: "string[]" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "setCourseActive",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "courseId", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    outputs: [],
  },
  // Student Actions
  {
    name: "enroll",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "courseId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "completeModule",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "courseId", type: "uint256" },
      { name: "student", type: "address" },
    ],
    outputs: [],
  },
  {
    name: "recordQuizScore",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "courseId", type: "uint256" },
      { name: "student", type: "address" },
      { name: "score", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "mintCertificate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "courseId", type: "uint256" },
      { name: "studentName", type: "string" },
      { name: "metadataURI", type: "string" },
    ],
    outputs: [],
  },
  // View Functions
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "_owner", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    name: "getCertificate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "courseName", type: "string" },
          { name: "studentName", type: "string" },
          { name: "completionDate", type: "uint256" },
          { name: "skillsLearned", type: "string[]" },
          { name: "totalModules", type: "uint256" },
          { name: "quizScore", type: "uint256" },
          { name: "student", type: "address" },
          { name: "metadataURI", type: "string" },
        ],
      },
    ],
  },
  {
    name: "getStudentTokens",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "student", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  {
    name: "courses",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "courseId", type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "totalModules", type: "uint256" },
      { name: "totalQuizzes", type: "uint256" },
      { name: "isActive", type: "bool" },
      { name: "enrolledCount", type: "uint256" },
      { name: "completedCount", type: "uint256" },
    ],
  },
  {
    name: "getCourseSkills",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "courseId", type: "uint256" }],
    outputs: [{ type: "string[]" }],
  },
  {
    name: "studentProgress",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "courseId", type: "uint256" },
      { name: "student", type: "address" },
    ],
    outputs: [
      { name: "completedModules", type: "uint256" },
      { name: "quizScore", type: "uint256" },
      { name: "hasMinted", type: "bool" },
      { name: "isEnrolled", type: "bool" },
    ],
  },
  {
    name: "totalSupply",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "totalCourses",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "instructor",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    name: "name",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "string" }],
  },
  // Events
  {
    name: "CourseCreated",
    type: "event",
    inputs: [
      { name: "courseId", type: "uint256", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "totalModules", type: "uint256", indexed: false },
    ],
  },
  {
    name: "StudentEnrolled",
    type: "event",
    inputs: [
      { name: "courseId", type: "uint256", indexed: true },
      { name: "student", type: "address", indexed: true },
    ],
  },
  {
    name: "ModuleCompleted",
    type: "event",
    inputs: [
      { name: "courseId", type: "uint256", indexed: true },
      { name: "student", type: "address", indexed: true },
      { name: "completedModules", type: "uint256", indexed: false },
    ],
  },
  {
    name: "QuizCompleted",
    type: "event",
    inputs: [
      { name: "courseId", type: "uint256", indexed: true },
      { name: "student", type: "address", indexed: true },
      { name: "score", type: "uint256", indexed: false },
    ],
  },
  {
    name: "CertificateMinted",
    type: "event",
    inputs: [
      { name: "tokenId", type: "uint256", indexed: true },
      { name: "courseId", type: "uint256", indexed: true },
      { name: "student", type: "address", indexed: true },
      { name: "courseName", type: "string", indexed: false },
      { name: "completionDate", type: "uint256", indexed: false },
    ],
  },
  {
    name: "Transfer",
    type: "event",
    inputs: [
      { name: "from", type: "address", indexed: true },
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const;

// Default contract address — update after deployment
export const COURSE_NFT_ADDRESS = (process.env.NEXT_PUBLIC_COURSE_NFT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

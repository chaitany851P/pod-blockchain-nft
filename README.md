<p align="center">
  <img src="https://img.shields.io/badge/🎓-CertChain-00d4ff?style=for-the-badge&labelColor=030306" alt="CertChain" />
</p>

<h1 align="center">🎓 CertChain — On-Chain Course Certification</h1>

<p align="center">
  <strong>Soulbound NFT certificates for blockchain education — permanently verifiable, impossible to fake.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-^0.8.20-363636?style=flat-square&logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/Arbitrum-Network-28A0F0?style=flat-square&logo=arbitrum" alt="Arbitrum" />
  <img src="https://img.shields.io/badge/ERC--721-Soulbound-8b5cf6?style=flat-square" alt="ERC-721" />
  <img src="https://img.shields.io/badge/wagmi-v2-FF4154?style=flat-square" alt="wagmi" />
  <img src="https://img.shields.io/badge/RainbowKit-v2-7B3FE4?style=flat-square" alt="RainbowKit" />
  <img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" alt="MIT" />
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-problem-statement">Problem</a> •
  <a href="#-solution">Solution</a> •
  <a href="#%EF%B8%8F-architecture">Architecture</a> •
  <a href="#-smart-contract">Smart Contract</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-tech-stack">Tech Stack</a>
</p>

---

## 🏆 Hackathon Submission

> **CertChain** is a decentralized course certification platform that issues **soulbound (non-transferable) NFT certificates** on the blockchain. Students complete courses, pass quizzes, and mint permanent, cryptographically verifiable proof of their achievements.

### Why CertChain?

| Traditional Certificates | CertChain NFT Certificates |
|---|---|
| ❌ Easily forged | ✅ Cryptographically secured |
| ❌ Lost when provider shuts down | ✅ Permanently on-chain |
| ❌ Manual verification needed | ✅ Instantly verifiable by anyone |
| ❌ Centralized & opaque | ✅ Decentralized & transparent |
| ❌ Transferable (can share) | ✅ Soulbound (tied to your wallet) |

---

## 🎯 Problem Statement

Academic and professional certifications face critical challenges:

- **Credential fraud** costs the global economy over **$600B annually**
- Certificate verification is **slow, manual, and centralized**
- When institutions close, **certificates become unverifiable**
- Digital PDFs/images are **trivially forgeable**

---

## 💡 Solution

CertChain solves this by putting the entire certification lifecycle **on-chain**:

```
📚 Enroll → ✅ Complete Modules → 📝 Pass Quiz → 🎓 Mint Soulbound NFT
```

Each certificate is a **soulbound ERC-721 token** that:
- ✅ Cannot be transferred, traded, or sold
- ✅ Stores course name, student name, skills, quiz score **on-chain**
- ✅ Is permanently verifiable by anyone with the token ID
- ✅ Lives forever on the blockchain, independent of any institution

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 14)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ Course       │  │ Quiz Engine  │  │ NFT Minting    │  │
│  │ Catalog      │  │ (Auto-grade) │  │ + Certificate  │  │
│  └─────────────┘  └──────────────┘  └────────────────┘  │
│         │                │                    │          │
│  ┌──────┴────────────────┴────────────────────┴──────┐  │
│  │              REST API Layer (Next.js API Routes)   │  │
│  │  /api/courses  /api/students/*  /api/certificates  │  │
│  └────────────────────────┬──────────────────────────┘  │
└───────────────────────────┼──────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              │   wagmi + viem + RainbowKit │
              └─────────────┬─────────────┘
                            │
              ┌─────────────┴─────────────┐
              │    Arbitrum Blockchain      │
              │  ┌─────────────────────┐   │
              │  │ CourseCompletionNFT │   │
              │  │   (Solidity ^0.8)   │   │
              │  │                     │   │
              │  │ • Soulbound ERC-721 │   │
              │  │ • On-chain metadata │   │
              │  │ • Course management │   │
              │  │ • Progress tracking │   │
              │  │ • Transfer blocked  │   │
              │  └─────────────────────┘   │
              └───────────────────────────┘
```

---

## 📜 Smart Contract

**`CourseCompletionNFT.sol`** — A custom soulbound ERC-721 implementation.

### Key Features

| Feature | Description |
|---------|-------------|
| **Soulbound** | `transferFrom`, `safeTransferFrom`, `approve`, `setApprovalForAll` all revert |
| **On-chain Metadata** | Course name, student name, skills, quiz score, completion date stored in contract |
| **Course Management** | Create courses, track enrollment, manage modules |
| **Progress Tracking** | Per-student module completion and quiz score tracking |
| **Certificate Minting** | Students mint after completing all modules and passing quiz |
| **Access Control** | Owner + Instructor roles for administrative functions |

### Contract Functions

```solidity
// Course Management (Instructor)
createCourse(name, description, totalModules, totalQuizzes, skills) → courseId
setCourseActive(courseId, active)

// Student Actions
enroll(courseId)
mintCertificate(courseId, studentName, metadataURI)

// Instructor Actions
completeModule(courseId, student)
recordQuizScore(courseId, student, score)

// View Functions
getCertificate(tokenId) → Certificate
getStudentTokens(student) → tokenId[]
studentProgress(courseId, student) → (completedModules, quizScore, hasMinted, isEnrolled)
totalSupply() → count
totalCourses() → count
```

---

## 🔌 API Endpoints

CertChain includes a full REST API for integration and testing:

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check + system stats |
| `GET` | `/api/courses` | List all courses |
| `GET` | `/api/courses/:id` | Get course by ID |
| `POST` | `/api/courses` | Create new course |

### Students

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/students/enroll` | Enroll in a course |
| `GET` | `/api/students/enroll?studentAddress=` | Get enrollments |
| `POST` | `/api/students/complete-module` | Complete a module |
| `GET` | `/api/students/complete-module?studentAddress=&courseId=` | Get progress |
| `POST` | `/api/students/quiz` | Submit quiz answers |

### Certificates

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/certificates/mint` | Mint certificate NFT |
| `GET` | `/api/certificates/mint` | List all certificates |
| `GET` | `/api/certificates/mint?studentAddress=` | Get student certs |

### Example: Full Flow via API

```bash
# 1. List courses
GET /api/courses

# 2. Enroll
POST /api/students/enroll
{ "studentAddress": "0x742d...", "courseId": 0 }

# 3. Complete modules (repeat for all)
POST /api/students/complete-module
{ "studentAddress": "0x742d...", "courseId": 0, "moduleId": 0 }

# 4. Submit quiz
POST /api/students/quiz
{ "studentAddress": "0x742d...", "courseId": 0, "answers": {"0": 1, "1": 1, "2": 1} }

# 5. Mint certificate
POST /api/certificates/mint
{ "studentAddress": "0x742d...", "courseId": 0, "studentName": "John Doe" }
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd pod-blockchain-nft

# Install dependencies
cd apps/web
npm install

# Set up environment variables
# Edit .env with your WalletConnect Project ID
# Get one free at https://cloud.walletconnect.com

# Start development server
npm run dev
```

The app will be running at **http://localhost:3000**

### Running API Tests

```powershell
# Run the full API test suite (19 tests)
powershell -ExecutionPolicy Bypass -File apps/web/test-api.ps1
```

### Deploy Smart Contract

```bash
# Deploy to Arbitrum Sepolia testnet
npm run deploy:sepolia

# Deploy to Arbitrum mainnet
npm run deploy:mainnet
```

---

## 📁 Project Structure

```
pod-blockchain-nft/
├── apps/
│   └── web/                          # Next.js 14 Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/              # REST API Routes
│       │   │   │   ├── health/       # Health check endpoint
│       │   │   │   ├── courses/      # Course CRUD
│       │   │   │   ├── students/     # Enrollment, modules, quiz
│       │   │   │   └── certificates/ # NFT minting & listing
│       │   │   ├── course-nft/       # Main application page
│       │   │   │   ├── page.tsx      # Full-featured course NFT UI
│       │   │   │   └── course-nft.css# Premium dark theme CSS
│       │   │   ├── page.tsx          # Landing page
│       │   │   ├── layout.tsx        # Root layout
│       │   │   └── providers.tsx     # wagmi + RainbowKit providers
│       │   ├── components/           # Reusable components
│       │   ├── lib/                  # Utilities & configs
│       │   │   ├── course-nft/abi.ts # Smart contract ABI
│       │   │   ├── wagmi.ts          # wagmi configuration
│       │   │   └── chains.ts         # Supported chain config
│       │   └── types/                # TypeScript types
│       ├── test-api.ps1              # API test suite
│       └── package.json
├── contracts/
│   ├── course-nft/
│   │   └── CourseCompletionNFT.sol   # Soulbound NFT contract
│   └── erc721/                       # Standard ERC-721 (Rust/Stylus)
├── scripts/                          # Deployment scripts
│   ├── deploy-sepolia.sh
│   ├── deploy-mainnet.sh
│   └── deploy-erc721.ts
├── docs/                             # Documentation
└── README.md
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | Server-side rendering, file-based routing |
| **Styling** | Custom CSS (Glassmorphism) | Premium dark theme with animations |
| **Web3** | wagmi v2 + viem | Type-safe Ethereum interactions |
| **Wallet** | RainbowKit v2 | Beautiful wallet connection modal |
| **Smart Contract** | Solidity ^0.8.20 | Soulbound ERC-721 implementation |
| **Blockchain** | Arbitrum (L2) | Low gas fees, fast finality |
| **Fonts** | Outfit + Inter + JetBrains Mono | Premium typography |
| **API** | Next.js API Routes | RESTful backend endpoints |
| **Testing** | PowerShell Test Suite | Postman-style API validation |

---

## ✨ UI Highlights

- **🌌 Aurora Mesh Gradient** — Animated multi-color gradient background
- **✨ Particle System** — Floating particle effects with glow
- **🔮 Glassmorphism** — Frosted glass cards with backdrop-filter blur
- **🎴 3D Card Hovers** — Perspective transforms on course cards
- **🌈 Holographic Certificates** — Shimmer effect on NFT certificate cards
- **🎬 Micro-animations** — Smooth transitions on every interaction
- **📊 Live Network Bar** — Simulated Arbitrum block & gas data
- **🎊 Confetti Burst** — Celebratory animation on successful minting
- **📱 Fully Responsive** — Mobile-first design with breakpoints

---

## 🔗 Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Arbitrum One | 42161 | ✅ Mainnet |
| Arbitrum Sepolia | 421614 | ✅ Testnet |
| Ethereum Mainnet | 1 | ✅ Supported |
| Sepolia | 11155111 | ✅ Testnet |

---

## 🧪 Testing

All 19 API tests pass covering the complete certification flow:

```
✅ Health Check
✅ List All Courses (4 courses)
✅ Get Course by ID
✅ Course Not Found (404)
✅ Student Enrollment
✅ Duplicate Enrollment Prevention (409)
✅ Get Student Enrollments
✅ Complete Modules 0-4 (5 tests)
✅ Duplicate Module Prevention (409)
✅ Module Progress Check (100%)
✅ Quiz — Wrong Answers (0%)
✅ Quiz — Correct Answers (100%)
✅ Mint Certificate NFT
✅ Duplicate Mint Prevention (409)
✅ Get All Certificates
✅ Get Student Certificates
✅ Mint Without Enrollment (403)
✅ Create New Course
✅ Verify Course List Updated
```

---

## 👥 Team

Built with ❤️ for the Blockchain Hackathon

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>🎓 CertChain — Your achievements, forever on-chain.</strong>
</p>

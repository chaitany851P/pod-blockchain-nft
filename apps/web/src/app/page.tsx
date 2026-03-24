'use client';

import Link from 'next/link';
import { WalletButton } from '@/components/wallet-button';

const FEATURES = [
  { icon: '🔒', label: 'Soulbound', desc: 'Non-transferable, tied to your identity' },
  { icon: '⛓️', label: 'On-Chain', desc: 'Stored permanently on Arbitrum' },
  { icon: '✅', label: 'Verifiable', desc: 'Instantly provable by anyone' },
  { icon: '♾️', label: 'Permanent', desc: 'Survives beyond institutions' },
];

const TECH = ['Next.js 14', 'Solidity', 'Arbitrum', 'ERC-721', 'wagmi', 'RainbowKit'];

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
      background: '#030306',
      color: '#f0f0f8',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 50% at 30% 40%, rgba(0,212,255,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 20%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 80%, rgba(34,197,94,0.04) 0%, transparent 60%)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 70%)',
      }} />

      <div style={{ maxWidth: 780, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Hackathon Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', marginBottom: 14,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(139,92,246,0.08))',
          border: '1px solid rgba(0,212,255,0.12)',
          borderRadius: 100, fontSize: 11, color: '#00d4ff', fontWeight: 600, letterSpacing: 0.5,
        }}>
          🏆 Blockchain Hackathon Project
        </div>

        {/* Badge */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 28,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
            borderRadius: 100, fontSize: 13, color: '#00d4ff', fontWeight: 600, letterSpacing: 0.5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff', boxShadow: '0 0 8px #00d4ff', animation: 'blink 2s ease-in-out infinite' }} />
            Web3 Learning Platform
          </div>
        </div>

        <h1 style={{
          fontSize: 'clamp(44px, 6vw, 72px)',
          fontWeight: 900, lineHeight: 1.08, letterSpacing: -3, marginBottom: 20,
          fontFamily: "'Outfit', sans-serif",
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 40%, #22c55e 80%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>CertChain</span>
        </h1>
        <p style={{
          fontSize: 19, color: '#a0a0be', lineHeight: 1.7, marginBottom: 32, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto',
        }}>
          Earn verifiable, soulbound NFT certificates by completing blockchain courses. Your achievements — forever on‑chain, impossible to fake.
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          {FEATURES.map((f) => (
            <div key={f.label} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 100, fontSize: 13, color: '#a0a0be',
              backdropFilter: 'blur(10px)',
            }}>
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
          <WalletButton />
        </div>

        {/* Main CTA Card */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 640, margin: '0 auto' }}>
          <Link
            href="/course-nft"
            style={{
              position: 'relative', display: 'block', padding: 32, borderRadius: 22, textDecoration: 'none',
              background: 'rgba(14,14,24,0.7)', border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(20px)', textAlign: 'left', color: 'inherit',
              transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00d4ff';
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 24px 64px rgba(0,0,0,0.5), 0 0 50px rgba(0,212,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #00d4ff, #8b5cf6, transparent)',
              opacity: 0.5,
            }} />
            <span style={{ fontSize: 40, marginBottom: 16, display: 'block' }}>🎓</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
              Course Completion NFTs
            </h2>
            <p style={{ fontSize: 14, color: '#a0a0be', lineHeight: 1.7, marginBottom: 16 }}>
              Complete courses, pass quizzes, and mint verifiable soulbound NFT certificates on-chain. Full end-to-end certification.
            </p>
            <span style={{
              display: 'inline-block', fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #00d4ff, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Launch App →
            </span>
          </Link>

          <div
            style={{
              position: 'relative', padding: 32, borderRadius: 22,
              background: 'rgba(14,14,24,0.4)', border: '1px solid rgba(255,255,255,0.04)',
              textAlign: 'left', opacity: 0.5,
            }}
          >
            <span style={{ fontSize: 40, marginBottom: 16, display: 'block' }}>🔗</span>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, fontFamily: "'Outfit', sans-serif" }}>
              ERC-721 NFTs
            </h2>
            <p style={{ fontSize: 14, color: '#a0a0be', lineHeight: 1.7, marginBottom: 16 }}>
              Mint and manage standard ERC-721 NFT collections with full metadata support.
            </p>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#5e5e78',
              textTransform: 'uppercase' as const, letterSpacing: 1.5,
            }}>
              Coming Soon
            </span>
          </div>
        </div>

        {/* Tech Stack */}
        <div style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: '#5e5e78', fontWeight: 600 }}>
            Built With
          </span>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {TECH.map((t) => (
              <span key={t} style={{
                padding: '5px 14px',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 100, fontSize: 12, color: '#5e5e78', fontWeight: 500,
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
import type { Metadata } from 'next';
import './course-nft.css';

export const metadata: Metadata = {
  title: 'CertChain — Course Completion NFT Certificates',
  description:
    'Complete courses and mint verifiable, soulbound NFT certificates on the blockchain. Your achievements, permanently on-chain.',
};

export default function CourseNFTLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { http, createConfig, cookieStorage, createStorage } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { chains } from './chains';

// Get a free project ID at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo_project_id';


export const wagmiConfig = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'My DApp',
  projectId,
  chains: chains,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});


declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
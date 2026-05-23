'use client';

import { FileSystemProvider } from '@/context/FileSystemContext';
import { ExplorerLayout } from '@/components/ExplorerLayout';

export default function Home() {
  return (
    <FileSystemProvider>
      <ExplorerLayout />
    </FileSystemProvider>
  );
}

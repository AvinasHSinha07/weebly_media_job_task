'use client';

import React, { createContext, useContext } from 'react';
import { FileSystemItem, ItemType } from '@/types';
import { useFileSystemLogic } from '@/hooks/use-file-system-logic';

interface FileSystemContextType {
  items: FileSystemItem[];
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  addItem: (parentId: string | null, name: string, type: ItemType) => void;
  renameItem: (id: string, newName: string) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newParentId: string | null) => void;
  updateFileContent: (id: string, content: string) => void;
  editingFileId: string | null;
  setEditingFileId: (id: string | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fileSystemLogic = useFileSystemLogic();

  return (
    <FileSystemContext.Provider value={fileSystemLogic}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (context === undefined) {
    throw new Error('useFileSystem must be used within a FileSystemProvider');
  }
  return context;
};
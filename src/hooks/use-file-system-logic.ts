'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileSystemItem, ItemType } from '@/types';
import toast from 'react-hot-toast';

const LOCAL_STORAGE_KEY = 'mini-file-explorer';

const MOCK_DATA: FileSystemItem[] = [
  { id: '1', name: 'Documents', type: 'folder', parentId: null, createdAt: Date.now() - 100000, updatedAt: Date.now() - 50000 },
  { id: '2', name: 'Wallpapers', type: 'folder', parentId: null, createdAt: Date.now() - 200000, updatedAt: Date.now() - 100000 },
  { id: '3', name: 'Projects', type: 'folder', parentId: '1', createdAt: Date.now() - 80000, updatedAt: Date.now() - 20000 },
  { id: '4', name: 'README.md', type: 'file', parentId: '1', content: '# Welcome to Mini File Explorer\n\nThis is a premium file explorer built with Next.js, Tailwind CSS, and Context API.', createdAt: Date.now() - 90000, updatedAt: Date.now() - 10000 },
  { id: '4_1', name: 'notes.txt', type: 'file', parentId: '1', content: 'These are some important notes.\n\n- Buy milk\n- Finish the React task\n- Prepare for interview', createdAt: Date.now() - 85000, updatedAt: Date.now() - 15000 },
  { id: '5', name: 'mountain.jpg', type: 'file', parentId: '2', content: 'https://picsum.photos/seed/mountain/1920/1080', createdAt: Date.now() - 150000, updatedAt: Date.now() - 150000 },
  { id: '5_2', name: 'ocean.jpg', type: 'file', parentId: '2', content: 'https://picsum.photos/seed/ocean/1920/1080', createdAt: Date.now() - 140000, updatedAt: Date.now() - 140000 },
  { id: '5_3', name: 'forest.jpg', type: 'file', parentId: '2', content: 'https://picsum.photos/seed/forest/1920/1080', createdAt: Date.now() - 130000, updatedAt: Date.now() - 130000 },
  { id: '5_4', name: 'city.png', type: 'file', parentId: '2', content: 'https://picsum.photos/seed/city/1920/1080', createdAt: Date.now() - 120000, updatedAt: Date.now() - 120000 },
  { id: '6', name: 'Next.js App', type: 'folder', parentId: '3', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '7', name: 'package.json', type: 'file', parentId: '6', content: '{\n  "name": "mini-explorer",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.2.0"\n  }\n}', createdAt: Date.now(), updatedAt: Date.now() },
  { id: '8', name: 'page.tsx', type: 'file', parentId: '6', content: 'export default function Page() {\n  return <div>Hello World</div>;\n}', createdAt: Date.now() - 1000, updatedAt: Date.now() },
  { id: '9', name: 'globals.css', type: 'file', parentId: '6', content: '@tailwind base;\n@tailwind components;\n@tailwind utilities;', createdAt: Date.now() - 2000, updatedAt: Date.now() },
];


export function useFileSystemLogic() {
  const [items, setItems] = useState<FileSystemItem[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        setItems(MOCK_DATA);
      }
    } else {
      setItems(MOCK_DATA);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addItem = useCallback((parentId: string | null, name: string, type: ItemType) => {
    const nameTrimmed = name.trim();
    if (!nameTrimmed) return;
    
    setItems((prev) => {
      const isDuplicate = prev.some((item) => item.parentId === parentId && item.name === nameTrimmed && item.type === type);
      if (isDuplicate) {
        toast.error(`A ${type} with this name already exists here.`);
        return prev;
      }
      return [
        ...prev,
        {
          id: generateId(),
          name: nameTrimmed,
          type,
          parentId,
          content: type === 'file' ? '' : undefined,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];
    });
  }, []);

  const renameItem = useCallback((id: string, newName: string) => {
    const nameTrimmed = newName.trim();
    if (!nameTrimmed) return;

    setItems((prev) => {
      const target = prev.find(i => i.id === id);
      if (!target) return prev;
      
      const isDuplicate = prev.some((item) => item.parentId === target.parentId && item.name === nameTrimmed && item.type === target.type && item.id !== id);
      if (isDuplicate) {
        toast.error(`An item with this name already exists here.`);
        return prev;
      }
      return prev.map((item) =>
        item.id === id ? { ...item, name: nameTrimmed, updatedAt: Date.now() } : item
      );
    });
  }, []);

  const moveItem = useCallback((id: string, newParentId: string | null) => {
    setItems((prev) => {
      const targetItem = prev.find(i => i.id === id);
      if (!targetItem || targetItem.parentId === newParentId) return prev;
      
      if (targetItem.type === 'folder') {
        let currentParent = newParentId;
        while (currentParent !== null) {
          if (currentParent === id) {
            toast.error('Cannot move a folder into itself or its own subfolder.');
            return prev;
          }
          const parentItem = prev.find(i => i.id === currentParent);
          currentParent = parentItem ? parentItem.parentId : null;
        }
      }

      const isDuplicate = prev.some((item) => item.parentId === newParentId && item.name === targetItem.name && item.type === targetItem.type && item.id !== id);
      if (isDuplicate) {
        toast.error(`An item with the name "${targetItem.name}" already exists in the destination folder.`);
        return prev;
      }
      
      return prev.map((item) =>
        item.id === id ? { ...item, parentId: newParentId, updatedAt: Date.now() } : item
      );
    });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => {
      const itemsToDelete = new Set<string>([id]);
      
      let added = true;
      while (added) {
        added = false;
        prev.forEach(item => {
          if (item.parentId && itemsToDelete.has(item.parentId) && !itemsToDelete.has(item.id)) {
            itemsToDelete.add(item.id);
            added = true;
          }
        });
      }
      
      return prev.filter((item) => !itemsToDelete.has(item.id));
    });

    setActiveFolderId((prevId) => {
      if (prevId === id) return null;
      return prevId;
    });
    
    setEditingFileId(prevId => prevId === id ? null : prevId);

  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === 'file' ? { ...item, content, updatedAt: Date.now() } : item
      )
    );
  }, []);

  useEffect(() => {
    if (activeFolderId) {
      const isValid = items.some(i => i.id === activeFolderId);
      if (!isValid) {
        setActiveFolderId(null);
      }
    }
  }, [items, activeFolderId]);

  return {
    items,
    activeFolderId,
    setActiveFolderId,
    addItem,
    renameItem,
    deleteItem,
    moveItem,
    updateFileContent,
    editingFileId,
    setEditingFileId,
    isSidebarOpen,
    setIsSidebarOpen,
  };
}

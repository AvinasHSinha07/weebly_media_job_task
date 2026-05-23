'use client';

import React, { useMemo } from 'react';
import { Folder } from 'lucide-react';
import { useFileSystem } from '@/context/FileSystemContext';
import { getFileIcon } from '@/lib/icons';
import { FileSystemItem } from '@/types';

interface SidebarSearchResultsProps {
  searchQuery: string;
  onItemClick: (item: FileSystemItem) => void;
}

export function SidebarSearchResults({ searchQuery, onItemClick }: SidebarSearchResultsProps) {
  const { items } = useFileSystem();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return items
      .filter((i) => i.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, searchQuery]);

  if (!searchQuery.trim()) return null;

  return (
    <div className="px-2">
      <div className="px-2 pb-2 text-[10px] font-bold text-gray-400 mt-2 tracking-wider">SEARCH RESULTS</div>
      {searchResults.length === 0 ? (
        <div className="px-2 text-xs text-gray-500 py-2">No items found.</div>
      ) : (
        <ul className="flex flex-col w-full">
          {searchResults.map((item) => (
            <li key={item.id} className="w-full">
              <div
                className="flex items-center gap-2 py-1.5 px-2 mx-1 cursor-pointer transition-all duration-200 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => onItemClick(item)}
              >
                {item.type === 'folder' ? (
                  <Folder className="w-4 h-4 text-brand-medium shrink-0" />
                ) : (
                  getFileIcon(item.name, 'w-4 h-4 text-gray-400 shrink-0')
                )}
                <span className="truncate flex-1">{item.name}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

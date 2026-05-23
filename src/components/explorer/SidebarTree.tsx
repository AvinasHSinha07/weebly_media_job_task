'use client';

import React from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarTreeProps {
  parentId: string | null;
  depth: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string, e: React.MouseEvent) => void;
}

export function SidebarTree({
  parentId = null,
  depth = 0,
  expandedFolders,
  toggleFolder,
}: SidebarTreeProps) {
  const { items, activeFolderId, setActiveFolderId } = useFileSystem();

  const folders = items
    .filter((item) => item.parentId === parentId && item.type === 'folder')
    .sort((a, b) => a.name.localeCompare(b.name));

  if (folders.length === 0) return null;

  return (
    <ul className="flex flex-col w-full">
      {folders.map((folder) => {
        const isExpanded = expandedFolders.has(folder.id);
        const isActive = activeFolderId === folder.id;
        const hasChildren = items.some((i) => i.parentId === folder.id && i.type === 'folder');

        return (
          <li key={folder.id} className="w-full">
            <div
              className={cn(
                'flex items-center gap-1.5 py-1.5 pr-3 cursor-pointer group transition-all duration-200 rounded-md my-0.5',
                isActive ? 'bg-brand-lightest text-brand-dark font-medium' : 'text-gray-600 hover:bg-gray-100',
                depth === 0 ? 'pl-2' : ''
              )}
              style={{ paddingLeft: `${depth + 0.5}rem` }}
              onClick={() => setActiveFolderId(folder.id)}
            >
              <div
                className={cn('p-0.5 rounded-sm hover:bg-gray-200 transition-colors', !hasChildren && 'opacity-0 cursor-default')}
                onClick={(e) => (hasChildren ? toggleFolder(folder.id, e) : e.stopPropagation())}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
              {isExpanded ? (
                <FolderOpen className={cn('w-4 h-4', isActive ? 'text-brand-dark' : 'text-brand-medium')} />
              ) : (
                <Folder className={cn('w-4 h-4 fill-current', isActive ? 'text-brand-dark' : 'text-brand-medium')} />
              )}
              <span className="truncate text-sm flex-1">{folder.name}</span>
            </div>
            {isExpanded && (
              <SidebarTree
                parentId={folder.id}
                depth={depth + 1}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

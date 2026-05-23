'use client';

import React from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarTreeProps {
  parentId: string | null;
  depth: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string, e: React.MouseEvent) => void;
  dragOverId?: string | null;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent, id: string) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

export function SidebarTree({
  parentId = null,
  depth = 0,
  expandedFolders,
  toggleFolder,
  dragOverId,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: SidebarTreeProps) {
  const { items, activeFolderId, setActiveFolderId, setEditingFileId, editingFileId } = useFileSystem();

  const treeItems = items
    .filter((item) => item.parentId === parentId)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  if (treeItems.length === 0) return null;

  return (
    <ul className="flex flex-col w-full">
      {treeItems.map((item) => {
        const isFolder = item.type === 'folder';
        const isExpanded = expandedFolders.has(item.id);
        const isActive = isFolder ? activeFolderId === item.id : editingFileId === item.id;
        const hasChildren = isFolder && items.some((i) => i.parentId === item.id);

        return (
          <li key={item.id} className="w-full">
            <div
              draggable
              onDragStart={(e) => onDragStart?.(e, item.id)}
              onDragOver={isFolder ? (e) => onDragOver?.(e, item.id) : undefined}
              onDragLeave={isFolder ? onDragLeave : undefined}
              onDrop={isFolder ? (e) => onDrop?.(e, item.id) : undefined}
              className={cn(
                'flex items-center gap-1.5 py-1.5 pr-3 cursor-pointer group transition-all duration-200 rounded-md my-0.5',
                isActive ? 'bg-brand-lightest text-brand-dark font-medium' : 'text-gray-600 hover:bg-gray-100',
                dragOverId === item.id && 'ring-2 ring-brand-light ring-inset',
                depth === 0 ? 'pl-2' : ''
              )}
              style={{ paddingLeft: `${depth + 0.5}rem` }}
              onClick={() => isFolder ? setActiveFolderId(item.id) : setEditingFileId(item.id)}
            >
              <div
                className={cn('p-0.5 rounded-sm hover:bg-gray-200 transition-colors', (!isFolder || !hasChildren) && 'opacity-0 cursor-default')}
                onClick={(e) => (isFolder && hasChildren ? toggleFolder(item.id, e) : e.stopPropagation())}
              >
                {isFolder && (isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                ))}
              </div>
              
              {isFolder ? (
                isExpanded ? (
                  <FolderOpen className={cn('w-4 h-4', isActive ? 'text-brand-dark' : 'text-brand-medium')} />
                ) : (
                  <Folder className={cn('w-4 h-4 fill-current', isActive ? 'text-brand-dark' : 'text-brand-medium')} />
                )
              ) : (
                <FileText className={cn('w-4 h-4', isActive ? 'text-brand-dark' : 'text-gray-400')} />
              )}
              
              <span className="truncate text-sm flex-1">{item.name}</span>
            </div>
            {isFolder && isExpanded && (
              <SidebarTree
                parentId={item.id}
                depth={depth + 1}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                dragOverId={dragOverId}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

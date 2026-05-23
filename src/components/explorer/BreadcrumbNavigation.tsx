'use client';

import React, { useMemo } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { ChevronRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileSystemItem } from '@/types';

interface BreadcrumbNavigationProps {
  dragOverId: string | null;
  onDragOver: (e: React.DragEvent, folderId: string | null) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, folderId: string | null) => void;
}

export function BreadcrumbNavigation({
  dragOverId,
  onDragOver,
  onDragLeave,
  onDrop,
}: BreadcrumbNavigationProps) {
  const { items, activeFolderId, setActiveFolderId, isSidebarOpen, setIsSidebarOpen } = useFileSystem();

  const breadcrumbs = useMemo(() => {
    const crumbs: FileSystemItem[] = [];
    let currentId = activeFolderId;
    while (currentId !== null) {
      const folder = items.find((i) => i.id === currentId);
      if (folder) {
        crumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return crumbs;
  }, [items, activeFolderId]);

  return (
    <div className="flex items-center gap-1 overflow-x-auto flex-1 no-scrollbar">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 text-gray-500 md:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 text-gray-500 hidden md:flex shrink-0"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      <div className="w-px h-4 bg-gray-200 mx-2 shrink-0 hidden md:block" />

      <div
        className={cn(
          'text-gray-500 hover:text-brand-dark cursor-pointer text-sm font-medium transition-colors rounded px-2 py-1 border border-transparent shrink-0',
          dragOverId === null ? 'bg-brand-lightest text-brand-dark border-brand-light' : ''
        )}
        onClick={() => setActiveFolderId(null)}
        onDragOver={(e) => onDragOver(e, null)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, null)}
      >
        Root
      </div>
      
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={crumb.id}>
          <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
          <div
            className={cn(
              'text-sm hover:text-brand-dark cursor-pointer transition-colors max-w-[120px] truncate rounded px-2 py-1 border border-transparent shrink-0',
              idx === breadcrumbs.length - 1 ? 'font-semibold text-brand-dark' : 'font-medium text-gray-500',
              dragOverId === crumb.id ? 'bg-brand-lightest text-brand-dark border-brand-light' : ''
            )}
            onClick={() => setActiveFolderId(crumb.id)}
            onDragOver={(e) => onDragOver(e, crumb.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, crumb.id)}
          >
            {crumb.name}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

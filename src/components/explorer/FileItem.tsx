'use client';

import React from 'react';
import { Folder, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileSystemItem } from '@/types';
import { getFileIcon } from '@/lib/icons';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

interface FileItemProps {
  item: FileSystemItem;
  viewMode: 'grid' | 'list';
  isDragOver: boolean;
  onClick: (item: FileSystemItem) => void;
  onRename: (item: FileSystemItem) => void;
  onDelete: (item: FileSystemItem) => void;
  onDragStart: (e: React.DragEvent, item: FileSystemItem) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function FileItem({
  item,
  viewMode,
  isDragOver,
  onClick,
  onRename,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
}: FileItemProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            'group transition-all duration-200 cursor-pointer focus-within:outline-none border',
            isDragOver ? 'border-brand-light bg-brand-lightest shadow-sm scale-[1.02]' : 'border-transparent',
            viewMode === 'grid'
              ? 'flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-brand-lightest/50 hover:border-brand-light/30 text-center focus-within:ring-2 focus-within:ring-brand-light'
              : 'grid grid-cols-[1fr,auto] sm:grid-cols-[1fr,120px,100px] gap-4 items-center px-4 py-2 rounded-md hover:bg-gray-50 focus-within:bg-gray-50'
          )}
          onClick={() => onClick(item)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onClick(item);
          }}
          draggable
          onDragStart={(e) => onDragStart(e, item)}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {viewMode === 'grid' ? (
            <>
              <div className="w-12 h-12 flex items-center justify-center shrink-0 relative">
                {item.type === 'folder' ? (
                  <Folder
                    className="w-full h-full text-brand-medium fill-brand-medium/20 group-hover:fill-brand-medium/40 transition-colors"
                    strokeWidth={1.5}
                  />
                ) : item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) && item.content?.startsWith('http') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.content}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md shadow-sm border border-gray-100"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  getFileIcon(item.name, 'w-full h-full text-gray-400 group-hover:text-brand-dark transition-colors')
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 w-full truncate px-1 group-hover:text-brand-dark transition-colors">
                {item.name}
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 relative">
                  {item.type === 'folder' ? (
                    <Folder className="w-full h-full text-brand-medium fill-brand-medium/20" strokeWidth={1.5} />
                  ) : item.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) && item.content?.startsWith('http') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.content}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-sm shadow-sm border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getFileIcon(item.name, 'w-full h-full text-gray-400')
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 truncate group-hover:text-brand-dark transition-colors">
                  {item.name}
                </span>
              </div>
              <div className="text-xs text-gray-500 text-right hidden sm:block whitespace-nowrap">
                {new Date(item.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              <div className="text-xs text-gray-500 text-right whitespace-nowrap">
                {item.type === 'folder'
                  ? '--'
                  : item.content?.length
                  ? item.content.length < 1024
                    ? `${item.content.length} B`
                    : `${(item.content.length / 1024).toFixed(1)} KB`
                  : '0 B'}
              </div>
            </>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48 shadow-lg border-gray-100 rounded-xl overflow-hidden glassmorphism">
        <ContextMenuItem
          onClick={() => onClick(item)}
          className="cursor-pointer gap-2 focus:bg-brand-lightest focus:text-brand-dark"
        >
          {item.type === 'folder' ? <Folder className="w-4 h-4" /> : getFileIcon(item.name, 'w-4 h-4')}
          Open
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => onRename(item)}
          className="cursor-pointer gap-2 focus:bg-brand-lightest focus:text-brand-dark"
        >
          <Edit2 className="w-4 h-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuSeparator className="bg-gray-100" />
        <ContextMenuItem
          onClick={() => onDelete(item)}
          className="cursor-pointer gap-2 focus:bg-red-50 focus:text-red-600 text-red-500"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

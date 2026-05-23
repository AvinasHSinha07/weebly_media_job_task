'use client';

import React, { useMemo, useState } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { Folder, FolderPlus, FilePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileSystemItem } from '@/types';
import { CreateItemModal, RenameItemModal, DeleteConfirmModal } from './Modals';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import { BreadcrumbNavigation } from './explorer/BreadcrumbNavigation';
import { ActionBar, SortOption, SortDirection, ViewMode } from './explorer/ActionBar';
import { FileItem } from './explorer/FileItem';

export function MainPanel() {
  const { items, activeFolderId, addItem, deleteItem, renameItem, setEditingFileId, moveItem, setActiveFolderId } = useFileSystem();
  
  const [createModal, setCreateModal] = useState<{isOpen: boolean, type: 'file' | 'folder'}>({ isOpen: false, type: 'folder' });
  const [renameModal, setRenameModal] = useState<{isOpen: boolean, initialName: string, id: string | null}>({ isOpen: false, initialName: '', id: null });
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, item: FileSystemItem | null}>({ isOpen: false, item: null });
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleDragStart = (e: React.DragEvent, item: FileSystemItem) => {
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== folderId) {
      setDragOverId(folderId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverId(null);
  };

  const handleDropOnFolder = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    setDragOverId(null);
    const itemId = e.dataTransfer.getData('text/plain');
    if (!itemId) return;
    moveItem(itemId, targetFolderId);
  };

  const currentItems = useMemo(() => {
    const folderItems = items.filter(i => i.parentId === activeFolderId);
    
    return folderItems.sort((a, b) => {
      let comp = 0;
      if (sortOption === 'name') {
        comp = a.name.localeCompare(b.name);
      } else if (sortOption === 'date') {
        comp = a.updatedAt - b.updatedAt;
      } else if (sortOption === 'size') {
        const sizeA = a.type === 'file' ? (a.content?.length || 0) : 0;
        const sizeB = b.type === 'file' ? (b.content?.length || 0) : 0;
        comp = sizeA - sizeB;
      }
      
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      
      return sortDirection === 'asc' ? comp : -comp;
    });
  }, [items, activeFolderId, sortOption, sortDirection]);

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setActiveFolderId(item.id);
    } else {
      setEditingFileId(item.id);
    }
  };

  const handleRenameSubmit = (newName: string) => {
    if (renameModal.id) {
      renameItem(renameModal.id, newName);
    }
  };

  const activeFolder = activeFolderId ? items.find(i => i.id === activeFolderId) : null;
  const sizeEstimate = useMemo(() => {
    let size = 0;
    currentItems.forEach(item => {
      if (item.type === 'file') {
        size += item.content?.length || 0;
      }
    });
    if (size === 0) return '0 B';
    if (size < 1024) return `${size} B`;
    return `${(size / 1024).toFixed(1)} KB`;
  }, [currentItems]);

  const lastModified = activeFolder ? new Date(activeFolder.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A';

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-white sticky top-0 z-10 justify-between">
        <BreadcrumbNavigation 
          dragOverId={dragOverId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDropOnFolder}
        />
        
        <ActionBar
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      <ContextMenu>
        <ContextMenuTrigger className="flex-1 overflow-y-auto p-6 focus:outline-none min-h-0 bg-transparent flex flex-col">
          {currentItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Folder className="w-16 h-16 mb-4 text-brand-light opacity-50" />
              <p className="text-lg font-medium text-gray-600 mb-1">This folder is empty</p>
              <p className="text-sm">Right-click to create new files or folders here.</p>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 content-start" 
                : "flex flex-col gap-1 w-full"
            )}>
              {viewMode === 'list' && (
                <div className="grid grid-cols-[1fr,auto] sm:grid-cols-[1fr,120px,100px] gap-4 px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 mb-2">
                  <div>Name</div>
                  <div className="text-right hidden sm:block">Date Modified</div>
                  <div className="text-right">Size</div>
                </div>
              )}
              {currentItems.map(item => (
                <FileItem
                  key={item.id}
                  item={item}
                  viewMode={viewMode}
                  isDragOver={dragOverId === item.id}
                  onClick={handleItemClick}
                  onRename={(i) => setRenameModal({ isOpen: true, initialName: i.name, id: i.id })}
                  onDelete={(i) => setDeleteModal({ isOpen: true, item: i })}
                  onDragStart={handleDragStart}
                  onDragOver={item.type === 'folder' ? (e) => handleDragOver(e, item.id) : undefined}
                  onDragLeave={item.type === 'folder' ? handleDragLeave : undefined}
                  onDrop={item.type === 'folder' ? (e) => handleDropOnFolder(e, item.id) : undefined}
                />
              ))}
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56 shadow-lg border-gray-100 rounded-xl glassmorphism">
          <ContextMenuItem 
            onClick={() => setCreateModal({ isOpen: true, type: 'folder' })}
            className="cursor-pointer gap-2 focus:bg-brand-lightest focus:text-brand-dark"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => setCreateModal({ isOpen: true, type: 'file' })}
            className="cursor-pointer gap-2 focus:bg-brand-lightest focus:text-brand-dark"
          >
            <FilePlus className="w-4 h-4" />
            New File
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CreateItemModal 
        isOpen={createModal.isOpen} 
        onClose={() => setCreateModal(prev => ({ ...prev, isOpen: false }))} 
        type={createModal.type}
        onSubmit={(name) => addItem(activeFolderId, name, createModal.type)}
      />

      <RenameItemModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal(prev => ({ ...prev, isOpen: false, id: null }))}
        initialName={renameModal.initialName}
        onSubmit={handleRenameSubmit}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false, item: null }))}
        itemName={deleteModal.item?.name || ''}
        onConfirm={() => {
          if (deleteModal.item) deleteItem(deleteModal.item.id);
        }}
      />

      <div className="h-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between px-4 text-[11px] text-gray-500 font-medium tracking-wide shrink-0">
        <div className="flex items-center gap-4">
          <span>{currentItems.length} item{currentItems.length !== 1 ? 's' : ''}</span>
          <span>{sizeEstimate}</span>
        </div>
        <div>
          Last modified: {lastModified}
        </div>
      </div>
    </div>
  );
}

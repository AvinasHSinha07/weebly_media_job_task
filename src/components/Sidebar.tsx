'use client';

import React, { useState, useMemo } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { Folder, FileText, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileSystemItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateItemModal } from './Modals';

import { SidebarTree } from './explorer/SidebarTree';
import { SidebarSearchResults } from './explorer/SidebarSearchResults';

export function Sidebar() {
  const { items, activeFolderId, setActiveFolderId, addItem, setEditingFileId, isSidebarOpen } = useFileSystem();
  
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1']));
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'file' | 'folder' }>({ isOpen: false, type: 'folder' });
  const [searchQuery, setSearchQuery] = useState('');

  const recentFiles = useMemo(() => {
    return items.filter(i => i.type === 'file').sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5);
  }, [items]);

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      setActiveFolderId(item.id);
    } else {
      setEditingFileId(item.id);
    }
  };

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreate = (name: string) => {
    addItem(activeFolderId, name, modalState.type);
  };

  return (
    <div 
      className={cn(
        "absolute md:relative z-50 h-full bg-gray-50/95 backdrop-blur-md flex flex-col pt-4 overflow-hidden shrink-0 transition-all duration-300 shadow-2xl md:shadow-none",
        isSidebarOpen ? "translate-x-0 w-64 border-r border-gray-200" : "-translate-x-full w-64 md:w-0 md:translate-x-0 md:border-none"
      )}
    >
      <div className="px-4 pb-3 border-b border-gray-200 flex flex-col gap-3">
        <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Explorer</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-8 h-8 text-xs bg-white border-gray-200 focus-visible:ring-brand-light transition-all rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 select-none">
        {searchQuery.trim() ? (
          <SidebarSearchResults 
            searchQuery={searchQuery} 
            onItemClick={handleItemClick} 
          />
        ) : (
          <>
            {recentFiles.length > 0 && (
              <div className="px-2 mb-4">
                <div className="px-2 pb-1 text-[10px] font-bold text-gray-400 mt-2 tracking-wider ml-1">RECENT FILES</div>
                <ul className="flex flex-col w-full">
                  {recentFiles.map(file => (
                    <li key={file.id} className="w-full">
                      <div 
                        className="flex items-center gap-2 py-1.5 px-2 mx-1 cursor-pointer transition-all duration-200 rounded-md text-sm text-gray-600 hover:bg-gray-100"
                        onClick={() => handleItemClick(file)}
                      >
                        <Clock className="w-3.5 h-3.5 text-brand-light shrink-0" />
                        <span className="truncate flex-1">{file.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="px-2 pb-1 text-[10px] font-bold text-gray-400 tracking-wider ml-1 pt-2">FOLDERS</div>
            <div 
              className={cn(
                "flex items-center gap-2 py-1.5 px-2.5 mx-2 cursor-pointer transition-all duration-200 rounded-md font-medium text-sm mb-1",
                activeFolderId === null ? "bg-brand-lightest text-brand-dark" : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => setActiveFolderId(null)}
            >
              <Folder className={cn("w-4 h-4", activeFolderId === null ? "text-brand-dark fill-current" : "text-brand-medium")} />
              Root
            </div>
            <div className="px-2">
              <SidebarTree 
                parentId={null} 
                depth={0} 
                expandedFolders={expandedFolders} 
                toggleFolder={toggleFolder} 
              />
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 bg-white hover:bg-gray-50 border-gray-200 text-gray-600 transition-all duration-200"
            onClick={() => setModalState({ isOpen: true, type: 'folder' })}
          >
            <Folder className="w-3.5 h-3.5 mr-1.5" />
            New Folder
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-8 bg-white hover:bg-gray-50 border-gray-200 text-gray-600 transition-all duration-200"
            onClick={() => setModalState({ isOpen: true, type: 'file' })}
          >
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            New File
          </Button>
        </div>
      </div>

      <CreateItemModal 
        isOpen={modalState.isOpen} 
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))} 
        type={modalState.type}
        onSubmit={handleCreate}
      />
    </div>
  );
}

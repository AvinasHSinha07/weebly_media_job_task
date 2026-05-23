'use client';

import { useState, useEffect } from 'react';
import { useFileSystem } from '@/context/FileSystemContext';
import { Button } from '@/components/ui/button';
import { Save, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export function FileEditor() {
  const { items, editingFileId, setEditingFileId, updateFileContent } = useFileSystem();
  
  const [content, setContent] = useState('');
  const [isChanged, setIsChanged] = useState(false);

  const file = items.find(i => i.id === editingFileId && i.type === 'file');

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setIsChanged(false);
    }
  }, [file]);

  if (!file) return null;

  const handleSave = () => {
    if (editingFileId) {
      updateFileContent(editingFileId, content);
      setIsChanged(false);
    }
  };

  const handleClose = () => {
    if (isChanged) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (!confirmClose) return;
    }
    setEditingFileId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative z-20 animate-in slide-in-from-right-8 duration-300">
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-6 bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-brand-lightest/50 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-brand-dark" />
          </div>
          <div className="flex flex-col max-w-xs">
            <span className="font-semibold text-gray-800 truncate leading-tight">{file.name}</span>
            {isChanged && <span className="text-[10px] text-amber-500 font-medium uppercase tracking-wider">Unsaved Changes</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            size="sm"
            onClick={handleSave}
            disabled={!isChanged}
            className={cn(
              "transition-all duration-200", 
              isChanged ? "bg-brand-dark hover:bg-brand-medium text-white shadow-md shadow-brand-light/20" : "bg-gray-100 text-gray-400 opacity-50"
            )}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <div className="w-px h-6 bg-gray-200 mx-1 border-r" />
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#FAFCFF] p-6 overflow-hidden">
        {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) && content.startsWith('http') ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
             <div className="relative w-full max-w-2xl h-[60%] shrink-0">
               <Image src={content} alt={file.name} fill className="object-contain rounded-lg shadow-sm" referrerPolicy="no-referrer" />
             </div>
             <p className="text-sm text-gray-500 font-medium">Image Preview (Cannot edit image content directly)</p>
             <div className="w-full max-w-2xl">
               <span className="text-xs text-gray-400 uppercase tracking-wider mb-2 block">Image Source URL</span>
               <Textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setIsChanged(e.target.value !== (file.content || ''));
                  }}
                  className="w-full h-16 resize-none p-3 text-gray-700 leading-relaxed focus-visible:ring-1 focus-visible:ring-brand-light/50 border-gray-200 rounded-xl shadow-sm bg-gray-50 font-mono text-xs"
                  spellCheck={false}
                />
             </div>
          </div>
        ) : (
          <Textarea
            autoFocus
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setIsChanged(e.target.value !== (file.content || ''));
            }}
            placeholder="Start typing..."
            className="w-full h-full resize-none p-6 text-gray-700 leading-relaxed focus-visible:ring-1 focus-visible:ring-brand-light/50 border-gray-200 rounded-xl shadow-sm bg-white font-mono text-sm"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}

'use client';
import { useFileSystem } from '@/context/FileSystemContext';
import { Sidebar } from '@/components/Sidebar';
import { MainPanel } from '@/components/MainPanel';
import { FileEditor } from '@/components/FileEditor';

export function ExplorerLayout() {
  const { editingFileId, isSidebarOpen, setIsSidebarOpen } = useFileSystem();

  return (
    <div className="flex w-full h-screen bg-[#F6F8FA] overflow-hidden text-gray-900 font-sans selection:bg-brand-lightest selection:text-brand-dark relative">
 
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden bg-white shadow-[-8px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 md:m-1 md:rounded-l-xl border border-gray-200/60 ring-1 ring-gray-100/50">
        {editingFileId ? (
          <FileEditor />
        ) : (
          <MainPanel />
        )}
      </div>
    </div>
  );
}

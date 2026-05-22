import { 
  FileJson, 
  Image as ImageIcon, 
  FileCode, 
  FileText, 
  File,
  FileVideo,
  FileAudio,
  FileArchive,
  FileSpreadsheet
} from 'lucide-react';
import React from 'react';

export const getFileIcon = (name: string, className?: string) => {
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'json': 
      return <FileJson className={className} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
    case 'webp': 
    case 'ico':
      return <ImageIcon className={className} />;
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
    case 'html':
    case 'css': 
    case 'scss':
    case 'less':
      return <FileCode className={className} />;
    case 'txt':
    case 'md':
    case 'pdf':
      return <FileText className={className} />;
    case 'csv': 
    case 'xls':
    case 'xlsx':
      return <FileSpreadsheet className={className} />;
    case 'mp4':
    case 'webm':
    case 'mkv':
    case 'avi':
    case 'mov':
      return <FileVideo className={className} />;
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
      return <FileAudio className={className} />;
    case 'zip':
    case 'tar':
    case 'gz':
    case 'rar':
    case '7z':
      return <FileArchive className={className} />;
    default: 
      return <File className={className} />;
  }
};

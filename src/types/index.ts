export type ItemType = 'folder' | 'file';

export interface FileSystemItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null; 
  content?: string; 
  createdAt: number;
  updatedAt: number;
}

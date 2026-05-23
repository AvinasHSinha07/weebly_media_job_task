'use client';

import React, { useState, useEffect } from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BaseModal } from '@/components/ui/base-modal';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'file' | 'folder';
  onSubmit: (name: string) => void;
}

export function CreateItemModal({ isOpen, onClose, type, onSubmit }: CreateModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create New ${type === 'folder' ? 'Folder' : 'File'}`}
      description={`Enter a name for the new ${type}.`}
    >
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Input
            id="name"
            placeholder={`${type === 'folder' ? 'New Folder' : 'new-file.txt'}`}
            className="col-span-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-dark hover:bg-brand-medium text-white transition-colors duration-200">
            Create
          </Button>
        </DialogFooter>
      </form>
    </BaseModal>
  );
}

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onSubmit: (newName: string) => void;
}

export function RenameItemModal({ isOpen, onClose, initialName, onSubmit }: RenameModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && name.trim() !== initialName) {
      onSubmit(name.trim());
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rename Item"
      description="Enter a new name for this item."
    >
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Input
            id="name"
            className="col-span-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-brand-dark hover:bg-brand-medium text-white transition-colors duration-200">
            Save
          </Button>
        </DialogFooter>
      </form>
    </BaseModal>
  );
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, onClose, itemName, onConfirm }: DeleteConfirmModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      isDestructive
      title="Confirm Deletion"
      description={
        <>
          Are you sure you want to delete <span className="font-medium text-gray-900">&quot;{itemName}&quot;</span>? 
          If it is a folder, this will permanently remove all files and subfolders inside it. This action cannot be undone.
        </>
      }
    >
      <DialogFooter className="mt-4 gap-2 sm:gap-0">
        <Button type="button" variant="outline" onClick={onClose} className="transition-colors hover:bg-gray-100">
          Cancel
        </Button>
        <Button 
          type="button" 
          variant="destructive"
          className="transition-colors"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogFooter>
    </BaseModal>
  );
}

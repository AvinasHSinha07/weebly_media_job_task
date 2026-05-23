'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  isDestructive?: boolean;
}

export function BaseModal({ isOpen, onClose, title, description, children, isDestructive }: BaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-sm bg-white/95">
        <DialogHeader>
          <DialogTitle 
            className={cn(isDestructive ? 'text-red-600 font-semibold tracking-tight' : 'text-brand-dark')}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className={cn(isDestructive ? 'text-gray-600 mt-2' : '')}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

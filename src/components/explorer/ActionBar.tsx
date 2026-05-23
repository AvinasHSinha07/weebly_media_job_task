'use client';

import React from 'react';
import { ArrowUpDown, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export type SortOption = 'name' | 'date' | 'size';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

interface ActionBarProps {
  sortOption: SortOption;
  setSortOption: (opt: SortOption) => void;
  sortDirection: SortDirection;
  setSortDirection: (dir: SortDirection) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode | ((prev: ViewMode) => ViewMode)) => void;
}

export function ActionBar({
  sortOption,
  setSortOption,
  sortDirection,
  setSortDirection,
  viewMode,
  setViewMode,
}: ActionBarProps) {
  return (
    <div className="flex items-center gap-1 shrink-0 ml-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-light">
          <ArrowUpDown className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onClick={() => setSortOption('name')}
            className={cn(sortOption === 'name' && 'bg-brand-lightest text-brand-dark')}
          >
            Name
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOption('date')}
            className={cn(sortOption === 'date' && 'bg-brand-lightest text-brand-dark')}
          >
            Date Modified
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortOption('size')}
            className={cn(sortOption === 'size' && 'bg-brand-lightest text-brand-dark')}
          >
            Size
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setSortDirection('asc')}
            className={cn(sortDirection === 'asc' && 'bg-brand-lightest text-brand-dark')}
          >
            Ascending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSortDirection('desc')}
            className={cn(sortDirection === 'desc' && 'bg-brand-lightest text-brand-dark')}
          >
            Descending
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 text-gray-500"
        onClick={() => setViewMode((prev: ViewMode) => (prev === 'grid' ? 'list' : 'grid'))}
      >
        {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
      </Button>
    </div>
  );
}

import React from 'react';
import { Button } from "@nextui-org/react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMediaQuery } from '../../hooks/useMediaQuery';

export default function SearchButton() {
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Button
      aria-label="Search"
      className="text-sm font-normal text-default-500 bg-default-100"
      endContent={!isMobile && <kbd className="bg-default-100 px-1 py-0.5 rounded">⌘ K</kbd>}
      startContent={<MagnifyingGlass size={18} />}
      variant="flat"
      isIconOnly={isMobile}
    >
      {!isMobile && "Quick search..."}
    </Button>
  );
}

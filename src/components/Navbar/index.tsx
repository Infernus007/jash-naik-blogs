import { Button } from "@nextui-org/react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { AcmeLogo } from "./Logo.tsx";
import { SearchIcon } from "./SearchIcon.tsx";
import { useDisclosure } from "@nextui-org/react";
import Modal from "../Modal/index.tsx";
import { ModeToggle } from "../MoodToggle/index.tsx";

export default function NextUINav() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <Navbar>
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4 ">
          <AcmeLogo />
          <p className="hidden sm:block font-bold text-inherit m-0">
            Lazy blogs
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        <Button
          onPress={onOpen}
          variant="bordered"
          startContent={<SearchIcon size={14} />}
        >
          Quick search
        </Button>
        <ModeToggle />
      </NavbarContent>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        key={"Quick_Search_Nav_Modal"}
      />
    </Navbar>
  );
}

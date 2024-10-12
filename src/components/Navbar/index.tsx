import { Button } from "@nextui-org/react";

import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { AcmeLogo } from "./Logo.tsx";
import { ModeToggle } from "../MoodToggle/index.tsx";

export default function NextUINav(props) {
	return (
		<Navbar
			className="w-[95%] mx-auto bg-inherit"
			isBordered
			maxWidth="full"
			position="sticky"
		>
			<NavbarContent justify="start">
				<NavbarBrand className="mr-4 ">
					<AcmeLogo />
					<p className="hidden sm:block font-bold text-inherit m-0">
						Lazy blogs
					</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent as="div" className="items-center" justify="end">
				{props.children}
				<ModeToggle />
			</NavbarContent>
		</Navbar>
	);
}

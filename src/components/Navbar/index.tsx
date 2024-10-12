import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { AcmeLogo } from "./Logo.tsx";
import { ModeToggle } from "../MoodToggle/index.tsx";

//@ts-ignore
export default function NextUINav(props) {
	return (
		<Navbar
			className="w-[95%] mx-auto bg-inherit"
			position="sticky"
			isBordered
			maxWidth="full"
		>
			<NavbarContent justify="start">
				<NavbarBrand className="mr-4 ">
					<AcmeLogo />
					<p className="hidden sm:block font-bold text-inherit m-0">
						Jash Naik
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

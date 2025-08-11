import * as React from "react";

import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Button,
} from "@nextui-org/react";

import { Moon, Sun, Airplay } from "@phosphor-icons/react";

export function ModeToggle() {
	const [theme, setThemeState] = React.useState<"light" | "dark" | "system">("system");

	React.useEffect(() => {
		const storedTheme = localStorage.getItem("theme") as "light" | "dark" | "system" | null;
		if (storedTheme) {
			setThemeState(storedTheme);
		} else {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			setThemeState(prefersDark ? "dark" : "light");
		}
	}, []);

	React.useEffect(() => {
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("theme", theme);
	}, [theme]);

	const DropdownMenuComponent = DropdownMenu as any;

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="bordered" aria-label="Toggle theme" isIconOnly>
					{theme === "dark" ? (
						<Moon />
					) : theme === "light" ? (
						<Sun />
					) : (
						<Airplay />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenuComponent aria-label="Static Actions">
				<DropdownItem key="light" onPress={() => setThemeState("light")}>
					Light
				</DropdownItem>
				<DropdownItem key="dark" onPress={() => setThemeState("dark")}>
					Dark
				</DropdownItem>
				<DropdownItem key="system" onPress={() => setThemeState("system")}>
					System
				</DropdownItem>
			</DropdownMenuComponent>
		</Dropdown>
	);
}

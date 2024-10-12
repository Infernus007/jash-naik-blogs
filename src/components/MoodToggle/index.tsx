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
	const [theme, setThemeState] = React.useState<
		"theme-light" | "dark" | "system"
	>("theme-light");

	React.useEffect(() => {
		const isDarkMode = document.documentElement.classList.contains("dark");
		setThemeState(isDarkMode ? "dark" : "theme-light");
	}, []);

	React.useEffect(() => {
		const isDark =
			theme === "dark" ||
			(theme === "system" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches);
		document.documentElement.classList[isDark ? "add" : "remove"]("dark");
	}, [theme]);

	return (
		<Dropdown>
			<DropdownTrigger>
				<Button variant="bordered" aria-label="Toggle theme" isIconOnly>
					{theme === "dark" ? (
						<Moon />
					) : theme === "theme-light" ? (
						<Sun />
					) : (
						<Airplay />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownTrigger>
			<DropdownMenu aria-label="Static Actions" className="dark:text-white">
				<DropdownItem key="light" onClick={() => setThemeState("theme-light")}>
					Light
				</DropdownItem>
				<DropdownItem key="dark" onClick={() => setThemeState("dark")}>
					Dark
				</DropdownItem>
				<DropdownItem key="system" onClick={() => setThemeState("system")}>
					System
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}

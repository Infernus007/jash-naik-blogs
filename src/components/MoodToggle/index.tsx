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
			<DropdownMenu aria-label="Static Actions" className="dark:text-white">
				<DropdownItem key="light" onClick={() => setThemeState("light")}>
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

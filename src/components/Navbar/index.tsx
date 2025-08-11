import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/react";
import { AcmeLogo } from "./Logo.tsx";
import { ModeToggle } from "../MoodToggle/index.tsx";
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

interface NextUINavProps {
  groupedBlogs: Record<string, BlogPost[]>;
  children?: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: this is to allow for additional props, including client directives
  [key: string]: any;
}

export default function NextUINav(props: NextUINavProps) {
  const { groupedBlogs, children } = props;
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	const isMobile = useMediaQuery('(max-width: 767px)');

	return (
		<Navbar 
			className="w-[95%] mx-auto bg-inherit"
			position="sticky"
			isBordered
			maxWidth="full"
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="md:hidden"
				/>
				<NavbarBrand className="mr-4" as="a" href='/'>
					<AcmeLogo />
					<p className="hidden md:block font-bold text-inherit m-0">
						Jash Naik
					</p>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent as="div" className="items-center" justify="end">
				<NavbarItem>
					{children}
				</NavbarItem>
				<NavbarItem>
					<ModeToggle />
				</NavbarItem>
			</NavbarContent>

			{isMobile && (
				<NavbarMenu>
					{Object.entries(groupedBlogs).map(([group, blogs]) => (
						<NavbarMenuItem key={group}>
							<div className="font-bold mb-2">{group}</div>
							{blogs.map((blog) => (
								<a
									key={blog.slug}
									href={`/blog/${blog.slug}`}
									className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
								>
									{blog.data.title}
								</a>
							))}
						</NavbarMenuItem>
					))}
				</NavbarMenu>
			)}
		</Navbar>
	);
}

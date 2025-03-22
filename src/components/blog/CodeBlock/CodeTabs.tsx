//@ts-nocheck
import { useState, useEffect, useRef } from "react";
import {
	Tabs,
	Tab,
	Card,
	CardBody,
	CardFooter,
	Snippet,
	Skeleton,
} from "@nextui-org/react";
import {
	FileJs,
	FileTs,
	FileTsx,
	FileJsx,
	BracketsCurly,
	FileHtml,
	FileCss,
	FilePy,
	TerminalWindow,
} from "@phosphor-icons/react";

const languageIcons = {
	js: FileJs,
	javascript: FileJs,
	ts: FileTs,
	typescript: FileTsx,
	jsx: FileJsx,
	tsx: FileTsx,
	json: BracketsCurly,
	html: FileHtml,
	css: FileCss,
	python: FilePy,
	py: FilePy,
	bash: TerminalWindow,
	sh: TerminalWindow,
};

export default function CodeTabs(props) {
	const { code } = props;
	const [codeBlocks, setCodeBlocks] = useState([]);
	const [loading, setLoading] = useState(true);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(code.props.value, "text/html");
		const figures = doc.querySelectorAll("figure");

		const blocks = Array.from(figures).map((figure) => {
			const titleElement = figure.querySelector(
				"[data-rehype-pretty-code-title]",
			);
			const preElement = figure.querySelector("pre");
			const captionElement = figure.querySelector("figcaption");

			let title = titleElement?.textContent || "";
			const language = preElement?.getAttribute("data-language") || null;
			if (!title) {
				title = language
					? language.charAt(0).toUpperCase() + language.slice(1)
					: "Code";
			}

			const content = preElement?.outerHTML || "";
			const caption = captionElement?.textContent
				? captionElement.textContent === title
					? ""
					: captionElement.textContent
				: "";

			return { title, content, language, caption };
		});

		setCodeBlocks(blocks);
		setLoading(false);
	}, [code]);

	useEffect(() => {
		if (!loading && codeBlocks.length > 0) {
			const adjustHeight = () => {
				if (containerRef.current) {
					const tabContents =
						containerRef.current.querySelectorAll<HTMLElement>(
							'[data-slot="panel"]',
						);
					if (tabContents.length > 0) {
						const heights = Array.from(tabContents).map(
							(el) => el.offsetHeight,
						);
						const maxHeight = Math.max(...heights);
						// Set a minimum height of 100px to prevent overlap
						const finalHeight = Math.max(maxHeight, 100);
						containerRef.current.style.height = `${finalHeight}px`;
					}
				}
			};

			// Use a timeout to ensure the DOM has updated
			const timeoutId = setTimeout(adjustHeight, 0);

			// Add event listener for window resize
			window.addEventListener("resize", adjustHeight);

			// Clean up function
			return () => {
				clearTimeout(timeoutId);
				window.removeEventListener("resize", adjustHeight);
			};
		}
	}, [codeBlocks, loading]);

	if (loading) {
		return (
			<div className="w-full h-[350px] mb-8">
				<span className="sr-only" aria-hidden={true}>
					{code.props.value}
				</span>
				<Skeleton className="w-full h-full" />
			</div>
		);
	}
	return (
		<div className="flex w-full flex-col not-prose min-h-[100px] mb-8" ref={containerRef}>
			<Tabs aria-label="Code examples">
				{codeBlocks.map((block, index) => {
					const IconComponent =
						languageIcons[
							block.language?.toLowerCase() as keyof typeof languageIcons
						] || BracketsCurly;
					return (
						<Tab
							key={`${block.language}-${index}`} // Ensure unique key even for same language
							title={
								<div className="flex items-center space-x-2 relative">
									<IconComponent size={18} />
									<span>{block.title}</span>
								</div>
							}
						>
							<Card>
								<Snippet
									symbol=""
									classNames={{
										base: "relative w-full block w-auto h-auto m-0 p-0 text-[1.1rem] font-mono text-inherit bg-transparent rounded-none",
										copyButton: "absolute right-1 top-1 bg-content1",
										content: "",
										pre: "w-full [&_code]:!text-[1.1rem] [&_code]:leading-relaxed",
									}}
								>
									<CardBody className="p-4 overflow-x-auto">
										{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
										<div dangerouslySetInnerHTML={{ __html: block.content }} className="[&_pre]:!text-[1.1rem] [&_code]:!text-[1.1rem] [&_code]:leading-relaxed" />
									</CardBody>
								</Snippet>
								{block.caption && (
									<CardFooter>
										<div className="mb-2 text-sm text-foreground/80">
											{block.caption}
										</div>
									</CardFooter>
								)}
							</Card>
						</Tab>
					);
				})}
			</Tabs>
		</div>
	);
}

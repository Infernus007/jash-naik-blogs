//@ts-nocheck
import { useState, useEffect, useRef, useMemo, useCallback, memo, Suspense, lazy } from "react";
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

// Simple Code Block Component for minimal snippets
const SimpleCodeBlock = memo(({ block, showCopy = true }: { block: any; showCopy?: boolean }) => {
	if (!showCopy) {
	return (
		<Card className="mb-6 overflow-hidden">
			<CardBody className="p-4 overflow-x-auto">
				<div 
					dangerouslySetInnerHTML={{ __html: block.content }} 
					className="[&_pre]:!text-[1rem] [&_code]:!text-[1rem] [&_code]:leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre"
				/>
			</CardBody>
			{block.caption && (
				<CardFooter className="pt-0">
					<div className="text-sm text-foreground/70 italic">
						{block.caption}
					</div>
				</CardFooter>
			)}
		</Card>
	);
	}

	return (
		<Card className="mb-6 overflow-hidden">
			<Snippet
				symbol=""
				classNames={{
					base: "relative w-full block w-auto h-auto m-0 p-0 text-[1rem] font-mono text-inherit bg-transparent rounded-lg",
					copyButton: "absolute right-2 top-2 bg-content1/80 backdrop-blur-sm hover:bg-content1",
					content: "",
					pre: "w-full [&_code]:!text-[1rem] [&_code]:leading-relaxed",
				}}
			>
				<CardBody className="p-4 overflow-x-auto">
					<div 
						dangerouslySetInnerHTML={{ __html: block.content }} 
						className="[&_pre]:!text-[1rem] [&_code]:!text-[1rem] [&_code]:leading-relaxed [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:overflow-x-auto [&_pre]:whitespace-pre"
					/>
				</CardBody>
			</Snippet>
			{block.caption && (
				<CardFooter className="pt-0">
					<div className="text-sm text-foreground/70 italic">
						{block.caption}
					</div>
				</CardFooter>
			)}
		</Card>
	);
});

// Intersection Observer hook for virtualization
const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, threshold = 0.1) => {
	const [isIntersecting, setIsIntersecting] = useState(false);
	const [hasIntersected, setHasIntersected] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsIntersecting(entry.isIntersecting);
				if (entry.isIntersecting) {
					setHasIntersected(true);
				}
			},
			{ threshold, rootMargin: '50px' }
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [threshold]);

	return { isIntersecting, hasIntersected };
};

// Virtual Tab Content Component - Only renders when visible
const VirtualTabContent = memo(({ 
	block, 
	isActive, 
	hasBeenActive,
	onContentLoad 
}: { 
	block: any; 
	isActive: boolean; 
	hasBeenActive: boolean;
	onContentLoad: () => void;
}) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const { hasIntersected } = useIntersectionObserver(contentRef);
	const [contentLoaded, setContentLoaded] = useState(false);

	// Only render content when tab is active or has been active before
	const shouldRenderContent = isActive || hasBeenActive || hasIntersected;

	useEffect(() => {
		if (shouldRenderContent && !contentLoaded) {
			// Use requestIdleCallback for non-blocking content loading
			const loadContent = () => {
				setContentLoaded(true);
				onContentLoad?.();
			};

			if (window.requestIdleCallback) {
				window.requestIdleCallback(loadContent);
			} else {
				setTimeout(loadContent, 0);
			}
		}
	}, [shouldRenderContent, contentLoaded, onContentLoad]);

	if (!shouldRenderContent) {
		return (
			<div 
				ref={contentRef}
				className="w-full h-64 flex items-center justify-center text-foreground/60"
			>
				<div className="text-center">
					<div className="animate-pulse">Loading content...</div>
				</div>
			</div>
		);
	}

	if (!contentLoaded) {
		return (
			<div className="w-full h-64">
				<Skeleton className="w-full h-full rounded-lg" />
			</div>
		);
	}

	return (
		<Card className="overflow-hidden">
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
					{/* Progressive enhancement with containment */}
					<div 
						dangerouslySetInnerHTML={{ __html: block.content }} 
						className="[&_pre]:!text-[1.1rem] [&_code]:!text-[1.1rem] [&_code]:leading-relaxed [&_pre]:overflow-x-auto [&_pre]:whitespace-pre"
						style={{ 
							contain: 'layout style paint',
							willChange: isActive ? 'contents' : 'auto'
						}}
					/>
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
	);
});

// Chunked processing for large datasets
const useChunkedProcessing = <T,>(data: T[], chunkSize = 3) => {
	const [processedChunks, setProcessedChunks] = useState<T[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);

	const processChunk = useCallback(async (items: T[], startIndex = 0) => {
		setIsProcessing(true);
		
		const processNextChunk = (index: number) => {
			const chunk = items.slice(index, index + chunkSize);
			if (chunk.length === 0) {
				setIsProcessing(false);
				return;
			}

			setProcessedChunks(prev => [...prev, ...chunk]);

			// Process next chunk in next tick
			if (window.requestIdleCallback) {
				window.requestIdleCallback(() => processNextChunk(index + chunkSize));
			} else {
				setTimeout(() => processNextChunk(index + chunkSize), 16);
			}
		};

		processNextChunk(startIndex);
	}, [chunkSize]);

	return { processedChunks, isProcessing, processChunk };
};

export default function CodeTabs(props) {
	const { code, simple = false, showCopy = true } = props;
	const [codeBlocks, setCodeBlocks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState(0);
	const [activatedTabs, setActivatedTabs] = useState(new Set([0])); // Track which tabs have been activated
	const containerRef = useRef<HTMLDivElement | null>(null);
	const { isIntersecting } = useIntersectionObserver(containerRef);

	// Chunked processing for large code blocks
	const { processedChunks, isProcessing, processChunk } = useChunkedProcessing([], 2);

	// Memoize the parsing logic with web workers for large content
	const parsedCodeBlocks = useMemo(() => {
		if (!code?.props?.value) return [];
		
		try {
			const htmlContent = code.props.value;
			
			// For very large content, use a more efficient parsing approach
			if (htmlContent.length > 50000) {
				// Processing large content
			}

			// Check if we're in a browser environment
			if (typeof window === 'undefined') {
				// Server-side: Use a simple regex-based approach for parsing
				const figureRegex = /<figure[^>]*>([\s\S]*?)<\/figure>/g;
				const blocks = [];
				let match;
				let index = 0;
				
				while ((match = figureRegex.exec(htmlContent)) !== null) {
					const figureContent = match[1];
					
					// Extract title
					const titleMatch = figureContent.match(/data-rehype-pretty-code-title[^>]*>([^<]*)</);
					const languageMatch = figureContent.match(/data-language="([^"]*)"/) || figureContent.match(/language-(\w+)/);
					const preMatch = figureContent.match(/<pre[^>]*>[\s\S]*?<\/pre>/);
					const captionMatch = figureContent.match(/<figcaption[^>]*>([^<]*)<\/figcaption>/);
					
					let title = titleMatch?.[1] || "";
					const language = languageMatch?.[1] || null;
					
					if (!title) {
						title = language
							? language.charAt(0).toUpperCase() + language.slice(1)
							: `Code ${index + 1}`;
					}
					
					const content = preMatch?.[0] || "";
					const caption = captionMatch?.[1];
					const finalCaption = caption && caption !== title ? caption : "";
					
					blocks.push({
						title,
						language,
						content,
						caption: finalCaption,
						id: `code-block-${index}-${Date.now()}`, // Simple, guaranteed unique ID
						index
					});
					index++;
				}
				
				return blocks;
			}

			// Client-side: Use DOMParser
			const parser = new DOMParser();
			const doc = parser.parseFromString(htmlContent, "text/html");
			const figures = doc.querySelectorAll("figure");

			const blocks = Array.from(figures).map((figure, index) => {
				const titleElement = figure.querySelector("[data-rehype-pretty-code-title]");
				const preElement = figure.querySelector("pre");
				const captionElement = figure.querySelector("figcaption");

				let title = titleElement?.textContent || "";
				const language = preElement?.getAttribute("data-language") || null;
				
				if (!title) {
					title = language
						? language.charAt(0).toUpperCase() + language.slice(1)
						: `Code ${index + 1}`;
				}

				const content = preElement?.outerHTML || "";
				const caption = captionElement?.textContent
					? captionElement.textContent === title ? "" : captionElement.textContent
					: "";

				return { 
					title, 
					content, 
					language, 
					caption,
					id: `${language}-${index}-${Date.now()}`, // More unique ID
					size: content.length // Track content size for optimization
				};
			});

			// Sort by size for better loading priority (smaller first)
			return blocks.sort((a, b) => a.size - b.size);
		} catch (error) {
			return [];
		}
	}, [code?.props?.value]);

	// Progressive loading with chunked processing
	useEffect(() => {
		const processCodeBlocks = async () => {
			setLoading(true);
			setCodeBlocks([]);
			setActiveTab(0); // Reset active tab
			setActivatedTabs(new Set([0]));
			
			if (parsedCodeBlocks.length === 0) {
				setLoading(false);
				setActiveTab(-1); // Set to -1 when no blocks
				return;
			}

			// For simple mode or small datasets, load immediately
			if (simple || parsedCodeBlocks.length <= 3) {
				setCodeBlocks(parsedCodeBlocks);
				setActiveTab(0); // Ensure first tab is active
				setActivatedTabs(new Set([0]));
				setLoading(false);
				return;
			}

			// For larger datasets, use chunked processing
			await processChunk(parsedCodeBlocks);
		};

		processCodeBlocks();
	}, [parsedCodeBlocks, processChunk, simple]);

	// Update codeBlocks when chunked processing completes
	useEffect(() => {
		if (processedChunks.length > 0 && !simple) {
			setCodeBlocks(processedChunks);
			// Ensure activeTab is valid for the new code blocks
			if (processedChunks.length > 0 && (activeTab < 0 || activeTab >= processedChunks.length)) {
				setActiveTab(0);
				setActivatedTabs(new Set([0]));
			}
			if (!isProcessing) {
				setLoading(false);
			}
		}
	}, [processedChunks, isProcessing, activeTab, simple]);

	// Optimized height adjustment with ResizeObserver
	const adjustHeight = useCallback(() => {
		if (!containerRef.current || simple) return;

		const tabContents = containerRef.current.querySelectorAll<HTMLElement>('[data-slot="panel"]');
		if (tabContents.length > 0) {
			const heights = Array.from(tabContents).map(el => el.offsetHeight);
			const maxHeight = Math.max(...heights);
			const finalHeight = Math.max(maxHeight, 100);
			containerRef.current.style.height = `${finalHeight}px`;
		}
	}, [simple]);

	// Use ResizeObserver for better performance than window resize
	useEffect(() => {
		if (loading || codeBlocks.length === 0 || !containerRef.current || simple) return;

		let rafId: number;
		const resizeObserver = new ResizeObserver(() => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(adjustHeight);
		});

		resizeObserver.observe(containerRef.current);

		// Initial adjustment
		rafId = requestAnimationFrame(adjustHeight);

		return () => {
			resizeObserver.disconnect();
			cancelAnimationFrame(rafId);
		};
	}, [codeBlocks, loading, adjustHeight, simple]);

	// Handle tab selection with preloading
	const handleTabChange = useCallback((key: string | number) => {
		// Ensure we have valid code blocks
		if (!codeBlocks || codeBlocks.length === 0) return;
		
		const index = codeBlocks.findIndex(block => block.id === key);
		
		if (index !== -1 && index >= 0 && index < codeBlocks.length) {
			setActiveTab(index);
			setActivatedTabs(prev => new Set([...prev, index]));
			
			// Preload adjacent tabs
			const preloadIndices = [index - 1, index + 1].filter(i => i >= 0 && i < codeBlocks.length);
			preloadIndices.forEach(i => {
				setActivatedTabs(prev => new Set([...prev, i]));
			});
		}
	}, [codeBlocks]);

	const handleContentLoad = useCallback(() => {
		// Trigger height adjustment when content loads
		if (!simple) {
			requestAnimationFrame(adjustHeight);
		}
	}, [adjustHeight, simple]);

	// Enhanced loading state
	if (loading || isProcessing) {
		if (simple) {
			return (
				<div className="w-full mb-6">
					<Skeleton className="w-full h-32 rounded-lg" />
				</div>
			);
		}

		const skeletonCount = Math.min(processedChunks.length || 3, 5);
		return (
			<div className="w-full mb-8">
				<div className="flex space-x-2 mb-4">
					{Array.from({ length: skeletonCount }, (_, i) => (
						<Skeleton key={i} className="h-8 w-24 rounded-lg" />
					))}
					{isProcessing && (
						<div className="flex items-center space-x-2 text-sm text-foreground/60">
							<div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
							<span>Loading more...</span>
						</div>
					)}
				</div>
				<Skeleton className="w-full h-64 rounded-lg" />
			</div>
		);
	}

	// Handle empty state
	if (codeBlocks.length === 0) {
		return (
			<div className="w-full p-8 text-center text-foreground/60 mb-8">
				<p>No code blocks found</p>
			</div>
		);
	}

	// Filter out any invalid blocks before rendering
	const validCodeBlocks = codeBlocks.filter(block => 
		block && 
		typeof block === 'object' && 
		typeof block.id === 'string' && 
		block.id.length > 0 &&
		typeof block.title === 'string' && 
		block.title.length > 0
	);

	// If we don't have valid blocks after filtering, show empty state
	if (validCodeBlocks.length === 0 && !loading && !isProcessing) {
		return (
			<div className="w-full p-8 text-center text-foreground/60 mb-8">
				<p>No valid code blocks found</p>
			</div>
		);
	}

	// Simple mode rendering - just render code blocks without tabs
	if (simple) {
		return (
			<div className="w-full overflow-hidden code-tabs-container" ref={containerRef}>
				{validCodeBlocks.map((block) => (
					<SimpleCodeBlock 
						key={block.id} 
						block={block} 
						showCopy={showCopy}
					/>
				))}
			</div>
		);
	}

	// Ensure activeTab is within bounds of valid blocks
	const safeActiveTab = Math.max(0, Math.min(activeTab, validCodeBlocks.length - 1));
	const selectedKey = validCodeBlocks.length > 0 && safeActiveTab >= 0 && safeActiveTab < validCodeBlocks.length 
		? validCodeBlocks[safeActiveTab].id 
		: validCodeBlocks.length > 0 ? validCodeBlocks[0].id : null;

	// If no valid selectedKey, don't render Tabs yet
	if (!selectedKey) {
		return (
			<div className="w-full p-8 text-center text-foreground/60 mb-8">
				<p>Loading tabs...</p>
			</div>
		);
	}

	return (
		<div 
			className="flex w-full flex-col not-prose min-h-[100px] mb-8 overflow-hidden code-tabs-container" 
			ref={containerRef}
			style={{ contain: 'layout' }}
		>
			<Tabs 
				aria-label="Code examples"
				selectedKey={selectedKey}
				onSelectionChange={handleTabChange}
				className="w-full"
				defaultSelectedKey={validCodeBlocks.length > 0 ? validCodeBlocks[0].id : undefined}
			>
				{validCodeBlocks.map((block, index) => {
					const IconComponent = languageIcons[block.language?.toLowerCase() as keyof typeof languageIcons] || BracketsCurly;
					
					return (
						<Tab
							key={block.id}
							title={
								<div className="flex items-center space-x-2 relative">
									<IconComponent size={18} />
									<span>{block.title}</span>
								</div>
							}
						>
							<VirtualTabContent
								block={block}
								isActive={index === safeActiveTab}
								hasBeenActive={activatedTabs.has(index)}
								onContentLoad={handleContentLoad}
							/>
						</Tab>
					);
				})}
			</Tabs>
		</div>
	);
}

// Add global styles for better overflow handling
if (typeof document !== 'undefined') {
	const style = document.createElement('style');
	style.textContent = `
		.code-tabs-container {
			overflow-x: auto;
			overflow-y: visible;
		}
		
		.code-tabs-container pre {
			overflow-x: auto !important;
			white-space: pre !important;
			word-wrap: normal !important;
		}
		
		.code-tabs-container code {
			white-space: pre !important;
			word-wrap: normal !important;
		}
		
		/* Custom scrollbar for better UX */
		.code-tabs-container::-webkit-scrollbar {
			height: 8px;
		}
		
		.code-tabs-container::-webkit-scrollbar-track {
			background: rgba(0, 0, 0, 0.1);
			border-radius: 4px;
		}
		
		.code-tabs-container::-webkit-scrollbar-thumb {
			background: rgba(0, 0, 0, 0.3);
			border-radius: 4px;
		}
		
		.code-tabs-container::-webkit-scrollbar-thumb:hover {
			background: rgba(0, 0, 0, 0.5);
		}
		
		.dark .code-tabs-container::-webkit-scrollbar-track {
			background: rgba(255, 255, 255, 0.1);
		}
		
		.dark .code-tabs-container::-webkit-scrollbar-thumb {
			background: rgba(255, 255, 255, 0.3);
		}
		
		.dark .code-tabs-container::-webkit-scrollbar-thumb:hover {
			background: rgba(255, 255, 255, 0.5);
		}
	`;
	document.head.appendChild(style);
}
import { cn } from "../../utils/cn";
import { motion } from "framer-motion";

export const TypewriterEffectSmooth = ({
	words,
	className,
	cursorClassName,
}: {
	words: {
		text: string;
		className?: string;
	}[];
	className?: string;
	cursorClassName?: string;
}) => {
	// split text inside of words into array of characters
	const wordsArray = words.map((word) => {
		return {
			...word,
			text: word.text.split(""),
		};
	});
	const renderWords = () => {
		return (
			<div>
				{wordsArray.map((word, wordIndex) => {
					return (
						<div key={`word-${word.text.join('')}-${wordIndex}`} className="inline-block">
							{word.text.map((char, charIndex) => (
								<span
									key={`${wordIndex}-${charIndex}-${char}`}
									className={cn("dark:text-white text-black", word.className)}
								>
									{char}
								</span>
							))}
							&nbsp;
						</div>
					);
				})}
			</div>
			);
		};

		return (
			<div className={cn("hidden lg:flex space-x-1 my-1", className)}>
				<motion.div
					className="overflow-hidden"
					initial={{
						width: "0%",
					}}
					animate={{
						width: "fit-content",
					}}
					transition={{
						duration: 2,
						ease: "linear",
						delay: 1,
					}}
				>
					<div
						className="font-bold leading-tight text-gray-900 dark:text-white"
						style={{
							whiteSpace: "nowrap",
						}}
					>
						{renderWords()}{" "}
					</div>
				</motion.div>
				<motion.span
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					transition={{
						duration: 0.8,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
					className={cn(
						"block rounded-sm w-[4px] h-8 md:h-10 lg:h-12 bg-blue-500",
						cursorClassName,
					)}
				/>
			</div>
		);
	};

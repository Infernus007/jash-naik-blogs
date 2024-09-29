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
				{wordsArray.map((word, idx) => {
					return (
						<div key={`word-${idx}`} className="inline-block">
							{word.text.map((char, index) => (
								<span
									key={`char-${index}`}
									className={cn(`dark:text-white text-black `, word.className)}
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
		<div className={cn("noSidebar:flex space-x-1 my-1 hidden ", className)}>
			<motion.div
				className="overflow-hidden "
				initial={{
					width: "0%",
				}}
				whileInView={{
					width: "fit-content",
				}}
				transition={{
					duration: 2,
					ease: "linear",
					delay: 1,
				}}
			>
				<div
					className="text-2xl h-full font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight"
					style={{
						whiteSpace: "nowrap",
					}}
				>
					{renderWords()}{" "}
				</div>{" "}
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

					repeat: Infinity,
					repeatType: "reverse",
				}}
				className={cn(
					"block rounded-sm w-[4px]  h-1 sm:h-6 xl:h-12 bg-blue-500",
					cursorClassName,
				)}
			></motion.span>
		</div>
	);
};

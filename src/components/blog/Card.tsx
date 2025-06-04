import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Link,
} from "@nextui-org/react";

interface MyCardProps {
	title: string;
	description: string;
	href: string;
	githubHref?: string;
	children: React.ReactNode;
}

const MyCard: React.FC<MyCardProps> = ({
	title,
	description,
	href,
	githubHref,
	children,
}) => {
	return (
		<Card
			as="a"
			isPressable
			title={title}
			href={href}
			onClick={(e) => {
				e.preventDefault();
				setTimeout(() => window.open(href, "_self"), 500);
			}}
			className="max-w-[400px] bg-foreground-200 p-0 rounded-3xl hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-blue-500/20 hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-600 hover:text-white transition-all duration-300 ease-out"
		>
			<CardHeader className="flex gap-3 p-0">{children}</CardHeader>
			<CardBody>
				<h3 className="font-bold text-xl">{title}</h3>
				<p className="truncate">{description}</p>
			</CardBody>
			{githubHref?.startsWith("https://") && (
				<CardFooter>
					<Link
						isExternal
						showAnchorIcon
						href={githubHref}
						onClick={(e) => {
							e.preventDefault();
							setTimeout(() => window.open(githubHref, "_blank"), 500);
						}}
					>
						Visit source code on GitHub.
					</Link>
				</CardFooter>
			)}
		</Card>
	);
};

export default MyCard;

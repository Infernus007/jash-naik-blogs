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
			href={href}
			onClick={(e) => {
				e.preventDefault();
				setTimeout(() => window.open(href, "_self"), 500);
			}}
			className="max-w-[400px] bg-foreground-200 p-0 rounded-3xl hover:bg-sky-200 dark:hover:bg-red-400 transition-all ease-linear"
		>
			<CardHeader className="flex gap-3 p-0">{children}</CardHeader>
			<CardBody>
				<h3>{title}</h3>
				<p>{description}</p>
			</CardBody>
			{githubHref && githubHref.startsWith("https://") && (
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

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import type { Dispatch, SetStateAction } from "react";
import { Input } from "@nextui-org/react";
import { SearchIcon } from "../Navbar/SearchIcon";
import { Button } from "@nextui-org/react";
function index({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
}) {
	const ModalComponent = Modal as any;
	
	return (
		<ModalComponent
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			scrollBehavior="inside"
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 ">
							<Input
								placeholder="Search"
								classNames={{
									input: [
										"bg-transparent",
										"text-black/90 dark:text-white/90",
										"placeholder:text-default-700/50 dark:placeholder:text-white/60",
									],
									innerWrapper: "bg-transparent",
									inputWrapper: [
										"bg-white",
										"dark:bg-default/60",
										"border-none",
										"outline-none",
										"shadow-none",
										"hover:bg-white",
										"dark:hover:bg-default/70",
										"data-[hover=true]:bg-white",
										"group-data-[focused=true]:bg-white",
										"group-data-[focus=true]:bg-white",
										"dark:group-data-[focused=true]:bg-default/60",
										"!cursor-text",
									],
								}}
								startContent={<SearchIcon size={30} />}
								endContent={
									<Button
										onPress={onClose}
										size="sm"
										variant="ghost"
										aria-label="Close modal"
									>
										Esc
									</Button>
								}
							/>
						</ModalHeader>
						<Divider className="mb-4" />
						<ModalBody className="dark:text-white">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
								pulvinar risus non risus hendrerit venenatis. Pellentesque sit
								amet hendrerit risus, sed porttitor quam.
							</p>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
								pulvinar risus non risus hendrerit venenatis. Pellentesque sit
								amet hendrerit risus, sed porttitor quam.
							</p>
							<p>
								Magna exercitation reprehenderit magna aute tempor cupidatat
								consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
								incididunt cillum quis. Velit duis sit officia eiusmod Lorem
								aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
								consectetur esse laborum eiusmod pariatur proident Lorem eiusmod
								et. Culpa deserunt nostrud ad veniam.
							</p>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
								pulvinar risus non risus hendrerit venenatis. Pellentesque sit
								amet hendrerit risus, sed porttitor quam. Magna exercitation
								reprehenderit magna aute tempor cupidatat consequat elit dolor
								adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum
								quis. Velit duis sit officia eiusmod Lorem aliqua enim laboris
								do dolor eiusmod. Et mollit incididunt nisi consectetur esse
								laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
								deserunt nostrud ad veniam.
							</p>
							<p>
								Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis
								sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
								Et mollit incididunt nisi consectetur esse laborum eiusmod
								pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
								veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Nullam pulvinar risus non risus hendrerit venenatis.
								Pellentesque sit amet hendrerit risus, sed porttitor quam. Magna
								exercitation reprehenderit magna aute tempor cupidatat consequat
								elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt
								cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim
								laboris do dolor eiusmod. Et mollit incididunt nisi consectetur
								esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
								deserunt nostrud ad veniam.
							</p>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
								pulvinar risus non risus hendrerit venenatis. Pellentesque sit
								amet hendrerit risus, sed porttitor quam.
							</p>
							<p>
								Magna exercitation reprehenderit magna aute tempor cupidatat
								consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
								incididunt cillum quis. Velit duis sit officia eiusmod Lorem
								aliqua enim laboris do dolor eiusmod. Et mollit incididunt nisi
								consectetur esse laborum eiusmod pariatur proident Lorem eiusmod
								et. Culpa deserunt nostrud ad veniam.
							</p>
							<p>
								Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis
								sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
								Et mollit incididunt nisi consectetur esse laborum eiusmod
								pariatur proident Lorem eiusmod et. Culpa deserunt nostrud ad
								veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
								Nullam pulvinar risus non risus hendrerit venenatis.
								Pellentesque sit amet hendrerit risus, sed porttitor quam. Magna
								exercitation reprehenderit magna aute tempor cupidatat consequat
								elit dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt
								cillum quis. Velit duis sit officia eiusmod Lorem aliqua enim
								laboris do dolor eiusmod. Et mollit incididunt nisi consectetur
								esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
								deserunt nostrud ad veniam.
							</p>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</ModalComponent>
	);
}

export default index;

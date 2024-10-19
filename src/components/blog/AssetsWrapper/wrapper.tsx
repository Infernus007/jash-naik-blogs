import {Card , CardHeader, CardBody, CardFooter} from "@nextui-org/react";

interface AssetsWrapperProps {
    title?: string;
    footer?: string;
    children: React.ReactNode;
}

export const AssetsWrapper = (props: AssetsWrapperProps) => {
    return (
        <Card radius="lg" id="assets-wrapper"
         className="p-0 not-prose">
                {props.title && <CardHeader className="flex-col sm:flex-row">{props.title}</CardHeader>}
            <CardBody className="p-0">
                {props.children}
            </CardBody>
            {props.footer && <CardFooter>{props.footer}</CardFooter>}
        </Card>
        )
}
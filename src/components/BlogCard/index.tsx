import React, { Children } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
} from "@nextui-org/react";

function index({
  children,
  description,
  title,
  href,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
  href: string;
}) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">{children}</CardHeader>
      <Divider />
      <CardBody>
        <h3>{title}</h3>
        <p>{description}</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={href}>
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
  );
}

export default index;

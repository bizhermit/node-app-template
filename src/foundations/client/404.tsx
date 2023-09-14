import { type FC, type HTMLAttributes, useEffect, useState } from "react";
import NextLink from "./elements/link";
import { attributes } from "./utilities/attributes";

const Page404: FC<Omit<HTMLAttributes<HTMLDivElement>, "children">> = (props) => {
  const getUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/`;
  };
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (url) return;
    setUrl(getUrl());
  }, []);

  return (
    <div {...attributes(props, "flex column center middle g-s")}>
      <span className="bold">404&nbsp;|&nbsp;Not&nbsp;Found</span>
      <NextLink href="/">{url}</NextLink>
    </div>
  );
};

export default Page404;
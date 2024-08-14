"use client"; // if you are planing to use it in the component which is not marker with use client directive this is a must

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now imported from navigation

const ActiveLink = ({
    children,
    ...rest
}: { children: React.ReactNode } & LinkProps) => {
    const { href } = rest;
    const pathName = usePathname();

    const isActive = pathName === href;
    return (
        <Link {...rest} className={isActive ? "active" : ""}>
            {children}
        </Link>
    );
};

export default ActiveLink;
'use client';

import Link from 'next/link';
import React from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href?: string;
  to?: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, to, children, className, activeClassName, ...rest }, ref) => {
    const pathname = usePathname();
    const resolvedHref = href || to || '';
    const isActive = pathname === href;

    return (
      <Link
        ref={ref}
        href={resolvedHref}
        className={clsx(className, isActive && activeClassName)}
        {...rest}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = 'NavLink';

export default NavLink;

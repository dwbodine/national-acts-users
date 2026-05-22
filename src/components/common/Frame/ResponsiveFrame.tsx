import { Icon } from '@rsuite/icons';
import MenuIcon from '@rsuite/icons/Menu';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { MdLockReset, MdLogout } from 'react-icons/md';
import { Container, Drawer, IconButton, Nav, Navbar, Sidebar, Sidenav } from 'rsuite';

import { RenderNavProps, ResponsiveFrameProps } from '@/types/props';

import WaitSpinner from '../WaitSpinnerComponent';

/**
 * NavItem renderer (you can externalize this if desired)
 */
const RenderNav = (props: RenderNavProps) => {
  const menuItems = props.navs;

  if (props.isMobile) {
    const resetMenuItem = menuItems?.find((x) => x.eventKey === 'reset-password');
    if (!resetMenuItem) {
      menuItems?.push({
        eventKey: 'reset-password',
        icon: <Icon as={MdLockReset} />,
        title: 'Reset Password',
        to: '/reset-password',
      });
    }

    const logoutMenuItem = menuItems?.find((x) => x.eventKey === 'logout');
    if (!logoutMenuItem) {
      menuItems?.push({
        eventKey: 'logout',
        icon: <Icon as={MdLogout} />,
        title: 'Sign Out',
        to: '/logout',
      });
    }
  }

  return (
    <Nav vertical={true}>
      {menuItems?.map((item) => {
        const { children, ...rest } = item;

        const placement = props.isMobile ? 'bottomEnd' : 'rightStart';

        if (children) {
          return (
            <Nav.Menu key={item.eventKey} placement={placement} trigger="hover" {...rest}>
              {children.map((child) => (
                <Nav.Item
                  as={Link}
                  href={child.to}
                  key={child.eventKey}
                  {...child}
                  onClick={() => props.onItemClick?.()}
                >
                  {child.title}
                </Nav.Item>
              ))}
            </Nav.Menu>
          );
        }

        return (
          <Nav.Item
            as={Link}
            href={rest.to}
            key={rest.eventKey}
            {...rest}
            onClick={() => props.onItemClick?.()}
          >
            &nbsp;{rest.title}
          </Nav.Item>
        );
      })}
    </Nav>
  );
};

/**
 * ResponsiveFrame:
 * - Desktop: Sidebar + Sidenav
 * - Mobile: Navbar + Hamburger → Drawer
 */
export default function ResponsiveFrame({
  navs,
  children,
  Brand,
  Header,
  NavToggle,
  Content,
  IsLoading,
}: ResponsiveFrameProps) {
  const [expand, setExpand] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isNavEmpty = !navs || navs.length === 0;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideSideBar = pathname.includes('/event') && searchParams.has('id');

  const handleNavClick = () => setMobileOpen(false);

  return (
    <Container className="frame">
      {/* ---------------- MOBILE NAVBAR ---------------- */}
      <Navbar className="mobile-nav" hidden={isNavEmpty || hideSideBar}>
        <Navbar.Brand>
          <IconButton icon={<MenuIcon />} appearance="subtle" onClick={() => setMobileOpen(true)} />
        </Navbar.Brand>
      </Navbar>

      {/* ---------------- MOBILE DRAWER ---------------- */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="left"
        size="xs"
        backdrop
        keyboard
      >
        <Drawer.Header>
          <Drawer.Title>
            <Brand expanded={Boolean(expand)} />
          </Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <div className="drawer-nav-animate">
            <RenderNav isMobile={true} navs={navs} onItemClick={handleNavClick} />
          </div>
        </Drawer.Body>
      </Drawer>

      {/* ---------------- DESKTOP SIDEBAR ---------------- */}
      <Sidebar
        className="desktop-sidebar"
        hidden={isNavEmpty || hideSideBar}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Brand expanded={Boolean(expand)} />
        </Sidenav.Header>

        <Sidenav expanded={Boolean(expand)} appearance="subtle" defaultOpenKeys={['2', '3']}>
          <Sidenav.Body>
            <RenderNav isMobile={false} navs={navs} onItemClick={handleNavClick} />
          </Sidenav.Body>
        </Sidenav>

        <NavToggle expand={Boolean(expand)} onChange={() => setExpand(!expand)} />
      </Sidebar>

      {/* ---------------- CONTENT AREA ---------------- */}
      <Container className="content-container" hidden={isNavEmpty}>
        <Header />
        <Content>
          <div hidden={IsLoading || isNavEmpty}>{children}</div>
          <WaitSpinner isLoading={IsLoading || isNavEmpty} />
        </Content>
      </Container>
    </Container>
  );
}

import { Container, Sidebar, Sidenav, Nav, Navbar, IconButton, Drawer } from 'rsuite';
import { RenderNavProps, ResponsiveFrameProps } from '@/types/props';
import Link from 'next/link';
import MenuIcon from '@rsuite/icons/Menu';
import { useState } from 'react';

/**
 * NavItem renderer (you can externalize this if desired)
 */
function RenderNav(props: RenderNavProps) {
  return (
    <Nav vertical={true}>
      {props.navs?.map((item) => {
        const { children, ...rest } = item;

        const placement = props.isMobile ? 'bottomEnd' : 'bottomStart';

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
            {rest.title}
          </Nav.Item>
        );
      })}
    </Nav>
  );
}

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
}: ResponsiveFrameProps) {
  const [expand, setExpand] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isNavEmpty = !navs || navs.length === 0;

  const handleNavClick = () => setMobileOpen(false);

  return (
    <Container className="frame">
      {/* ---------------- MOBILE NAVBAR ---------------- */}
      <Navbar className="mobile-nav">
        <Navbar.Brand>
          <IconButton
            icon={<MenuIcon />}
            appearance="subtle"
            onClick={() => setMobileOpen(true)}
          />
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
            <Brand expanded={expand ? true : false} />
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
        hidden={isNavEmpty}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Brand expanded={expand ? true : false} />
        </Sidenav.Header>

        <Sidenav
          expanded={expand ? true : false}
          appearance="subtle"
          defaultOpenKeys={['2', '3']}
        >
          <Sidenav.Body>
            <RenderNav isMobile={false} navs={navs} onItemClick={handleNavClick} />
          </Sidenav.Body>
        </Sidenav>

        <NavToggle expand={expand ? true : false} onChange={() => setExpand(!expand)} />
      </Sidebar>

      {/* ---------------- CONTENT AREA ---------------- */}
      <Container className="content-container" hidden={isNavEmpty}>
        <Header />
        <Content>{children}</Content>
      </Container>
    </Container>
  );
}

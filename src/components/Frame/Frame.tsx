'use client';

import { Container, Content, DOMHelper, Nav, Sidebar, Sidenav } from 'rsuite';

import React, { useEffect, useState } from 'react';
import Brand from '../Brand';
import Header from '../Header';
import NavLink from '../NavLink';
import NavToggle from './NavToggle';
import classNames from 'classnames';
import { FrameProps } from '@/types/props';
import { NavItemData } from '@/types/public';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { User } from '@/types/user';
import { adminAppNavs, userAppNavs } from '@/config';

const { getHeight, on } = DOMHelper;

const NavItem = (props: NavItemData) => {
  const { title, eventKey, ...rest } = props;
  return (
    <Nav.Item eventKey={eventKey} as={NavLink} {...rest}>
      {title}
    </Nav.Item>
  );
};

const Frame = (props: FrameProps) => {
  const [navs, setNavs] = useState<NavItemData[] | undefined>(undefined);
  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(500);

  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    } else if (user && user.isAuthenticated) {
      if (user.isAdmin) {
        setNavs(adminAppNavs);
      } else {
        setNavs(userAppNavs);
      }

      setWindowHeight(getHeight(window));
    }

    const resizeListener = on(window, 'resize', () => setWindowHeight(getHeight(window)));

    return () => {
      resizeListener.off();
    };
  }, [user, navs]);

  const containerClasses = classNames('page-container', {
    'container-full': !expand,
  });

  const navBodyStyle: React.CSSProperties = expand
    ? { height: windowHeight - 112, overflow: 'auto' }
    : {};

  return (
    <Container className="frame" hidden={!navs || navs.length == 0}>
      <Sidebar
        style={{ display: 'flex', flexDirection: 'column' }}
        width={expand ? 260 : 56}
        collapsible
      >
        <Sidenav.Header>
          <Brand />
        </Sidenav.Header>
        <Sidenav expanded={expand} appearance="subtle" defaultOpenKeys={['2', '3']}>
          <Sidenav.Body style={navBodyStyle}>
            <Nav>
              {navs?.map((item) => {
                const { children, ...rest } = item;
                if (children) {
                  return (
                    <Nav.Menu
                      key={item.eventKey}
                      placement="rightStart"
                      trigger="hover"
                      {...rest}
                    >
                      {children.map((child) => (
                        <NavItem key={child.eventKey} {...child} />
                      ))}
                    </Nav.Menu>
                  );
                }

                if (rest.target === '_blank') {
                  return (
                    <Nav.Item key={item.eventKey} {...rest}>
                      {item.title}
                    </Nav.Item>
                  );
                }

                return <NavItem key={rest.eventKey} {...rest} />;
              })}
            </Nav>
          </Sidenav.Body>
        </Sidenav>
        <NavToggle expand={expand} onChange={() => setExpand(!expand)} />
      </Sidebar>

      <Container className={containerClasses} hidden={!navs || navs.length == 0}>
        <Header />
        <Content>{props.children}</Content>
      </Container>
    </Container>
  );
};

export default Frame;

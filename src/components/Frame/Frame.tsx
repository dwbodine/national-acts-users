'use client';

import { Container, Content, DOMHelper, Nav, Sidebar, Sidenav } from 'rsuite';
import type { IconProps } from '@rsuite/icons/Icon';
import React, { ReactElement, JSXElementConstructor, useEffect, useState } from 'react';
import Brand from '../Brand';
import Header from '../Header';
import NavLink from '../NavLink';
import NavToggle from './NavToggle';
import classNames from 'classnames';

const { getHeight, on } = DOMHelper;

const NavItem = (props: NavItemData) => {
  const { title, eventKey, ...rest } = props;
  return (
    <Nav.Item eventKey={eventKey} as={NavLink} {...rest}>
      {title}
    </Nav.Item>
  );
};

export interface NavItemData {
  eventKey: string;
  title: string;
  icon?: ReactElement<IconProps, string | JSXElementConstructor<unknown>>;
  to?: string;
  target?: string;
  children?: NavItemData[];
}

export interface FrameProps {
  navs: NavItemData[];
  children?: React.ReactNode;
}

const Frame = (props: FrameProps) => {
  const { navs } = props;
  const [expand, setExpand] = useState(true);
  const [windowHeight, setWindowHeight] = useState(500);

  useEffect(() => {
    setWindowHeight(getHeight(window));
    const resizeListener = on(window, 'resize', () => setWindowHeight(getHeight(window)));

    return () => {
      resizeListener.off();
    };
  }, []);

  const containerClasses = classNames('page-container', {
    'container-full': !expand,
  });

  const navBodyStyle: React.CSSProperties = expand
    ? { height: windowHeight - 112, overflow: 'auto' }
    : {};

  return (
    <Container className="frame">
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
              {navs.map((item) => {
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

      <Container className={containerClasses}>
        <Header />
        <Content>{props.children}</Content>
      </Container>
    </Container>
  );
};

export default Frame;

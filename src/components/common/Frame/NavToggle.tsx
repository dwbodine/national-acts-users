'use client';

import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import { Nav, Navbar } from 'rsuite';

interface NavToggleProps {
  expand?: boolean;
  onChange?: () => void;
}

const NavToggle = ({ expand, onChange }: NavToggleProps) => (
  <Navbar appearance="subtle" className="nav-toggle">
    <Nav pullRight>
      <Nav.Item
        onClick={onChange}
        style={{ textAlign: 'center' }}
        icon={expand ? <ArrowLeftLineIcon /> : <ArrowRightLineIcon />}
      />
    </Nav>
  </Navbar>
);

export default NavToggle;

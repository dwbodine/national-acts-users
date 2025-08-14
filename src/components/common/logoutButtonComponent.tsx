"use client";

import { FaSignOutAlt } from 'react-icons/fa';
import { redirect } from 'next/navigation';

export default function LogoutButton() {
  const handleClick = () => {
    redirect('/logout/');
  };

  return (
    <div className="action-button">
      <a onClick={handleClick} title="Logout">
        <FaSignOutAlt size="2.5em" />
      </a>
    </div>
  );
}

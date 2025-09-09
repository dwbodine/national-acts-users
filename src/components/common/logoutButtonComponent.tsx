"use client";

import { FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/logout/');
  };

  return (
    <div className="action-button">
      <a onClick={handleClick} title="Logout">
        <FaSignOutAlt size="2.5em" />
      </a>
    </div>
  );
}

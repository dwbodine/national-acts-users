"use client";

import { FaUnlockAlt } from 'react-icons/fa';
import router from 'next/router';

export default function ResetPasswordButton() {
  const handleClick = () => {
    router.push('/reset-password');
  };

  return (
    <div className="action-button">
      <a onClick={handleClick} title="Reset Password">
        <FaUnlockAlt size="2.4em" />
      </a>
    </div>
  );
}

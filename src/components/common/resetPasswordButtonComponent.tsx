"use client";

import { FaUnlockAlt } from 'react-icons/fa';
import { redirect } from 'next/navigation';

export default function ResetPasswordButton() {
  const handleClick = () => {
    redirect('/reset-password');
  };

  return (
    <div className="action-button">
      <a onClick={handleClick} title="Reset Password">
        <FaUnlockAlt size="2.4em" />
      </a>
    </div>
  );
}

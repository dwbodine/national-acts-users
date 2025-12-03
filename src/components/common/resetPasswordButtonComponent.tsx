'use client';

import { useRouter } from 'next/navigation';
import { FaUnlockAlt } from 'react-icons/fa';

export default function ResetPasswordButton() {
  const router = useRouter();

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

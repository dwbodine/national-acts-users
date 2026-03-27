'use client';

import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dropdown, Popover, Stack, Whisper, WhisperInstance } from 'rsuite';

import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { SpeakerRenderFn } from '@/types/public';
import { User } from '@/types/user';

export default function Header() {
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);
  const [initials, setInitials] = useState('');

  useEffect(() => {
    if (user === undefined) {
      const currentUser = getUser();
      if (currentUser !== undefined) {
        setUser(currentUser);
      }
    } else {
      let init = user.username.slice(0, 2);
      if (user.firstName && user.lastName) {
        init = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
      } else if (user.firstName) {
        init = `${user.firstName.charAt(0)}`;
      } else if (user.lastName) {
        init = `${user.lastName.charAt(0)}`;
      }
      setInitials(init);
    }
  }, [user]);

  const closeAdminPopover = () => {
    adminRef.current?.close();
  };

  const logout = () => {
    closeAdminPopover();
    void router.push('/logout');
  };

  const resetPassword = () => {
    closeAdminPopover();
    void router.push('/reset-password');
  };

  const renderAdminSpeaker: SpeakerRenderFn = ({ onClose, left, top, className }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSelect = (eventKey: string | number | undefined) => {
      onClose();
    };

    let userName = user?.username ?? '';
    if (user) {
      if (user.firstName && user.lastName) {
        userName = `${user.firstName} ${user.lastName} (${user.username})`;
      } else if (user.firstName) {
        userName = `${user.firstName} (${user.username})`;
      } else if (user.lastName) {
        userName = `${user.lastName} (${user.username})`;
      }
    }

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item panel style={{ padding: 10, width: 200 }}>
            <p>Signed in as</p>
            <strong>{userName}</strong>
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item onClick={resetPassword}>Reset Password</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
          <Dropdown.Item
            icon={<HelpOutlineIcon />}
            href="https://nationalactsvip.com"
            target="_blank"
            as="a"
          >
            nationalactsvip.com
          </Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  // Each Whisper MUST have its own ref
  const adminRef = useRef<WhisperInstance>(null);

  const adminSpeaker = useCallback(renderAdminSpeaker, [user]);

  return user ? (
    <Stack className="header" alignItems="flex-end" justifyContent="flex-end" spacing={8}>
      <Whisper placement="bottomEnd" trigger="click" ref={adminRef} speaker={adminSpeaker}>
        <div className="avatar">{initials}</div>
      </Whisper>
    </Stack>
  ) : (
    ''
  );
}

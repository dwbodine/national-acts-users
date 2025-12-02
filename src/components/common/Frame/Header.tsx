'use client';

import { Dropdown, Popover, Stack, Whisper, WhisperInstance } from 'rsuite';
import { useCallback, useEffect, useRef, useState } from 'react';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import { SpeakerRenderFn } from '@/types/public';
import { RootState } from '@/lib/store';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '@/lib/globalSelectionSlice';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const [initials, setInitials] = useState('');
  const globalSelection = useSelector((state: RootState) => state.globalSelection);

  useEffect(() => {
    if (!globalSelection.currentUser) {
      const currentUser = getUser();
      if (currentUser) {
        dispatch(setCurrentUser(currentUser));
      }
    } else {
      const currentUser = globalSelection.currentUser;
      let init = currentUser.username.slice(0, 2);
      if (currentUser.firstName && currentUser.lastName) {
        init = `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`;
      } else if (currentUser.firstName) {
        init = `${currentUser.firstName.charAt(0)}`;
      } else if (currentUser.lastName) {
        init = `${currentUser.lastName.charAt(0)}`;
      }
      setInitials(init);
    }
  }, [globalSelection.currentUser]);

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

    const currentUser = globalSelection.currentUser;
    let userName = currentUser?.username ?? '';
    if (currentUser) {
      if (currentUser.firstName && currentUser.lastName) {
        userName = `${currentUser.firstName} ${currentUser.lastName} (${currentUser.username})`;
      } else if (currentUser.firstName) {
        userName = `${currentUser.firstName} (${currentUser.username})`;
      } else if (currentUser.lastName) {
        userName = `${currentUser.lastName} (${currentUser.username})`;
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

  const adminSpeaker = useCallback(renderAdminSpeaker, [globalSelection.currentUser]);

  return globalSelection.currentUser ? (
    <Stack className="header" alignItems="flex-end" justifyContent="flex-end" spacing={8}>
      <Whisper placement="bottomEnd" trigger="click" ref={adminRef} speaker={adminSpeaker}>
        <div className="avatar">{initials}</div>
      </Whisper>
    </Stack>
  ) : (
    ''
  );
}

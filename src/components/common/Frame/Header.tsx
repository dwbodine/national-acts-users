'use client';

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  IconButton,
  List,
  Popover,
  Stack,
  Whisper,
  WhisperInstance,
} from 'rsuite';
import { useCallback, useEffect, useRef, useState } from 'react';
import GearIcon from '@rsuite/icons/Gear';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import NoticeIcon from '@rsuite/icons/Notice';
import { SpeakerRenderFn } from '@/types/public';
import { User } from '@/types/user';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const { getUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (!user) {
      const currentUser = getUser();
      setUser(currentUser);
    }
  }, [user]);

  const logout = () => {
    void router.push('/logout');
  };

  const renderAdminSpeaker: SpeakerRenderFn = ({ onClose, left, top, className }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSelect = (eventKey: string | number | undefined) => {
      onClose();
    };

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
            <p>Signed in as</p>
            <strong>Administrator</strong>
          </Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item>Reset Password</Dropdown.Item>
          <Dropdown.Item>Profile & account</Dropdown.Item>
          <Dropdown.Item>Feedback</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item>Settings</Dropdown.Item>
          <Dropdown.Item onClick={logout}>Sign out</Dropdown.Item>
          <Dropdown.Item
            icon={<HelpOutlineIcon />}
            href="https://nationalactsvip.com"
            target="_blank"
            as="a"
          >
            Website
          </Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  /** --- Settings Speaker --------------------------------------------------- */

  const renderSettingSpeaker: SpeakerRenderFn = ({ onClose, left, top, className }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSelect = (eventKey: string | number | undefined) => {
      onClose();
    };

    return (
      <Popover ref={ref} className={className} style={{ left, top }} full>
        <Dropdown.Menu onSelect={handleSelect}>
          <Dropdown.Item panel style={{ padding: 10, width: 160 }}>
            <strong>Settings</strong>
          </Dropdown.Item>
          <Dropdown.Item>Applications</Dropdown.Item>
          <Dropdown.Item>Projects</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item>Members</Dropdown.Item>
          <Dropdown.Item>Teams</Dropdown.Item>
          <Dropdown.Item>Channels</Dropdown.Item>
          <Dropdown.Item divider />
          <Dropdown.Item>Integrations</Dropdown.Item>
          <Dropdown.Item>Customize</Dropdown.Item>
        </Dropdown.Menu>
      </Popover>
    );
  };

  /** --- Notice Speaker ----------------------------------------------------- */

  const renderNoticeSpeaker: SpeakerRenderFn = ({ onClose, left, top, className }, ref) => {
    const notifications: { time: string; content: string }[] = [
      {
        content:
          'The charts of the dashboard have been fully upgraded and are more visually pleasing.',
        time: '7 hours ago',
      },
      {
        content:
          'The function of virtualizing large lists has been added, and the style of the list can be customized as required.',
        time: '13 hours ago',
      },
      { content: 'Upgraded React 18 and Webpack 5.', time: '2 days ago' },
      {
        content:
          'Upgraded React Suite 5 to support TypeScript, which is more concise and efficient.',
        time: '3 days ago',
      },
    ];

    return (
      <Popover
        ref={ref}
        className={className}
        style={{ left, top, width: 300 }}
        title="Last updates"
      >
        <List>
          {notifications.map((item) => (
            <List.Item key={item.time}>
              <Stack spacing={4}>
                <Badge /> <span style={{ color: '#57606a' }}>{item.time}</span>
              </Stack>
              <p>{item.content}</p>
            </List.Item>
          ))}
        </List>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Button onClick={onClose}>More notifications</Button>
        </div>
      </Popover>
    );
  };

  // Each Whisper MUST have its own ref
  const noticeRef = useRef<WhisperInstance>(null);
  const settingsRef = useRef<WhisperInstance>(null);
  const adminRef = useRef<WhisperInstance>(null);

  // Memoized speaker functions (ESLint: react-hooks/exhaustive-deps)
  const noticeSpeaker = useCallback(renderNoticeSpeaker, []);
  const settingsSpeaker = useCallback(renderSettingSpeaker, []);
  const adminSpeaker = useCallback(renderAdminSpeaker, []);

  return (
    <Stack className="header" alignItems="flex-end" justifyContent="flex-end" spacing={8}>
      <Whisper placement="bottomEnd" trigger="click" ref={noticeRef} speaker={noticeSpeaker}>
        <IconButton
          icon={
            <Badge content={5}>
              <NoticeIcon style={{ fontSize: 20 }} />
            </Badge>
          }
        />
      </Whisper>

      <Whisper placement="bottomEnd" trigger="click" ref={settingsRef} speaker={settingsSpeaker}>
        <IconButton icon={<GearIcon style={{ fontSize: 20 }} />} />
      </Whisper>

      <Whisper placement="bottomEnd" trigger="click" ref={adminRef} speaker={adminSpeaker}>
        <Avatar
          size="sm"
          circle
          src="https://avatars.githubusercontent.com/u/1203827"
          alt="@simonguo"
          style={{ marginLeft: 8 }}
        />
      </Whisper>
    </Stack>
  );
}

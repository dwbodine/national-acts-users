import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetPasswordButton from './resetPasswordComponent';
import LogoutButton from './logoutButtonComponent';
import Image from 'next/image';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useEffect } from 'react';
import router from 'next/router';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { NavBarProps } from '@/types/props';

export default function NavBar(props: NavBarProps) {
  const windowSize = useWindowSize();
  const windowSizeJson = JSON.stringify(windowSize);
  const { getUser } = useCurrentUser();

  const navBarHidden = props.Hidden;

  useEffect(() => {
    // blank
  }, [windowSizeJson]);

  const goHome = () => {
    const currentUser = getUser();
    if (currentUser?.isAdmin) {
      router.push('/dashboard/');
    } else {
      router.push('/');
    }
  };

  return !navBarHidden ? (
    <>
      <Row className="no-print nav-bar">
        <Col className="logo-col">
          <Image
            onClick={goHome}
            className="nav-bar-icon-image"
            src="/images/logo-icon.jpg"
            height={50}
            width={50}
            alt="National Acts"
          ></Image>
        </Col>
        <Col className="nav-header control-container no-print">
          <LogoutButton />
          <ResetPasswordButton />
        </Col>
      </Row>
    </>
  ) : (
    ''
  );
}


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetPasswordButton from "./resetPasswordComponent";
import LogoutButton from "./logoutButtonComponent";
import Image from 'next/image';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useEffect } from 'react';

export default function NavBar() {    
    const { user } = useCurrentUser();
    const windowSize = useWindowSize();
    const windowSizeJson = JSON.stringify(windowSize);
    const isDennis = (user.username == 'dwbodine@gmail.com' || user.username == "dwbodine@hotmail.com");

    useEffect(() => {
        // blank
    }, [windowSizeJson]);

    return (
        <>
            <Row className="no-print nav-bar">
                <Col className="logo-col">
                    <Image className="nav-bar-icon-image" src="/images/logo-icon.jpg" height={50} width={50} alt="National Acts" />
                </Col>
                <Col hidden={!isDennis}>
                    {windowSize.width} x {windowSize.height} / {windowSize.orientation} / {windowSize.isMobile.toString()}
                </Col>
                <Col className="nav-header control-container no-print">
                    <LogoutButton />
                    <ResetPasswordButton />                    
                </Col>
            </Row>
        </>           
    );
}
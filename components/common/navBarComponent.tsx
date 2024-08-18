
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetPasswordButton from "./resetPasswordComponent";
import LogoutButton from "./logoutButtonComponent";
import Image from 'next/image';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useEffect } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function NavBar() {    
    const windowSize = useWindowSize();
    const windowSizeJson = JSON.stringify(windowSize);
    const { user } = useCurrentUser();
    const isDennis = (user.username == 'dwbodine@gmail.com' || user.username == 'dwbodine@hotmail.com');
    

    useEffect(() => {
        // blank
    }, [windowSizeJson]);

    return (
        <>
            <Row hidden={!isDennis}>
                <Col>
                    <div style={{padding: '15px'}}>{windowSize.width} X {windowSize.height} / {windowSize.angle} / {windowSize.orientation} / {windowSize.isMobile}</div>
                </Col>
            </Row>
            <Row className="no-print nav-bar">
                <Col className="logo-col">
                    <Image className="nav-bar-icon-image" src="/images/logo-icon.jpg" height={50} width={50} alt="National Acts" />
                </Col>
                <Col className="nav-header control-container no-print">
                    <LogoutButton />
                    <ResetPasswordButton />                    
                </Col>
            </Row>
        </>           
    );
}

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetPasswordButton from "./resetPasswordComponent";
import LogoutButton from "./logoutButtonComponent";
import Image from 'next/image';
import { useWindowSize } from '@/hooks/common/useWindowSize';
import { useEffect } from 'react';

export default function NavBar(props: any) {    
    const windowSize = useWindowSize();
    const windowSizeJson = JSON.stringify(windowSize);

    const navBarHidden = props.hidden ?? false as boolean;

    useEffect(() => {
        // blank
    }, [windowSizeJson]);

    return (
        !navBarHidden ? 
        <>
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
        : ''
    );
}
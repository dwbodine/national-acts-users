
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetPasswordButton from "./resetPasswordComponent";
import LogoutButton from "./logoutButtonComponent";

export default function NavBar() {    
    
    return (
        <>
            <Row className="no-print">
                <Col className="nav-header control-container no-print">
                    <LogoutButton />
                    <ResetPasswordButton />                    
                </Col>
            </Row>
        </>           
    );
}
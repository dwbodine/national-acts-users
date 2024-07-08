import { useRouter } from "next/router";
import { useResetPasswordSecure } from '../src/hooks/useResetPasswordSecure';
import { useEffect, useState } from "react";
import Container from 'react-bootstrap/Container';
import { Col, Row, Button } from "react-bootstrap";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import CheckAuth from "../components/checkAuthComponent";


export default function ResetPassword() {
  const { resetPasswordSecure } = useResetPasswordSecure();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    document.title = "Client Portal - Reset Password";
  }, [router])
  

  const handleSubmit = (event: any) => {
    const username = user.username;
    setPasswordError('');
    setPasswordSuccess('');
    resetPasswordSecure(username, password, confirmPassword)
        .then((response) => {
            if (response.errorMessage) {
                setPasswordError(response.errorMessage);
            } else {
                setPasswordSuccess('Password changed successfully, please use new password to log back in...');
                setTimeout(() => {
                    router.push("/logout")
                }, 2000);                
            }
        })
        .catch((e) => {
            console.log(e);
            setPasswordError("Unknown error while resetting password - please contact your administrator");
        });
  };

  const handleCancel = () => {
    router.push("/");
  };
  
  return (
    <>
        <CheckAuth />
        <Container className="wrapper">
            <Row>
                <Col>
                    <h2>Reset Password</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>Please fill out this form to reset your password.</p>
                </Col>
            </Row>
            <Row>
                <Col>
                        <Row>
                            <Col>
                                <div className="form-group">
                                    <label>New Password:</label>
                                    <input 
                                        type="password" 
                                        placeholder="Password"
                                        name="new_password" 
                                        className="w-80 h-8 px-2 border border-solid border-black rounded" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="form-group">
                                    <label>Confirm Password:</label>
                                    <input 
                                        type="password" 
                                        placeholder="Confirm Password"
                                        name="confirm_password" 
                                        className="w-80 h-8 px-2 border border-solid border-black rounded" 
                                        value={confirmPassword} 
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className="rs-btn-primary" onClick={handleSubmit}>Submit</Button>
                                <Button onClick={handleCancel}>Cancel</Button>
                                <div className="h-fit flex flex-row gap-2 items-center justify-center">
                                    {passwordError ? 
                                    <div className="danger">{passwordError}</div> :
                                    ''
                                    }
                                    {passwordSuccess ? 
                                    <div className="success">{passwordSuccess}</div> :
                                    ''
                                    }
                                </div>
                            </Col>
                        </Row>
                    
                </Col>
            </Row>
        </Container>
    </>
  );
}

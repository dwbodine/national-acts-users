import { Col, Container, Row } from "react-bootstrap";
import AdminIndexBar from "./adminIndexBarComponent";
import AdminList from "./adminListComponent";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ActiveAdminComponent } from "@/types/user";
import AdminRoles from "./adminRolesComponent";
import AdminUsers from "./adminUsersComponent";
import { useEffect, useState } from "react";

export default function AdminIndex() { 
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const [activeListComponent, setActiveListComponent] = useState<any>();

    useEffect(() => {
        switch (currentAdminSelection.activeComponent) {
            case ActiveAdminComponent.Roles:
                setActiveListComponent(<AdminRoles />);
                break;
            case ActiveAdminComponent.Users:
                setActiveListComponent(<AdminUsers />);
                break;
            default:
                setActiveListComponent(<AdminList />);
                break;
        }
    }, [currentAdminSelection]);        

    return(
        <>
            <AdminIndexBar />
            <Container fluid>
                <Row>
                    <Col>
                        coming soon...
                    </Col>
                </Row>
            </Container>
        </>
    );
}
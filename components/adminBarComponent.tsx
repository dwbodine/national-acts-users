
import SelectSeller from "../components/selectSellerComponent";
import DateRangeSelector from "../components/dateRangeSelectorComponent";
import InactiveCheck from "../components/inactiveCheckComponent";
import DeletedCheck from "../components/deletedCheckComponent";
import { useSelector } from "react-redux";
import type { RootState } from '../src/lib/store';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ResetButton from "./resetButtonComponent";
import ResetPasswordButton from "./resetPasswordComponent";
import LogoutButton from "./logoutButtonComponent";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function AdminBar() {    
    
    const { user } = useCurrentUser();
    const currentReportSelection = useSelector((state: RootState) => state.reportSelection);
    const showEventDetail = (currentReportSelection?.selectedEvent != undefined);

    let pageTitle: string = "Sales Overview";
    if (user.isAdmin) {
        pageTitle += " - Admin";
    } else if (currentReportSelection.seller.sellerId > 0) {
        pageTitle += " - " + currentReportSelection.seller.sellerName;
    }

    return (
        <>
        {(!showEventDetail) ?
            <>
                <Row className="page-header">
                    <Col className="title-container">
                        <div className="title">{pageTitle}</div>
                    </Col>
                    <Col className="control-container">
                        <DateRangeSelector />
                        <LogoutButton />
                        <ResetPasswordButton />                    
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <SelectSeller />
                        {user.showInactiveEvents && currentReportSelection.seller.sellerId > 0 ? <InactiveCheck /> : ''}
                        {user.isAdmin && currentReportSelection.seller.sellerId > 0 ? <DeletedCheck /> : ''}    
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {currentReportSelection.seller.sellerId > 0 ? <ResetButton /> : ''}
                    </Col>
                </Row>
            </>
            : ''}
        </>
    );
}
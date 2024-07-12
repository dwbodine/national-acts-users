import { FaMoneyBillAlt } from 'react-icons/fa';

export default function RevenueWidget(props: any) {

    const totalRevenue: number = props.TotalRevenue as number;
    const totalServiceFees: number = props.TotalServiceFees as number;
    const hideServiceFees: boolean = props.HideServiceFees as boolean;
    
    return (
        <>
            <FaMoneyBillAlt size="2em" />
            <div>Revenue:</div>
            <span>${totalRevenue.toFixed(2)}</span>     
            <div className="second" hidden={hideServiceFees}>
                <div>Service Fees:</div>
                <span>${totalServiceFees.toFixed(2)}</span>
            </div>
        </>
    );
}
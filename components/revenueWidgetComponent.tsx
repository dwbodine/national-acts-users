import { FaMoneyBillAlt } from 'react-icons/fa';

export default function RevenueWidget(props: any) {

    const totalRevenue: number = props.TotalRevenue as number;
    
    return (
        <div className="stat-block">
            <FaMoneyBillAlt size="2em" />
            <div>Revenue:</div>
            <span>${totalRevenue.toFixed(2)}</span>                
        </div>
    );
}
import { IAverageDailyData } from "@/types/user";

export default function AverageSalesWidget(props: any) {
    
    const monthlyAverages = props.monthlyAverages as IAverageDailyData | undefined;
    const yearlyAverages = props.yearlyAverages as IAverageDailyData | undefined;

    return (
        (monthlyAverages && yearlyAverages) ? 
        <div className="sales-stat-block-table">
            <div className="sales-stat-block-title">Average Daily Sales</div>
            <table className="average-sales-data-table">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th className="sales-stat-block-subtitle sales-stat-block-value">Month</th>
                        <th className="sales-stat-block-subtitle sales-stat-block-value">Year</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="sales-stat-block-name">Transactions:</td>
                        <td className="sales-stat-block-value">{monthlyAverages?.transactions?.toFixed(2)}</td>
                        <td className="sales-stat-block-value">{yearlyAverages?.transactions?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="sales-stat-block-name">Tickets:</td>
                        <td className="sales-stat-block-value">{monthlyAverages?.tickets?.toFixed(2)}</td>
                        <td className="sales-stat-block-value">{yearlyAverages?.tickets?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="sales-stat-block-name">Refunds:</td>
                        <td className="sales-stat-block-value">{monthlyAverages?.refunds?.toFixed(2)}</td>
                        <td className="sales-stat-block-value">{yearlyAverages?.refunds?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="sales-stat-block-name">Ticket Revenue:</td>
                        <td className="sales-stat-block-value">{monthlyAverages?.ticketRevenue?.toFixed(2)}</td>
                        <td className="sales-stat-block-value">{yearlyAverages?.ticketRevenue?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="sales-stat-block-name">Service Fees:</td>
                        <td className="sales-stat-block-value">{monthlyAverages?.serviceFees?.toFixed(2)}</td>
                        <td className="sales-stat-block-value">{yearlyAverages?.serviceFees?.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td className="sales-stat-block-name">Total Revenue:</td>
                        <td className="sales-stat-block-value">{monthlyAverages?.totalRevenue?.toFixed(2)}</td>
                        <td className="sales-stat-block-value">{yearlyAverages?.totalRevenue?.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div> 
        : ''     
    );
    
}
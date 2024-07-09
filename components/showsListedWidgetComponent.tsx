import { FaCalendar } from 'react-icons/fa';

export default function ShowsListedWidget(props: any) {

    const totalShows: number = props.TotalShows as number;

    return (
        <div className="stat-block">
            <FaCalendar size="2em" />
            <div>Shows listed:</div>
            <span>{totalShows}</span>
        </div>
    );
}
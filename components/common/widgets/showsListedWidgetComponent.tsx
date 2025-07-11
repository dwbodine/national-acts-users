import { ShowsListedWidgetProps } from '@/types/props';
import { FaCalendar } from 'react-icons/fa';

export default function ShowsListedWidget(props: ShowsListedWidgetProps) {
  const totalShows = props.TotalShows ?? 0;

  return (
    <>
      <FaCalendar size="2em" />
      <div>Shows listed:</div>
      <span>{totalShows}</span>
    </>
  );
}

import { useRouter } from "next/router";
import { useLogout } from "../src/hooks/useLogout";
import { useSelector } from "react-redux";
import type { RootState } from '../src/lib/store';
import styles from "../styles/Home.module.css";
import SelectSeller from "../components/selectSellerComponent";
import DateRangeSelector from "../components/dateRangeSelectorComponent";
import 'rsuite/dist/rsuite.min.css';
import InactiveCheck from "../components/inactiveCheckComponent";
import DeletedCheck from "../components/deletedCheckComponent";

export default function Home() {
  const { logout } = useLogout();
  const router = useRouter();
  const currentUser = useSelector((state: RootState) => state.user);
  const currentReportSelection = useSelector((state: RootState) => state.reportSelection);

  return (
    <>
        <h1 className={styles.title}>
          User main landing page
        </h1>

        <p className={styles.description}>
          {currentUser
            ? <div>
                <SelectSeller /> 
                <DateRangeSelector />
                {currentUser.showInactiveEvents ? <InactiveCheck /> : ''}
                {currentUser.isAdmin ? <DeletedCheck /> : ''}                
              </div>
            : "You are not logged in !"}
          <br />
          {currentUser ? 
          <div>
              SellerId: {currentReportSelection.sellerId} <br />
              Start: {currentReportSelection.start} <br />
              End: {currentReportSelection.end} <br />
              Show Inactive: {currentReportSelection.showInactive ? 'true' : 'false'} <br />
              Show Deleted: {currentReportSelection.showDeleted ? 'true' : 'false'} <br />
              Reload Events: {currentReportSelection.reloadEvents} <br />
          </div> 
          : ''}
          {currentUser
            ? <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="mt-2 border border-solid border-black py-2 px-4 rounded cursor-pointer"
              >
            Logout
          </button>
            : ''
          }
        </p>
    </>
  );
}

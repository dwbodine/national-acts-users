import { VipEvent } from "@/types/event";
import { UserReportSelection } from "@/types/user";

export function cacheCurrentReportSelection(selection: UserReportSelection) : void {
    if (!selection || !sessionStorage) {
        return;
    }
    var json = JSON.stringify(selection);
    sessionStorage.setItem('currentReportSelection', json); 
}

export function restoreCurrentReportSelection() : UserReportSelection | undefined {
    if (sessionStorage) {
        var json = sessionStorage.getItem('currentReportSelection');
        if (json) {
            const selection: UserReportSelection = JSON.parse(json) as UserReportSelection;
            return selection;
        }
    }    
    return undefined;
}
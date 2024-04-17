import { UserReportSelection } from "@/types/user";

export function cacheCurrentReportSelection(selection: UserReportSelection) : void {
    if (!selection || !localStorage) {
        return;
    }
    var json = JSON.stringify(selection);
    localStorage.setItem('currentReportSelection', json); 
}

export function restoreCurrentReportSelection() : UserReportSelection | undefined {
    if (localStorage) {
        var json = localStorage.getItem('currentReportSelection');
        if (json) {
            const selection: UserReportSelection = JSON.parse(json) as UserReportSelection;
            return selection;
        }
    }    
    return undefined;
}

export function clearCurrentReportSelectionCache() {
    localStorage.removeItem('currentReportSelection');
}
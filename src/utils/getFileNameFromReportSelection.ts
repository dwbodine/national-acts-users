import { UserReportSelection } from "@/types/user";

export default function getFileNameFromReportSelection(currentReportSelection: UserReportSelection | undefined, fileNameStub?: string) {
    let fileName = '';
    if (currentReportSelection && currentReportSelection.seller) {
        const sellerName = currentReportSelection.seller.sellerName;
        const start = currentReportSelection.start;
        const end = currentReportSelection.end;
        let stub = '';
        if (fileNameStub) {
            stub = `_${fileNameStub}`;
        }
        fileName = `${sellerName}${stub}_${start}_${end}.csv`;
    }
    return fileName;
}
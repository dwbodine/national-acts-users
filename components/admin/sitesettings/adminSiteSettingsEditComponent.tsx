import { useGetSiteSettings } from "@/hooks/admin/useGetSiteSettings"
import { setAllSettings, setReloadSettings } from "@/lib/adminSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { RootState } from "@/lib/store";
import { GetSettingsResponse } from "@/types/public";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function AdminSiteSettingsEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getAllSettings } = useGetSiteSettings();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentAdminSelection.reloadSettings) {
                dispatch(setIsLoading(true));
                dispatch(setReloadSettings(false)); 
                getAllSettings().then((response: GetSettingsResponse) => {
                    if (response.settings && !response.settingsError) {
                        dispatch(setAllSettings(response.settings));
                    }
                    dispatch(setIsLoading(false));
                });
            }
        }, 500);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentAdminSelection, dispatch, getAllSettings]);

    let settingRows: any[] = [];
    if (currentAdminSelection.allSettings && currentAdminSelection.allSettings.length > 0) {
        currentAdminSelection.allSettings.forEach((setting) => {
            settingRows.push(<div>{setting.name} ({setting.type})</div>)
        })
    }

    return (
        <div>
            {settingRows}
        </div>
    );
}
import { useGetSiteSettings } from "@/hooks/admin/useGetSiteSettings"
import { setAllSettings, setReloadSettings } from "@/lib/adminSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { RootState } from "@/lib/store";
import { GetSettingsResponse, SiteSetting } from "@/types/public";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminFileUpload from "../common/adminFileUploadComponent";
import { Col, Row } from "react-bootstrap";


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

    const onFileUpload = (fileUploadName: string | undefined, filename: string | undefined) => {
        if (currentAdminSelection.allSettings && currentAdminSelection.allSettings.length == 0 && fileUploadName && filename) {
            return;
        }
        let adminSelection = { ...currentAdminSelection };
        switch (fileUploadName) {
            case 'HomeBanner':
                if (adminSelection.allSettings != undefined) {
                    const currentSettings = adminSelection.allSettings.map((originalSetting: SiteSetting) => {
                        let setting = { ...originalSetting };
                        if (setting.name == 'HomeBanner' && filename) {
                            setting.value = filename;
                            setting.dirty = true;
                        }
                        return setting;
                    });
                    dispatch(setAllSettings(currentSettings));
                }
                break;
            default:
                break;
        }
    };

    let settingRows: any[] = [];
    if (currentAdminSelection.allSettings && currentAdminSelection.allSettings.length > 0) {
        currentAdminSelection.allSettings.forEach((setting) => {
            switch (setting.type.toLowerCase()) {
                case 'image':
                case 'file':
                    const currentFileTitle = setting.type.toLowerCase() == 'image' ? "View Current Image: " : "View Current File: ";
                    let baseUrl = '';
                    switch (setting.name) {
                        case 'HomeBanner':
                            baseUrl = "https://www.national-acts.com/common/homebanners";
                            break;
                        default:
                            break;
                    }
                    settingRows.push(
                        <Row key={setting.settingId}>
                            <Col className="admin-setting-item">
                                <AdminFileUpload 
                                    Title={setting.displayName} 
                                    FileUploadName={setting.name} 
                                    OnUpLoad={onFileUpload} 
                                    CurrentFileName={setting.value}
                                    IsDirty={setting.dirty}
                                    CurrentFileTitle={currentFileTitle}
                                    BaseUrl={baseUrl}
                                />
                            </Col>
                        </Row>)
                    break;
                default:
                    settingRows.push(
                        <Row key={setting.settingId}>
                            <Col className="admin-setting-item">{setting.name} ({setting.type})</Col>
                        </Row>)
                    break;
            }

        })
    }

    return (
        <div className="admin-container">
            {settingRows}
        </div>
    );
}
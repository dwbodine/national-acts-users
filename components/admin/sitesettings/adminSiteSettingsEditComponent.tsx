import { useGetSiteSettings } from "@/hooks/admin/useGetSiteSettings"
import { setAllSettings, setReloadSettings } from "@/lib/adminSelectionSlice";
import { setIsLoading } from "@/lib/globalSelectionSlice";
import { RootState } from "@/lib/store";
import { GetSettingsResponse, SiteSetting, UpdateSettingResponse } from "@/types/public";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminFileUpload from "../common/adminFileUploadComponent";
import { Button, Col, Row } from "react-bootstrap";
import AdminListHomeButton from "../adminListHomeButton";
import { useUpdateSiteSetting } from "@/hooks/admin/useUpdateSiteSetting";
import { toast } from "react-toastify";
import router   from "next/router";


export default function AdminSiteSettingsEdit() {
    const currentAdminSelection = useSelector((state: RootState) => state.adminSelection);
    const dispatch = useDispatch();
    const { getAllSettings } = useGetSiteSettings();
    const { updateSiteSettings } = useUpdateSiteSetting();
    const [ isUploading, setIsUploading ] = useState(false);

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
        if (!currentAdminSelection.allSettings || currentAdminSelection.allSettings.length == 0 || !fileUploadName || !filename) {
            return;
        }
        const adminSelection = { ...currentAdminSelection };
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

    const onUploadStart = () => {
        setIsUploading(true);
    };

    const onUploadComplete = (filename: string | undefined) => {
        setIsUploading(false);
        if (filename) {
            toast.success('File uploaded successfully - click submit to save');
        } else {
            toast.error('File upload failed!');
        }
    };

    const onNumberChange = (settingName: string, settingValue: number | undefined) => {
        if (!currentAdminSelection.allSettings || currentAdminSelection.allSettings.length == 0 || !settingName) {
            return;
        }
        const adminSelection = { ...currentAdminSelection };
        if (adminSelection.allSettings != undefined) {
            const currentSettings = adminSelection.allSettings.map((originalSetting: SiteSetting) => {
                let setting = { ...originalSetting };
                if (setting.name == settingName) {
                    setting.value = settingValue?.toString() ?? '';
                    setting.dirty = true;
                }
                return setting;
            });
            dispatch(setAllSettings(currentSettings));    
        }        
    };

    const onTextChange = (settingName: string, settingValue: string | undefined) => {
        if (!currentAdminSelection.allSettings || currentAdminSelection.allSettings.length == 0 || !settingName) {
            return;
        }
        const adminSelection = { ...currentAdminSelection };
        if (adminSelection.allSettings != undefined) {
            const currentSettings = adminSelection.allSettings.map((originalSetting: SiteSetting) => {
                let setting = { ...originalSetting };
                if (setting.name == settingName) {
                    setting.value = settingValue ?? '';
                    setting.dirty = true;
                }
                return setting;
            });
            dispatch(setAllSettings(currentSettings));    
        }      
    };

    const onSubmit = () => {
        if (!currentAdminSelection.allSettings || currentAdminSelection.allSettings.length == 0) {
            return;
        }

        let allSettings = [ ...currentAdminSelection.allSettings ];
        const dirtySettings = allSettings.filter(x => x.dirty);
        if (!dirtySettings || dirtySettings.length == 0) {
            return;
        }

        updateSiteSettings(dirtySettings)
            .then((response: UpdateSettingResponse) => {
                if (response.success) {
                    toast.success('Settings saved successfully');
                    clearDirty();
                    router.push('/admin/');
                } else {
                    const err = response.settingsError ? response.settingsError : 'Errors occurred while saving settings';
                    toast.error(err);
                }
            });
     
    };

    const clearDirty = () => {
        if (!currentAdminSelection.allSettings || currentAdminSelection.allSettings.length == 0) {
            return;
        }
        const currentSettings = currentAdminSelection.allSettings.map((originalSetting: SiteSetting) => {
            let setting = { ...originalSetting };
            setting.dirty = false;
            return setting;
        });
        dispatch(setAllSettings(currentSettings));   
    };

    let settingRows: any[] = [];
    let hasDirtySettings: boolean = false;
    if (currentAdminSelection.allSettings && currentAdminSelection.allSettings.length > 0) {
        currentAdminSelection.allSettings.forEach((setting) => {
            if (!hasDirtySettings) {
                hasDirtySettings = setting.dirty ?? false;
            }
            switch (setting.type.toLowerCase()) {
                case 'image':
                case 'file':
                    const currentFileTitle = setting.type.toLowerCase() == 'image' ? "View Current Image: " : "View Current File: ";
                    let baseUrl = '';
                    switch (setting.name) {
                        case 'HomeBanner':
                            baseUrl = `${process.env.NEXT_PUBLIC_WWW_URL}/common/homebanners`;
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
                                    OnUploadStart={onUploadStart}
                                    OnUploadComplete={onUploadComplete}
                                />
                            </Col>
                        </Row>)
                    break;
                case 'number':
                    settingRows.push(
                        <Row key={setting.settingId}>
                            <Col className="admin-setting-item">
                                <div className="admin-setting-title">{setting.displayName}</div>
                                <input 
                                    type="number" 
                                    name={setting.name} 
                                    value={setting.value} 
                                    onChange={(e) => onNumberChange(setting.name, parseFloat(e.target.value))}
                                />
                            </Col>
                        </Row>
                    )
                    break;
                case 'text':
                    settingRows.push(
                        <Row key={setting.settingId}>
                            <Col className="admin-setting-item">
                                <div className="admin-setting-title">{setting.displayName}</div>
                                <input 
                                    type="text" 
                                    name={setting.name} 
                                    value={setting.value} 
                                    onChange={(e) => onTextChange(setting.name, e.target.value)}
                                />
                            </Col>
                        </Row>
                    )
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
            <Row>
                <Col>
                    <Button disabled={!hasDirtySettings && isUploading} onClick={onSubmit}>Submit</Button>
                    <AdminListHomeButton />
                </Col>
            </Row>
        </div>
    );
}
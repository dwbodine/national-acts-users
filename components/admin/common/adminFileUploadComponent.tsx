import { useUploadFile } from "@/hooks/common/useUploadFile";
import { ChangeEvent, useEffect, useState } from "react";


export default function AdminFileUpload(props: any) {
    const title: string = props?.Title ?? '';
    const currentFileTitle: string = props?.CurrentFileTitle ?? 'Current file: ';
    const fileUploadName: string = props?.FileUploadName ?? '';
    const onUpload = props?.OnUpLoad;
    const onUploadStart = props?.OnUploadStart;
    const onUploadComplete = props?.OnUploadComplete;
    let currentFileName: string | undefined = props?.CurrentFileName;
    const isDirty = props?.IsDirty ?? false;
    const baseUrl = props?.BaseUrl ?? '';

    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    
    const { uploadTempFile } = useUploadFile();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const file: File = event.target.files[0];
            if (file) {
                if (onUploadStart) {
                    onUploadStart();
                }
                setIsUploaded(false);
                setIsUploading(true);
                uploadTempFile(file)
                    .then((filename: string | undefined) => {
                        if (onUpload && filename) {
                            onUpload(fileUploadName, filename);
                        }
                        setIsUploading(false);
                        setIsUploaded(true);
                        event.target.value = '';
                        if (onUploadComplete) {
                            onUploadComplete(filename);
                        }
                    });
            }
        }
    };

    const currentFileLink = !isDirty && baseUrl && currentFileName ? 
        <a target="_blank" href={`${baseUrl}/${currentFileName}`}>{currentFileName}</a> : 
        currentFileName;

    if (currentFileName == 'None') {
        currentFileName = undefined;
    }

    return (
        <div>
            <div className="admin-setting-title">{title}</div>
            <input type="file" onChange={handleFileChange} />
            <span className="danger" hidden={!isUploading}>Uploading...</span>
            <span className="success" hidden={!isUploaded && !isDirty}>Uploaded!</span>
            <div className="admin-current-file-title" hidden={!currentFileName && !isDirty}>{currentFileTitle} {currentFileLink}</div>
        </div>
    );
}
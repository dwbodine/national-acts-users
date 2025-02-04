import { useUploadFile } from "@/hooks/common/useUploadFile";
import { ChangeEvent, useState } from "react";


export default function AdminFileUpload(props: any) {
    const title: string = props?.Title ?? '';
    const currentFileTitle: string = props?.CurrentFileTitle ?? 'Current file: ';
    const fileUploadName: string = props?.FileUploadName ?? '';
    const onUpload = props?.OnUpLoad;
    const currentFileName: string | undefined = props?.CurrentFileName;
    const isDirty = props?.IsDirty ?? false;
    const baseUrl = props?.BaseUrl ?? '';

    const [isUploading, setIsUploading] = useState(false);
    
    const { uploadTempFile } = useUploadFile();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file) {
                setIsUploading(true);
                uploadTempFile(file)
                    .then((filename: string | undefined) => {
                        if (onUpload && filename) {
                            onUpload(fileUploadName, filename);
                        }
                        setIsUploading(false);
                        event.target.value = '';                   
                    });
            }
        }

    };

    const currentFileLink = baseUrl && currentFileName ? 
        <a target="_blank" href={`${baseUrl}/${currentFileName}`}>{currentFileName}</a> : 
        currentFileName;

    return (
        <div>
            <div className="admin-setting-title">{title}</div>
            <input type="file" onChange={handleFileChange} />
            <span className="danger" hidden={!isUploading}>Uploading...</span>
            <div className="admin-current-file-title" hidden={!currentFileName && !isDirty}>{currentFileTitle} {currentFileLink}</div>
        </div>
    );
}
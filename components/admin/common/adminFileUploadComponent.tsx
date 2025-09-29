import { ChangeEvent, ReactElement, useState } from "react";
import { AdminFileUploadProps } from "@/types/props";
import { FaTimesCircle } from "react-icons/fa";
import { useUploadFile } from "@/hooks/common/useUploadFile";


export default function AdminFileUpload(props: AdminFileUploadProps) {
    const title: string = props?.Title ?? '';
    const currentFileTitle: string = props?.CurrentFileTitle ?? 'Current file: ';
    const fileUploadName: string = props?.FileUploadName ?? '';
    const onUpload = props?.OnUpload;
    const onUploadStart = props?.OnUploadStart;
    const onUploadComplete = props?.OnUploadComplete;
    const showRemoveButton = props?.ShowRemoveButton ?? false;
    const onFileRemove = props?.OnFileRemove;
    let currentFileName: string | undefined = props?.CurrentFileName ?? undefined;
    const isDirty = props?.IsDirty ?? false;
    const baseUrl = props?.BaseUrl ?? '';

    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);

    const { uploadTempFile } = useUploadFile();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target && event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0] as File;
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

    const handleFileRemove = () => {
        if (onFileRemove) {
            onFileRemove();
        }
    };

    if (currentFileName === 'None') {
        currentFileName = undefined;
    } else if (currentFileName && !currentFileName?.startsWith("http")) {
        currentFileName = `${baseUrl}/${currentFileName}`;
    }

    const currentFileLink = !isDirty && currentFileName ?
        <a target="_blank" href={currentFileName}>{currentFileName}</a> :
        currentFileName;



    let removeButton: ReactElement = <></>;
    if (showRemoveButton && currentFileName) {
        removeButton = <FaTimesCircle className="admin-current-file-remove" onClick={handleFileRemove} title={`Remove ${currentFileName}`} />;
    }

    return (
        <div className="admin-file-upload">
            <div className="admin-setting-title">{title}</div>
            <input type="file" onChange={handleFileChange} />
            <span className="danger" hidden={!isUploading}>Uploading...</span>
            <span className="success" hidden={!isUploaded && !isDirty}>Updated!</span>
            <div className="admin-current-file-title" hidden={!currentFileName && !isDirty}>{currentFileTitle} {currentFileLink} {removeButton}</div>
        </div>
    );
}
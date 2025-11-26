'use client';

import { Button, Uploader } from 'rsuite';
import { AdminFileUploadProps } from '@/types/props';
import { FaTimesCircle } from 'react-icons/fa';
import { FileType } from 'rsuite/esm/Uploader';
import { ImageType } from '@/constants';
import { useState } from 'react';
import { useUploadImage } from '@/hooks/common/useUploadImage';

export default function AdminFileUpload(props: AdminFileUploadProps) {
  const {
    Title: title = '',
    CurrentFileTitle: currentFileTitle = 'Current file: ',
    FileUploadName: fileUploadName = '',
    CurrentFileName,
    OnUpload: onUpload,
    OnUploadStart: onUploadStart,
    OnUploadComplete: onUploadComplete,
    ShowRemoveButton: showRemoveButton = false,
    OnFileRemove: onFileRemove,
    IsDirty: isDirty = false,
    ImageType: imageType,
  } = props;

  const { uploadImage } = useUploadImage();

  const getBaseUrl = (uploadType: ImageType) => {
    switch (uploadType) {
      case ImageType.HEADERS:
        return process.env['NEXT_PUBLIC_HEADERS_URL'];
      case ImageType.HOMEBANNERS:
        return process.env['NEXT_PUBLIC_HOMEBANNERS_URL'];
      case ImageType.LOGOS:
        return process.env['NEXT_PUBLIC_LOGOS_URL'];
      case ImageType.PREVIEWS:
        return process.env['NEXT_PUBLIC_PREVIEW_URL'];
      case ImageType.THUMBNAILS:
        return process.env['NEXT_PUBLIC_THUMBNAILS_URL'];
      default:
        return '';
    }
  };

  const baseUrl = getBaseUrl(imageType);

  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileList, setFileList] = useState<FileType[]>([]);

  // Normalize current file link
  const currentFileName =
    CurrentFileName && CurrentFileName !== 'None'
      ? CurrentFileName.startsWith('http')
        ? CurrentFileName
        : `${baseUrl}/${CurrentFileName}`
      : undefined;

  const currentFileLink = currentFileName ? (
    <a href={currentFileName} target="_blank">
      {currentFileName}
    </a>
  ) : (
    ''
  );

  const handleFileChange = async (newFiles: FileType[]) => {
    // RSuite gives an array of FileItems:
    // FileList[0].blobFile is the raw File
    const file = newFiles?.[0]?.blobFile;

    if (!file) {
      return;
    }

    if (onUploadStart) {
      onUploadStart();
    }

    setIsUploaded(false);
    setIsUploading(true);

    const filename = await uploadImage(file, imageType);

    setIsUploading(false);

    if (filename && onUpload) {
      onUpload(fileUploadName, filename);
      setIsUploaded(true);

      if (onUploadComplete) {
        onUploadComplete(filename);
      }

      // Reset the RSuite uploader’s file list
      setFileList([]);
    }
  };

  const handleFileRemove = () => {
    if (onFileRemove) {
      onFileRemove();
    }
  };

  const removeButton =
    showRemoveButton && currentFileName ? (
      <FaTimesCircle
        className="admin-current-file-remove"
        title={`Remove ${currentFileName}`}
        onClick={handleFileRemove}
      />
    ) : (
      <></>
    );

  return (
    <div className="admin-file-upload">
      <div className="admin-setting-title">{title}</div>

      <Uploader
        action=""
        autoUpload={false}
        fileList={fileList}
        onChange={(newList) => {
          setFileList(newList);
          void handleFileChange(newList);
        }}
      >
        <Button appearance="primary">Select File</Button>
      </Uploader>

      <span className="danger" hidden={!isUploading}>
        Uploading...
      </span>
      <span className="success" hidden={!isUploaded && !isDirty}>
        Updated!
      </span>

      <div className="admin-current-file-title" hidden={!currentFileName}>
        {currentFileTitle} {currentFileLink} {removeButton}
      </div>
    </div>
  );
}

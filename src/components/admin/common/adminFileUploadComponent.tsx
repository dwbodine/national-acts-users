'use client';

import { ChangeEvent, ReactElement, useState } from 'react';
import { AdminFileUploadProps } from '@/types/props';
import { FaTimesCircle } from 'react-icons/fa';
import { ImageType } from '@/constants';
import { useUploadImage } from '@/hooks/common/useUploadImage';

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

  const getBaseUrl = (uploadImageType: ImageType) => {
    switch (uploadImageType) {
      case ImageType.HEADERS:
        return `${process.env['NEXT_PUBLIC_HEADERS_URL']}`;
        break;
      case ImageType.HOMEBANNERS:
        return `${process.env['NEXT_PUBLIC_HOMEBANNERS_URL']}`;
        break;
      case ImageType.LOGOS:
        return `${process.env['NEXT_PUBLIC_LOGOS_URL']}`;
        break;
      case ImageType.PREVIEWS:
        return `${process.env['NEXT_PUBLIC_PREVIEW_URL']}`;
        break;
      case ImageType.THUMBNAILS:
        return `${process.env['NEXT_PUBLIC_THUMBNAILS_URL']}`;
        break;
      default:
        return '';
        break;
    }
  };

  const imageType = props.ImageType;
  const baseUrl = getBaseUrl(imageType);

  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const { uploadImage } = useUploadImage();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target && event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file) {
        if (onUploadStart) {
          onUploadStart();
        }
        setIsUploaded(false);
        setIsUploading(true);
        void uploadImage(file, imageType).then((filename: string | undefined) => {
          setIsUploading(false);
          event.target.value = '';
          if (onUpload && filename) {
            onUpload(fileUploadName, filename);
            setIsUploaded(true);
            if (onUploadComplete) {
              onUploadComplete(filename);
            }
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
  } else if (currentFileName && !currentFileName?.startsWith('http')) {
    currentFileName = `${baseUrl}/${currentFileName}`;
  }

  const currentFileLink = currentFileName ? (
    <a target="_blank" href={currentFileName}>
      {currentFileName}
    </a>
  ) : (
    ''
  );

  let removeButton: ReactElement = <></>;
  if (showRemoveButton && currentFileName) {
    removeButton = (
      <FaTimesCircle
        className="admin-current-file-remove"
        onClick={handleFileRemove}
        title={`Remove ${currentFileName}`}
      />
    );
  }

  return (
    <div className="admin-file-upload">
      <div className="admin-setting-title">{title}</div>
      <input type="file" onChange={handleFileChange} />
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

'use client';

import { useState } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { Button, Uploader } from 'rsuite';
import { FileType } from 'rsuite/esm/Uploader';

import { ImageType } from '@/constants';
import { useUploadImage } from '@/hooks/common/useUploadImage';
import { AdminMultiFileUploadProps } from '@/types/props';

const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const ACCEPTED_IMAGE_TYPES = ACCEPTED_IMAGE_EXTENSIONS.join(',');

export default function AdminMultiFileUpload(props: AdminMultiFileUploadProps) {
  const {
    CurrentFileNames,
    CurrentFileTitle: currentFileTitle = 'Current files: ',
    FileUploadName: fileUploadName = '',
    ImageType: imageType,
    IsDirty: isDirty = false,
    OnFileRemove: onFileRemove,
    OnUpload: onUpload,
    OnUploadComplete: onUploadComplete,
    OnUploadStart: onUploadStart,
    ShowRemoveButton: showRemoveButton = false,
    Title: title = '',
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
      case ImageType.FEATURED_ARTISTS:
        return process.env['NEXT_PUBLIC_FEATURED_ARTISTS_URL'];
      default:
        return '';
    }
  };

  const baseUrl = getBaseUrl(imageType);

  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileList, setFileList] = useState<FileType[]>([]);
  const [invalidFileNames, setInvalidFileNames] = useState<string[]>([]);
  const [failedFileNames, setFailedFileNames] = useState<string[]>([]);

  const normalizeFileName = (fileName: string) =>
    fileName.startsWith('http') ? fileName : `${baseUrl}/${fileName}`;

  const currentFileNames =
    CurrentFileNames?.filter((fileName) => fileName && fileName !== 'None').map(
      normalizeFileName,
    ) ?? [];

  const isAcceptedImage = (file: File) => {
    const fileName = file.name.toLowerCase();
    return ACCEPTED_IMAGE_EXTENSIONS.some((extension) => fileName.endsWith(extension));
  };

  const uploadFile = async (file: File) => {
    const uploadedFileName = await uploadImage(file, imageType);

    return {
      originalFileName: file.name,
      uploadedFileName,
    };
  };

  const handleFileChange = async (newFiles: FileType[]) => {
    const selectedFiles = newFiles
      .map((fileItem) => fileItem.blobFile)
      .filter((file): file is File => Boolean(file));

    const validFiles = selectedFiles.filter(isAcceptedImage);
    const invalidFiles = selectedFiles.filter((file) => !isAcceptedImage(file));

    setInvalidFileNames(invalidFiles.map((file) => file.name));
    setFailedFileNames([]);

    if (!validFiles.length) {
      setFileList([]);
      return;
    }

    if (onUploadStart) {
      onUploadStart();
    }

    setIsUploaded(false);
    setIsUploading(true);

    const uploadResults = await Promise.all(validFiles.map(uploadFile));
    const uploadedFileNames = uploadResults
      .map((result) => result.uploadedFileName)
      .filter((fileName): fileName is string => Boolean(fileName));

    const failedUploads = uploadResults.filter((result) => !result.uploadedFileName);

    setIsUploading(false);
    setFailedFileNames(failedUploads.map((result) => result.originalFileName));

    if (uploadedFileNames.length && onUpload) {
      onUpload(fileUploadName, uploadedFileNames);
      setIsUploaded(true);

      if (onUploadComplete) {
        onUploadComplete(uploadedFileNames);
      }
    }

    setFileList([]);
  };

  const handleFileRemove = (fileName: string) => {
    if (onFileRemove) {
      onFileRemove(fileName);
    }
  };

  const currentFileLinks = currentFileNames.map((currentFileName) => (
    <div key={currentFileName}>
      <a href={currentFileName} target="_blank" rel="noreferrer">
        {currentFileName}
      </a>
      {showRemoveButton && (
        <FaTimesCircle
          className="admin-current-file-remove"
          title={`Remove ${currentFileName}`}
          onClick={() => {
            handleFileRemove(currentFileName);
          }}
        />
      )}
    </div>
  ));

  return (
    <div className="admin-file-upload">
      <div className="admin-setting-title">{title}</div>

      <Uploader
        accept={ACCEPTED_IMAGE_TYPES}
        action=""
        autoUpload={false}
        disabled={isUploading}
        draggable
        fileList={fileList}
        fileListVisible={false}
        multiple
        onChange={(newList) => {
          const validList = newList.filter(
            (fileItem) => fileItem.blobFile && isAcceptedImage(fileItem.blobFile),
          );
          setFileList(validList);
          void handleFileChange(newList);
        }}
      >
        <Button appearance="primary">Select or Drop Image Files</Button>
      </Uploader>

      <span className="danger" hidden={!isUploading}>
        Uploading...
      </span>
      <span className="success" hidden={!isUploaded && !isDirty}>
        Updated!
      </span>
      <span className="danger" hidden={!invalidFileNames.length}>
        Only JPG, JPEG, and PNG files are supported: {invalidFileNames.join(', ')}
      </span>
      <span className="danger" hidden={!failedFileNames.length}>
        Upload failed: {failedFileNames.join(', ')}
      </span>

      <div className="admin-current-file-title" hidden={!currentFileNames.length}>
        {currentFileTitle} {currentFileLinks}
      </div>
    </div>
  );
}

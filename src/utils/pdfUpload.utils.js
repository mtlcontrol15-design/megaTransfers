import {
  pick,
  types,
  errorCodes,
  isErrorWithCode,
} from "@react-native-documents/picker";
import toastUtils from '../utils/Toast/toast';
import { uploadFileToServer } from './imageUpload.utils';

export const pickAndUploadPDF = async (setIsUploading) => {
  try {
    const result = await pick({
      type: ['application/pdf'], // ✅ Only PDF
      allowMultiSelection: false,
    });

    const file = result?.[0];

    if (!file) return null;

    // Validate PDF (extra safety)
    if (file.type !== 'application/pdf') {
      toastUtils.showError("Invalid File", "Only PDF files are allowed");
      return null;
    }

    const formattedFile = {
      uri: file.uri,
      type: 'application/pdf',
      name: file.name || `document_${Date.now()}.pdf`,
    };

    const url = await uploadFileToServer(formattedFile, setIsUploading);

    console.log('=======url is here', url);



    return url;

  } catch (error) {
    if (error?.code === 'DOCUMENT_PICKER_CANCELED') {
      return null; // user cancelled
    }

    toastUtils.showError(
      "Upload Failed",
      error?.message || "PDF upload failed"
    );

    return null;
  }
};

export const pickAndUploadDriverDocument = async (setIsUploading) => {
  try {
    const result = await pick({
      type: [types.pdf, types.images],
      allowMultiSelection: false,
    });

    const file = result?.[0];

    if (!file) return null;

    // Some Android file providers may ignore requested types
    if (file.hasRequestedType === false) {
      toastUtils.showError(
        "Invalid File",
        "Please select a PDF or image"
      );
      return null;
    }

    const fileType = file.type || "application/octet-stream";

    const isPDF = fileType === "application/pdf";
    const isImage = fileType.startsWith("image/");

    if (!isPDF && !isImage) {
      toastUtils.showError(
        "Invalid File",
        "Only PDF and image files are allowed"
      );
      return null;
    }

    const formattedFile = {
      uri: file.uri,
      type: fileType,
      name:
        file.name ||
        (isPDF
          ? `document_${Date.now()}.pdf`
          : `image_${Date.now()}.jpg`),
    };

    return await uploadFileToServer(
      formattedFile,
      setIsUploading
    );
  } catch (error) {
    if (
      isErrorWithCode(error) &&
      error.code === errorCodes.OPERATION_CANCELED
    ) {
      return null;
    }

    toastUtils.showError(
      "Upload Failed",
      error?.message || "Document upload failed"
    );

    return null;
  }
};
export const uploadImageToBackend = async (image, setIsImageUploading) => {
  try {
    setIsImageUploading?.(true); 

    const data = new FormData();

    data.append("image", {
      uri: image.uri,
      type: image.type || "image/jpeg",
      name: image.fileName || "profile.jpg",
    });

    const BACKEND_URL = "https://api.mtldispatch.com/api/upload"; 

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const json = await res.json();
    console.log("=======json", json);

    if (!res.ok || !json?.success) {
      throw new Error(json?.message || "Image upload failed via backend");
    }

    return json.imageUrl; 

  } catch (err) {
    console.log("Upload Error:", err);
    throw err;
  } finally {
    setIsImageUploading?.(false); 
  }
};

export const uploadFileToServer = async (file, setIsUploading) => {
  try {
    setIsUploading?.(true);

    const fileType = file.type || file.mimeType || "image/jpeg";

    let defaultName = "file.jpg";
    if (fileType === "application/pdf") {
      defaultName = "document.pdf";
    } else if (fileType === "application/msword") {
      defaultName = "document.doc";
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      defaultName = "document.docx";
    } else if (fileType.startsWith("video/")) {
      defaultName = "video.mp4";
    }

    const finalFileName = file.fileName || file.name || defaultName;

    const data = new FormData();
    data.append("image", {
      uri: file.uri,
      type: fileType,
      name: finalFileName,
    });

    const BACKEND_URL = "https://api.mtldispatch.com/api/upload";

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const json = await res.json();
    console.log("Upload Response:", json);

    if (!res.ok || !json?.success) {
      throw new Error(json?.message || "File upload failed");
    }

    return json.imageUrl;

  } catch (err) {
    console.log("Upload Error:", err);
    throw err;
  } finally {
    setIsUploading?.(false);
  }
};
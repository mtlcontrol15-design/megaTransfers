export const uploadDocumentToCloudinary = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const data = new FormData();

    data.append("file", {
      uri: file.uri,
      type: file.type || "application/octet-stream",
      name: file.name || `document_${Date.now()}`,
    });

    data.append("upload_preset", "MtlDispatch");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ddpowdlxi/auto/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    if (!res.ok || !json?.secure_url) {
      throw new Error(json?.error?.message || "Document upload failed");
    }

    return json.secure_url;

  } catch (err) {
    console.log("Document Upload Error:", err);
    throw err;
  }
};

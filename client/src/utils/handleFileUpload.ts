import axios from "axios";
import { toast } from "sooner";

const serverUrl = import.meta.env.VITE_PRODUCTION_API_URL as string;

interface UploadResponseData {
  success: boolean;
  data?: {
    Location: string;
  };
}

interface InitiateUploadResponse {
  response: {
    uploadId: string;
  };
}

interface PresignedUrlsResponse {
  urls: string[];
}

export const handleFileUpload = async (
  file: File | null,
  setIsLoading: (loading: boolean) => void,
  setUploadProgress: (progress: number) => void,
  token: string
): Promise<string> => {
  if (!file) {
    toast.info("Please select a file");
    setIsLoading(false);
    return "";
  }

  try {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
    const fileName = `${Date.now().toString()}_${file.name}`;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    // Initiate upload
    const initiateUploadRes = await fetch(
      `${serverUrl}/upload/initiate-upload`,
      {
        method: "POST",
        body: JSON.stringify({ fileName, filetype: file.type }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!initiateUploadRes.ok) {
      throw new Error("Failed to initiate upload");
    }

    const { response: { uploadId } } = await initiateUploadRes.json() as InitiateUploadResponse;

    // Prepare chunks
    let start = 0;
    const chunks: { chunk: Blob; partNumber: number }[] = [];
    for (let i = 1; i <= totalChunks; i++) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      chunks.push({ chunk, partNumber: i });
      start = end;
    }

    // Get presigned URLs
    const presignedUrlsRes = await fetch(
      `${serverUrl}/upload/generate-presigned-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName,
          uploadId,
          filetype: file.type,
          numChunks: totalChunks,
        }),
      }
    );

    if (!presignedUrlsRes.ok) {
      throw new Error("Failed to get presigned URLs");
    }

    const { urls } = await presignedUrlsRes.json() as PresignedUrlsResponse;

    // Upload chunks
    await Promise.all(
      chunks.map(async (chunk, i) => {
        try {
          const uploadChunk = await fetch(urls[i], {
            method: "PUT",
            body: chunk.chunk,
            headers: {
              "Content-Type": file.type,
              "Content-Length": chunk.chunk.size.toString(),
            },
          });

          if (!uploadChunk.ok) {
            throw new Error(`Failed to upload chunk ${i}`);
          }

          const progress = Math.floor(((i + 1) / totalChunks) * 100);
          setUploadProgress(progress);
        } catch (error) {
          console.error(`Error uploading chunk ${i} of file ${file.name}`, error);
          toast.info(`Error uploading ${file.name}`);
        }
      })
    );

    // Complete upload
    const uploadResponse = await axios.post<UploadResponseData>(
      `${serverUrl}/upload/complete-upload`,
      { fileName, uploadId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!uploadResponse.data.success || !uploadResponse.data.data?.Location) {
      throw new Error("Error completing upload");
    }

    return uploadResponse.data.data.Location;
  } catch (error) {
    console.error("Upload error:", error);
    setIsLoading(false);
    // Fallback to default image if upload fails
    return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcXmPNYZ-XDmbuO5gzHPM-sq33yAn0EFQepA&s";
  }
};
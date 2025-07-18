import { useState } from "react";
import axios, { type AxiosResponse } from "axios";
import { toast } from "sonner";

const serverUrl = import.meta.env.VITE_PRODUCTION_API_URL as string;

interface InitiateUploadResponse {
  response: {
    uploadId: string;
  };
}

interface PresignedUrlsResponse {
  urls: string[];
}

interface CompleteUploadResponse {
  success: boolean;
  data?: {
    Location: string;
  };
}

interface Chunk {
  chunk: Blob;
  partNumber: number;
}

export const useFileUploader = () => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("token") as string;

  const uploadFile = async (file: File | null): Promise<string | null> => {
    if (!file) {
      toast.info("Please select a file");
      return null;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
      const fileName = `${Date.now().toString()}_${file.name}`;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      // Step 1: Initiate Upload
      const initiateUploadRes = await fetch(
        `${serverUrl}upload/initiate-upload`,
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

      // Step 2: Slice file into chunks
      const chunks: Chunk[] = [];
      let start = 0;
      for (let i = 1; i <= totalChunks; i++) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        chunks.push({ chunk, partNumber: i });
        start = end;
      }

      // Step 3: Get Pre-signed URLs
      const presignedUrlsRes = await fetch(
        `${serverUrl}upload/generate-presigned-url`,
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

      // Step 4: Upload chunks
      await Promise.all(
        chunks.map(async (chunk, i) => {
          const response = await fetch(urls[i], {
            method: "PUT",
            body: chunk.chunk,
            headers: {
              "Content-Type": file.type,
              "Content-Length": chunk.chunk.size.toString(),
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to upload chunk ${i + 1}`);
          }

          setUploadProgress(Math.floor(((i + 1) / totalChunks) * 100));
        })
      );

      // Step 5: Complete Upload
      const uploadResponse: AxiosResponse<CompleteUploadResponse> = await axios.post(
        `${serverUrl}upload/complete-upload`,
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
      toast.error("Failed to upload file.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadFile, uploadProgress, isLoading };
};
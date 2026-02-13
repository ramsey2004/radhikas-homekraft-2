'use client';

import { useState } from 'react';

export interface UploadedImage {
  publicUrl: string;
  filename: string;
  width: number;
  height: number;
  size: number;
}

export interface UploadProgress {
  file: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function useImageUpload() {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const uploadImage = async (file: File, productId?: string): Promise<UploadedImage | null> => {
    const fileName = file.name;

    setUploads((prev) => [
      ...prev,
      { file: fileName, progress: 0, status: 'pending' },
    ]);

    try {
      // Validate file before upload
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        throw new Error('File size must be less than 10MB');
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.file === fileName ? { ...u, progress: 10, status: 'uploading' } : u
        )
      );

      const formData = new FormData();
      formData.append('file', file);
      if (productId) {
        formData.append('productId', productId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      const imageData = data.data;

      setUploads((prev) =>
        prev.map((u) =>
          u.file === fileName ? { ...u, progress: 100, status: 'success' } : u
        )
      );

      setUploadedImages((prev) => [
        ...prev,
        {
          publicUrl: imageData.publicUrl,
          filename: imageData.filename,
          width: imageData.width,
          height: imageData.height,
          size: imageData.size,
        },
      ]);

      return imageData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploads((prev) =>
        prev.map((u) =>
          u.file === fileName
            ? { ...u, progress: 0, status: 'error', error: errorMessage }
            : u
        )
      );
      return null;
    }
  };

  const uploadBatch = async (files: File[], productId?: string) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    if (productId) {
      formData.append('productId', productId);
    }

    setUploads((prev) => [
      ...prev,
      ...files.map((f) => ({
        file: f.name,
        progress: 10,
        status: 'uploading' as const,
      })),
    ]);

    try {
      const response = await fetch('/api/upload/batch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Batch upload failed with status ${response.status}`);
      }

      const result = await response.json();

      // Update successful uploads
      if (result.data.successful) {
        result.data.successful.forEach((img: UploadedImage) => {
          setUploadedImages((prev) => [...prev, img]);
          setUploads((prev) =>
            prev.map((u) =>
              u.file === img.filename
                ? { ...u, progress: 100, status: 'success' }
                : u
            )
          );
        });
      }

      // Mark failed uploads
      if (result.data.failed) {
        result.data.failed.forEach(
          (failed: { filename: string; error: string }) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.file === failed.filename
                  ? {
                      ...u,
                      progress: 0,
                      status: 'error',
                      error: failed.error,
                    }
                  : u
              )
            );
          }
        );
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch upload failed';
      files.forEach((file) => {
        setUploads((prev) =>
          prev.map((u) =>
            u.file === file.name
              ? { ...u, progress: 0, status: 'error', error: errorMessage }
              : u
          )
        );
      });
      throw err;
    }
  };

  const clearUploads = () => {
    setUploads([]);
  };

  const removeImage = (filename: string) => {
    setUploadedImages((prev) =>
      prev.filter((img) => img.filename !== filename)
    );
  };

  return {
    uploads,
    uploadedImages,
    uploadImage,
    uploadBatch,
    clearUploads,
    removeImage,
  };
}

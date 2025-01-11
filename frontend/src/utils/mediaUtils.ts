import { v4 as uuidv4 } from 'uuid';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT'
}

export interface MediaMetadata {
  id: string;
  type: MediaType;
  name: string;
  size: number;
  mimeType: string;
  url?: string;
  thumbnailUrl?: string;
  uploadedAt: number;
}

export class MediaUtils {
  // File size limits
  private static fileSizeLimits = {
    [MediaType.IMAGE]: 5 * 1024 * 1024, // 5MB
    [MediaType.VIDEO]: 50 * 1024 * 1024, // 50MB
    [MediaType.AUDIO]: 10 * 1024 * 1024, // 10MB
    [MediaType.DOCUMENT]: 20 * 1024 * 1024 // 20MB
  };

  // Allowed file types
  private static allowedFileTypes = {
    [MediaType.IMAGE]: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    [MediaType.VIDEO]: ['video/mp4', 'video/webm', 'video/mpeg'],
    [MediaType.AUDIO]: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    [MediaType.DOCUMENT]: [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  };

  // Validate file
  static validateFile(
    file: File, 
    options?: {
      type?: MediaType;
      maxSize?: number;
    }
  ): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const type = options?.type || this.detectMediaType(file.type);
    const maxSize = options?.maxSize || this.fileSizeLimits[type];

    // Check file type
    if (!this.allowedFileTypes[type].includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${this.allowedFileTypes[type].join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds limit of ${maxSize / 1024 / 1024}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Detect media type from MIME type
  static detectMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    if (mimeType.startsWith('audio/')) return MediaType.AUDIO;
    return MediaType.DOCUMENT;
  }

  // Generate thumbnail for image/video
  static async generateThumbnail(
    file: File, 
    options?: {
      width?: number;
      height?: number;
    }
  ): Promise<string | null> {
    const { width = 200, height = 200 } = options || {};

    return new Promise((resolve, reject) => {
      // Only for image and video types
      if (!['image', 'video'].includes(file.type.split('/')[0])) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = width;
          canvas.height = height;

          // Crop and scale
          const scale = Math.max(
            width / img.width, 
            height / img.height
          );
          
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          const x = (width - scaledWidth) / 2;
          const y = (height - scaledHeight) / 2;

          ctx.drawImage(
            img, 
            x, 
            y, 
            scaledWidth, 
            scaledHeight
          );

          resolve(canvas.toDataURL());
        };
        img.src = event.target.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Compress image
  static async compressImage(
    file: File, 
    options?: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<File> {
    const { 
      maxWidth = 1920, 
      maxHeight = 1080, 
      quality = 0.7 
    } = options || {};

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate scaling
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob((blob) => {
            const compressedFile = new File(
              [blob], 
              file.name, 
              { type: file.type }
            );
            resolve(compressedFile);
          }, file.type, quality);
        };
        img.src = event.target.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Create media metadata
  static createMediaMetadata(
    file: File, 
    uploadUrl?: string
  ): MediaMetadata {
    return {
      id: uuidv4(),
      type: this.detectMediaType(file.type),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      url: uploadUrl,
      uploadedAt: Date.now()
    };
  }

  // Format file size
  static formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }
}

// Example usage
export const mediaUtils = MediaUtils;

// File validation
const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
const validationResult = mediaUtils.validateFile(file, {
  type: MediaType.IMAGE
});

// Generate thumbnail
mediaUtils.generateThumbnail(file).then(thumbnailUrl => {
  console.log('Thumbnail generated:', thumbnailUrl);
});

// Compress image
mediaUtils.compressImage(file, {
  maxWidth: 800,
  quality: 0.6
}).then(compressedFile => {
  // Upload compressed file
});
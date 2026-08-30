/**
 * Image processing & validation utilities
 */

export interface ImageValidationResult {
  isValid: boolean;
  message?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates uploaded image file buffer and mimetype
 */
export const validateImageBuffer = (
  mimetype: string,
  sizeInBytes: number
): ImageValidationResult => {
  if (!ALLOWED_MIME_TYPES.includes(mimetype.toLowerCase())) {
    return {
      isValid: false,
      message: "Only JPG, JPEG, PNG and WEBP image formats are supported",
    };
  }

  if (sizeInBytes > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      message: "Image size exceeds maximum limit of 5 MB",
    };
  }

  return { isValid: true };
};

/**
 * Generates a default user profile avatar URL based on full name initials
 */
export const generateDefaultAvatarUrl = (fullName: string): string => {
  const encodedName = encodeURIComponent(fullName.trim());
  return `https://ui-avatars.com/api/?name=${encodedName}&background=random&color=fff`;
};

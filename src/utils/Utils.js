// utils.js
export const formatFileSize = (sizeInBytes) => {
    const sizeInKB = sizeInBytes / 1024;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
  
    if (sizeInGB >= 1) {
      return `${sizeInGB.toFixed(2)} GB`;
    } else if (sizeInMB >= 1) {
        return `${sizeInMB.toFixed(2)} MB`;
    } else {
        return `${sizeInKB.toFixed(2)} KB`;
    }
  };
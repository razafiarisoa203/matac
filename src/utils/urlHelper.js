export const buildCitizenPhotoUrl = (photoPath) => {
  if (!photoPath) return null;

  if (photoPath.startsWith('http')) {
    return photoPath.replace('hello/', 'preview/hello%2F');
  }

  if (photoPath.includes('hello')) {
    const pathAfterHello = photoPath.split('hello')[1];
    if (pathAfterHello) {
      const encodedPath = pathAfterHello.replace(/\//g, '%2F');
      return `https://gateway.tsirylab.com/serviceupload/file/preview/hello${encodedPath}`;
    }
  }

  return `https://gateway.tsirylab.com/serviceupload/file/preview/${photoPath.replace(/^\//, '')}`;
};
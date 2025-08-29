const getCloudinaryPublicId = (url: string) => {
    try {
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');

        // Example: ['', 'chaiaurcodelearn', 'image', 'upload', 'v1234567890', 'folder', 'name.ext']
        const uploadIndex = pathParts.indexOf('upload');
        if (uploadIndex === -1) return null;

        // All parts after 'upload' are version (optional), folders, and filename
        const afterUpload = pathParts.slice(uploadIndex + 1);

        // If first part starts with v123..., it's a version
        const startsWithVersion = afterUpload[0]?.startsWith('v') && /^\d+$/.test(afterUpload[0].substring(1));

        const pathWithoutVersion = startsWithVersion ? afterUpload.slice(1) : afterUpload;

        // Join remaining parts, remove file extension
        const lastPart = pathWithoutVersion.pop();
        const fileNameWithoutExt = lastPart?.split('.').slice(0, -1).join('.');
        if(!fileNameWithoutExt) return null;

        // If it’s in a folder, include that path
        const publicId = [...pathWithoutVersion, fileNameWithoutExt].join('/');

        return publicId;
    } catch (err) {
        console.error('Invalid URL', err);
        return null;
    }
}

export default getCloudinaryPublicId;

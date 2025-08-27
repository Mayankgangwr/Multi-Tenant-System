import { v2 as Cloudinary, UploadApiResponse } from "cloudinary";
import fs, { promises as fsp } from "fs";

Cloudinary.config({
    cloud_name: "chaiaurcodelearn",
    api_key: "489753377646774",
    api_secret: "9F3LJzHEb2k3RQ14DeCUDqvoJi0",
});

class FilesServices {
    /**
     * Delete single or multiple files from local storage
     * @param paths - file path (string) or array of file paths
     */
    async localDelete(paths: string | string[]): Promise<void> {
        const filePaths = Array.isArray(paths) ? paths : [paths];
        await Promise.all(
            filePaths.map(async (path) => {
                try {
                    await fsp.unlink(path);
                    console.log(`🗑️ Deleted file: ${path}`);
                } catch (err: any) {
                    if (err.code === "ENOENT") {
                        console.warn(`⚠️ File not found: ${path}`);
                    } else {
                        console.error(`❌ Error deleting file: ${path}`, err);
                    }
                }
            })
        );
    }

    /**
     * Upload single or multiple files to Cloudinary and delete from local
     * @param localFilePath string | string[]
     */
    async upload(localFilePath: string | string[]): Promise<UploadApiResponse[] | null> {
        const paths = Array.isArray(localFilePath) ? localFilePath : [localFilePath];
        const results: UploadApiResponse[] = [];

        for (const path of paths) {
            if (!path) continue;

            try {
                const response: UploadApiResponse = await Cloudinary.uploader.upload(path);
                console.log("✅ File uploaded successfully:", response.url);
                results.push(response);
            } catch (err) {
                console.error("❌ Error uploading file:", err);
            } finally {
                if (fs.existsSync(path)) {
                    try {
                        await fsp.unlink(path);
                        console.log(`🗑️ Deleted local file: ${path}`);
                    } catch (err) {
                        console.error(`❌ Failed to delete local file: ${path}`, err);
                    }
                }
            }
        }

        if (results.length === 0) return null;
        return results;
    }

    /**
     * Delete file(s) from Cloudinary by URL
     * @param urls string | string[]
     */
    async cloudinaryDelete(urls: string | string[]): Promise<void> {
        const fileUrls = Array.isArray(urls) ? urls : [urls];

        await Promise.all(
            fileUrls.map(async (url) => {
                try {
                    // Extract public_id from URL
                    const parts = url.split("/");
                    const fileWithExt = parts.pop() || "";
                    const publicId =
                        parts.slice(7).join("/") + "/" + fileWithExt.split(".")[0]; // remove extension

                    const res = await Cloudinary.uploader.destroy(publicId);
                    if (res.result === "ok") {
                        console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
                    } else {
                        console.warn(`⚠️ Could not delete from Cloudinary: ${publicId}`, res);
                    }
                } catch (err) {
                    console.error(`❌ Error deleting from Cloudinary: ${url}`, err);
                }
            })
        );
    }
}

const filesServices = new FilesServices();
export default filesServices;

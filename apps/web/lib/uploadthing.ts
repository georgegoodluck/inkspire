import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Accepts image size qith a maximum of 2MB and allow max of 1 file per upload
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } }),
};

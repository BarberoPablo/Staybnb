import { generateReactHelpers } from "@uploadthing/react";
import type { UploadRouter } from "@/app/api/uploadthing/core";

export const { uploadFiles } = generateReactHelpers<UploadRouter>();

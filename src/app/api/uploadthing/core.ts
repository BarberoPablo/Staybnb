import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  // Takes up to 10 4mb images and/or 1 256mb video
  imagesUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    //.middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;

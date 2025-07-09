import { uploadRouter } from "@/app/api/uploadthing/core";
import { createRouteHandler } from "uploadthing/next";

export const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

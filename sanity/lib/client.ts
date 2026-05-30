import {createClient} from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "zocbdjlm";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2026-05-30";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

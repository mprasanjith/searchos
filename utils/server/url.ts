import process from "process";

export function getAppBaseUrl() {
  if (process.env.VERCEL_URL) {
    return process.env.VERCEL_URL;
  }

  return process.env.BASE_URL;
}

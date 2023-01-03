export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const protocol = process.env.NEXT_PUBLIC_BASE_URL?.includes("localhost") ? "http://" : "https://";

export const API_URL = protocol + process.env.NEXT_PUBLIC_BASE_URL + "/api/v1";
export const SITE_URL = protocol + process.env.NEXT_PUBLIC_SITE_URL;

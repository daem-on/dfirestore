import { config } from "./config.ts";
import type { FetchRequest, FireResponse } from "./types.ts";

const client = {
  request: async ({
    url,
    reqBody,
    method = "POST",
    database,
    authorization,
    project,
    pageSize,
    pageToken,
    orderBy,
    mask,
    showMissing,
  }: FetchRequest): Promise<FireResponse> => {
    const requestHeaders: HeadersInit = new Headers();

    requestHeaders.set("Content-Type", "application/json");

    const token =
      typeof authorization !== "undefined" ? authorization : config.token;

    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }

    const size = pageSize ? `?pageSize=${Number(pageSize)}` : "";
    const page = pageToken ? `${size ? "&" : "?"}pageToken=${pageToken}` : "";
    const order = orderBy
      ? `${size || page ? "&" : "?"}orderBy=${orderBy}`
      : "";
    const missing = showMissing
      ? `${size || page || order ? "&" : "?"}showMissing=${showMissing}`
      : "";
    const fields = mask
      ? `${size || page || order || missing ? "&" : "?"}mask=${JSON.stringify(
          mask
        )}`
      : "";

    const req = await fetch(
      `${config.host(project)}/databases/${
        database ?? config.firebaseDb
      }/${url}${size}${page}${order}${missing}${fields}`,
      {
        method,
        body: reqBody && JSON.stringify(reqBody),
        headers: requestHeaders,
      }
    );

    return await req.json();
  },
};

export { client };

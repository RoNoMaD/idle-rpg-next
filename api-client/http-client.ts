/**
 * Custom HTTP client wrapper around fetch API
 *
 * @return  {[type]}  [return description]
 * @see https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper
 */
export async function httpClient(
  endpoint: string,
  { body, headers: customHeaders, ...customConfig }: RequestInit
): Promise<any> {
  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...(body && { body }),
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...customHeaders,
    },
    ...customConfig,
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`,
    config
  );

  const contentType = response.headers.get("content-type");
  let data: any;
  try {
    if (contentType === null) {
      data = null;
    } else if (contentType.startsWith("application/json")) {
      data = await response.json();
    } else if (contentType.startsWith("text/plain")) {
      data = await response.text();
    } else {
      throw new Error(`Unsupported response content-type: ${contentType}`);
    }
  } catch (e) {
    console.error(e);
    throw new Error("Failed parsing response body from " + response.url);
  }

  if (response.ok) {
    return data;
  } else {
    return Promise.reject(data);
  }
}

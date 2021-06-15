export default async function parseResponse(apiPromise, parseMethod) {
  const response = await apiPromise; // reject failed HTTP requests with the raw response

  if (!response.ok) {
    return Promise.reject(response);
  }

  if (parseMethod === null || parseMethod === 'raw') {
    return response;
  }

  if (parseMethod === 'text') {
    const text = await response.text();
    const result = {
      response,
      text
    };
    return result;
  } // by default treat this as json


  if (parseMethod === undefined || parseMethod === 'json') {
    const json = await response.json();
    const result = {
      json,
      response
    };
    return result;
  }

  throw new Error(`Expected parseResponse=json|text|raw|null, got '${parseMethod}'.`);
}
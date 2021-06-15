import callApi from './callApi';
import rejectAfterTimeout from './rejectAfterTimeout';
import parseResponse from './parseResponse';
export default async function callApiAndParseWithTimeout({
  timeout,
  parseMethod,
  ...rest
}) {
  const apiPromise = callApi(rest);
  const racedPromise = typeof timeout === 'number' && timeout > 0 ? Promise.race([apiPromise, rejectAfterTimeout(timeout)]) : apiPromise;
  return parseResponse(racedPromise, parseMethod);
}
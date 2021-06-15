import { SupersetClient } from '../../../connection';
export default async function fetchExploreJson({
  client = SupersetClient,
  method = 'POST',
  requestConfig,
  endpoint = '/superset/explore_json/',
  formData
}) {
  const {
    json
  } = await client.request({ ...requestConfig,
    method,
    endpoint,
    searchParams: method === 'GET' ? new URLSearchParams({
      form_data: JSON.stringify(formData)
    }) : undefined,
    postPayload: method === 'POST' ? {
      form_data: formData
    } : undefined
  });
  return json;
}
import { SupersetClient } from '../../../connection';
export default function getFormData({
  client = SupersetClient,
  sliceId,
  overrideFormData,
  requestConfig
}) {
  const promise = client.get({
    endpoint: `/api/v1/form_data/?slice_id=${sliceId}`,
    ...requestConfig
  }).then(({
    json
  }) => json);
  return overrideFormData ? promise.then(formData => ({ ...formData,
    ...overrideFormData
  })) : promise;
}
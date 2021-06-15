import { SupersetClient } from '../../../connection';
export default function getDatasourceMetadata({
  client = SupersetClient,
  datasourceKey,
  requestConfig
}) {
  return client.get({
    endpoint: `/superset/fetch_datasource_metadata?datasourceKey=${datasourceKey}`,
    ...requestConfig
  }).then(response => response.json);
}
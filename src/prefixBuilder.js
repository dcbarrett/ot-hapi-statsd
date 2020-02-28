function sanitize(input) {
  let result = input.toString();
  result = result.replace(new RegExp('\\s+', 'g'), '-');
  result = result.replace(new RegExp('/', 'g'), '-');
  result = result.replace(new RegExp('[^a-zA-Z_\\-0-9\\.]', 'g'), '');
  result = result.replace(new RegExp('_', 'g'), '-');
  return result.toLowerCase();
}

function getInstanceNumberPrefix(options, isKubernetes, kubernetesClusterName) {
  let instanceNumberPrefix = '';
  if (isKubernetes && isKubernetes === 'true' && kubernetesClusterName && kubernetesClusterName !== '') {
    if (options && options.separateClusterName) {
      instanceNumberPrefix = `${kubernetesClusterName}.`;
    } else {
      instanceNumberPrefix = `${kubernetesClusterName}-`;
    }
  }
  return instanceNumberPrefix;
}

function buildMetricsPrefix(options) {
  const datacenter = process.env.OT_ENV_LOCATION || 'local';
  const appEnvironment = process.env.OT_ENV_TYPE || 'dev';
  const instanceNo = process.env.INSTANCE_NO || '1';
  const isKubernetes = process.env.IS_KUBERNETES;
  const kubernetesClusterName = process.env.K8S_CLUSTER_NAME;
  const instanceNumberPrefix = getInstanceNumberPrefix(options, isKubernetes, kubernetesClusterName);
  const suppliedPrefix = options && options.prefix ? options.prefix : '';
  const prefix = `${suppliedPrefix}${appEnvironment}.${datacenter}.${instanceNumberPrefix}instance${instanceNo}`;
  return sanitize(prefix);
}

module.exports = buildMetricsPrefix;

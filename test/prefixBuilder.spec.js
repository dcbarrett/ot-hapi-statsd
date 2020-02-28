const expect = require('expect.js');
const prefixBuilder = require('../src/prefixBuilder');

describe('prefixBuilder', function() {
  beforeEach(function() {
    delete process.env.OT_ENV_LOCATION;
    delete process.env.OT_ENV_TYPE;
    delete process.env.INSTANCE_NO;
    delete process.env.IS_KUBERNETES;
    delete process.env.K8S_CLUSTER_NAME;
  });

  it('should use the defaults when env vars are not set', function() {
    const prefix = prefixBuilder({});
    expect(prefix).to.equal('dev.local.instance1');
  });

  it('should inlude serviceType in the prefix when set in the provided options', function() {
    const prefix = prefixBuilder({ prefix: 'my-test-service.' });
    expect(prefix).to.equal('my-test-service.dev.local.instance1');
  });

  it('should use the k8s cluster name when env.IS_KUBERNETES is "true" and env.K8S_CLUSTER_NAME is not empty', function() {
    process.env.IS_KUBERNETES = 'true';
    process.env.K8S_CLUSTER_NAME = 'my-test-cluster';
    const prefix = prefixBuilder({ prefix: 'my-test-service.' });
    expect(prefix).to.equal('my-test-service.dev.local.my-test-cluster-instance1');
  });

  it('should separate the k8s cluster name from the instance when options.separateClusterName is "true"', function() {
    process.env.IS_KUBERNETES = 'true';
    process.env.K8S_CLUSTER_NAME = 'my-test-cluster';
    const prefix = prefixBuilder({ prefix: 'my-test-service.', separateClusterName: true });
    expect(prefix).to.equal('my-test-service.dev.local.my-test-cluster.instance1');
  });

  it('should use env.OT_ENV_LOCATION and env.OT_ENV_TYPE when set', function() {
    process.env.OT_ENV_TYPE = 'prod';
    process.env.OT_ENV_LOCATION = 'sc';
    const prefix = prefixBuilder({ prefix: 'my-test-service.' });
    expect(prefix).to.equal('my-test-service.prod.sc.instance1');
  });

  it('should replace all whitespaces with dashes in the prefix', function() {
    process.env.IS_KUBERNETES = 'true';
    process.env.K8S_CLUSTER_NAME = 'my test cluster';
    const prefix = prefixBuilder({ prefix: 'my-test-service.' });
    expect(prefix).to.equal('my-test-service.dev.local.my-test-cluster-instance1');
  });

  it('should replace all forward slashes with dashes in the prefix', function() {
    process.env.IS_KUBERNETES = 'true';
    process.env.K8S_CLUSTER_NAME = 'my/test/cluster';
    const prefix = prefixBuilder({ prefix: 'my/test/service.' });
    expect(prefix).to.equal('my-test-service.dev.local.my-test-cluster-instance1');
  });

  it('should remove non-alphanumeric chars from the prefix. (excludes "-", "_", ".")', function() {
    process.env.IS_KUBERNETES = 'true';
    process.env.K8S_CLUSTER_NAME = 'my!@#\$test%^&*()+cluster.test_1';
    const prefix = prefixBuilder({ prefix: 'my/test/service.' });
    expect(prefix).to.equal('my-test-service.dev.local.mytestcluster.test-1-instance1');
  });

  it('should lowercase the prefix', function() {
    process.env.IS_KUBERNETES = 'true';
    process.env.K8S_CLUSTER_NAME = 'MY TEST CLUSTER';
    const prefix = prefixBuilder({ prefix: 'my/test/service.' });
    expect(prefix).to.equal('my-test-service.dev.local.my-test-cluster-instance1');
  });
});

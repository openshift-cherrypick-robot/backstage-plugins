import { Router } from 'express';

import { PolicyBuilder } from '@janus-idp/backstage-plugin-rbac-backend';

import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
  pluginIdProvider: { getPluginIds: () => string[] },
): Promise<Router> {
  return PolicyBuilder.build({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    identity: env.identity,
    permissions: env.permissions,
    tokenManager: env.tokenManager,
    pluginIdProvider,
  });
}

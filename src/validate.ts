import { ErrorOptions } from '../types/custom-error';
import { FirewallOptions } from '../types/firewall';
import { Middleware } from '../types/middleware';

export const useValidate: Middleware = (
  context,
  next,
) => {
  const { options } = context;
  const {
    upstream,
    firewall,
    error,
    // cors,
    // optimization,
    // header,
    // security,
  } = options;

  if (upstream === undefined) {
    throw new Error('Invalid upstream configuration. Please check again that you did not input empty value.');
  }

  if (Array.isArray(upstream)) {
    upstream.forEach((userConfig) => {
      if (userConfig.domain === undefined) {
        throw new Error('Invalid domain configuration. Please check that you included domain in the configuration');
      }
    });
  } else if (upstream.domain === undefined) {
    throw new Error('Invalid domain configuration. Please check that you included domain in the configuration');
  }

  const checkFirewall = (userConfig: FirewallOptions) : void => {
    if (userConfig.field === undefined
        || userConfig.operator === undefined
        || userConfig.value === undefined) {
      throw new Error('Invalid firewall configuration. Please check that you provided proper settings.');
    }
    const fields = new Set(['country', 'continent', 'asn', 'ip', 'hostname', 'user-agent']);
    const operators = new Set(['equal', 'not equal', 'greater', 'less', 'in', 'not in', 'contain', 'not contain', 'match']);
    if (fields.has(userConfig.field) === false) {
      throw new Error('Invalid firewall field configuration');
    }
    if (operators.has(userConfig.operator) === false) {
      throw new Error('Invalid firewall operator configuration');
    }
    if (Array.isArray(userConfig.value) === false) {
      if (typeof userConfig.value !== 'string'
            || typeof userConfig.value !== 'number') {
        throw new Error('Invalid firewall value configuration');
      }
    }
  };

  if (firewall !== undefined) {
    if (Array.isArray(firewall)) {
      firewall.forEach(checkFirewall);
    } else {
      checkFirewall(firewall);
    }
  }

  const checkError = (userConfig : ErrorOptions) : void => {
    if (userConfig.errorCode === undefined || userConfig.responsePath === undefined) {
      throw new Error('Invalid customized error configuration. ');
    }
  };

  if (error !== undefined) {
    if (Array.isArray(error)) {
      error.forEach(checkError);
    } else {
      checkError(error);
    }
  }
  return next();
};

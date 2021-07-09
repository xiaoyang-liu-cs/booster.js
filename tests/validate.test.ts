/* eslint-disable no-trailing-spaces */
import { useValidate } from '../src/validate';
import { Context } from '../types/middleware';

const request = new Request(
  'https://httpbin.org/post',
  {
    headers: new Headers({
      origin: 'https://httpbin.org',
      'Access-Control-Request-Method': 'GET',
    }),
    method: 'GET',
  },
);

const response = new Response(
  'Test response body',
  {
    headers: new Headers({}),
    status: 200,
  },
);

const baseContext: Context = {
  request,
  response,
  hostname: 'https://httpbin.org',
  upstream: null,
  options: {
    upstream: {
      domain: 'httpbin.org',
    },
  },
};

test('no domain', () => {
  const context: Context = {
    ...baseContext,
    options: {
      upstream: {
        domain: undefined,
      },
    },
  };
  expect(useValidate(context, () => null)).toThrow();
});

test('firewall missing field', () => {
  const context: Context = {
    ...baseContext,
    options: {
      upstream: {
        domain: 'https://httpbin.org',
      },
      firewall: [
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore 
          field: undefined,
          operator: 'in',
          value: ['CN', 'KP', 'SY', 'PK', 'CU'],
        },
      ],
    },
  };
  expect(useValidate(context, () => null)).toThrow();
});

test('firewall invalid operator', () => {
  const context: Context = {
    ...baseContext,
    options: {
      upstream: {
        domain: 'https://httpbin.org',
      },
      firewall: [
        {
          field: 'country',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore 
          operator: 'for',
          value: ['CN', 'KP', 'SY', 'PK', 'CU'],
        },
      ],
    },
  };
  expect(useValidate(context, () => null)).toThrow();
});

test('invalid custom error: missing error code', () => {
  const context: Context = {
    ...baseContext,
    options: {
      upstream: {
        domain: 'https://httpbin.org',
      },
      error: [
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore 
          errorCode: undefined,
          responsePath: 'for',
        },
      ],
    },
  };
  expect(useValidate(context, () => null)).toThrow();
});

test('invalid custom error: missing response path', () => {
  const context: Context = {
    ...baseContext,
    options: {
      upstream: {
        domain: 'https://httpbin.org',
      },
      error: [
        {
          errorCode: 404,
          responsePath: undefined,
        },
      ],
    },
  };
  expect(useValidate(context, () => null)).toThrow();
});

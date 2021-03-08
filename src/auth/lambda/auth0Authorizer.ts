import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'
import 'source-map-support/register'
import * as jwksClient from 'jwks-rsa';

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth')
const jwksUri = 'https://dev-x4xgby3m.us.auth0.com/.well-known/jwks.json';

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  console.log('Retrieving Signing Certificate from Auth0');
  if (!jwt || !jwt.header.kid || jwt.header.alg !== 'RS256') {
    throw new Error('Invalid JWT');
  }

  const signingKey = await getSigningKey(jwt.header.kid);
  if (!signingKey || signingKey == '') {
    throw new Error(`Received empty signing certificate from Auth0`);
  }
  
  return verify(token, signingKey, { algorithms: ['RS256']}) as JwtPayload;
}

async function getSigningKey(kid: string): Promise<string> {
  const client = jwksClient({
    jwksUri, 
  });

  let signingKey = '';
  await client.getSigningKeyAsync(kid)
    .then(key => {
      signingKey = key.getPublicKey();
    })
    .catch(err => {
      throw new Error(`Error retrieving signing key: ${err}`);
    });

  return signingKey;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { decode } from 'jsonwebtoken';
import { JwtPayload } from "../auth/JwtPayload";

export function getUserId(event: APIGatewayProxyEvent): string {
    const auth = event.headers.Authorization;
    const split = auth.split(' ');
    const jwt = split[1];
    const decodedJwt = decode(jwt) as JwtPayload;
    return decodedJwt.sub;
}

export function prepareApiResponse(statusCode: number, data: any = {}): APIGatewayProxyResult {
    return {
        statusCode,
        headers: {
        'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    };
}
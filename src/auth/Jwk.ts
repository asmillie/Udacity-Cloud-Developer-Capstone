export interface Jwk {
    alg: string;
    kty: string;
    use: string;
    x5c: [
        cert: string
    ],
    n: string;
    e: string;
    kid: string;
    x5t: string;
}
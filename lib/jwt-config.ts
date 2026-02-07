export const getJwtSecretKey = () => {
    // TEMPORARY FIX: Force consistency between Edge and Node runtimes
    // It seems AUTH_SECRET is available in Node but missing in Edge (Middleware)
    const secret = 'health-agent-production-secret-key-fixed-2026';
    // const secret = process.env.AUTH_SECRET || 'health-agent-default-secret-key-change-me-in-prod';
    return new TextEncoder().encode(secret);
};

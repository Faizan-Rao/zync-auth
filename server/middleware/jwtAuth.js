import jwt from "jsonwebtoken";

function getBearerToken(headerValue) {
  if (typeof headerValue !== "string") return null;
  const [scheme, token] = headerValue.trim().split(/\s+/, 2);
  if (!scheme || !token) return null;
  if (scheme.toLowerCase() !== "bearer") return null;
  return token;
}

export function requireJwtAuth(options = {}) {
  return function jwtAuthMiddleware(req, res, next) {
    const secret = String(options.secret ?? process.env.JWT_SECRET ?? "").trim();
    if (!secret) {
      return res.status(500).json({ error: "server auth is not configured" });
    }

    const token = getBearerToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: "missing bearer token" });
    }

    try {
      const payload = jwt.verify(token, secret);
      req.auth = payload;
      return next();
    } catch {
      return res.status(401).json({ error: "invalid or expired token" });
    }
  };
}

# Railway-ready API proxy

Small Express proxy that forwards requests to `http://api-aeis.duckdns.org` and is meant to be deployed on Railway (or any container platform).

## Files
- `index.js` - Express + http-proxy-middleware proxy
- `package.json` - deps and start script
- `Dockerfile` - Docker image for Railway
- `.dockerignore`, `.gitignore`

## Usage
### Local
Install deps and run:

```bash
npm ci
UPSTREAM=http://api-aeis.duckdns.org PORT=3000 node index.js
# then: curl http://localhost:3000/health
```

### Deploy to Railway (web or CLI)
1. Create a new Railway project and connect your repo (or push Dockerfile).  
2. In Project > Variables, add `UPSTREAM` with the upstream URL (default `http://api-aeis.duckdns.org`).
3. Deploy the project. Railway will provide HTTPS for the Railway domain automatically.
4. (Optional) Add a custom domain in Railway Project > Domains and follow DNS instructions.

**Important: avoid proxy loops**
- If you want the public domain to be `api-aeis.duckdns.org` served by this proxy, make sure the `UPSTREAM` points to the *origin server IP or a different host/port*, not the same domain, otherwise the proxy will loop.

## Notes & tips
- Add rate limiting / authentication if making the proxy public.
- Test locally first and check `/health`.
- I can also add a Caddy reverse-proxy setup if you prefer Railway to only do TLS termination.

---
If quieres que empuje estos archivos a un repo, dime a qué repo o si quieres que genere un commit por ti.
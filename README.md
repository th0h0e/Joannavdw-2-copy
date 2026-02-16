# Distribution Branch

This branch contains the built output for deployment.

## Contents

- `.output/` - Nuxt build output (server + static files)

## Usage

Run the server with:
```bash
node .output/server/index.mjs
```

## Environment Variables

Set these at runtime:
- `NUXT_PUBLIC_PB_URL` - PocketBase URL
- `NITRO_PORT` - Server port (default: 3000)
- `NITRO_HOST` - Host binding (default: 0.0.0.0)

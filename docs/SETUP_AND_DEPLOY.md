# Setup and Deployment Guide

This guide covers how to build the frontend, package the Sigma extension, and deploy to Zoho Catalyst.

1) Build the frontend

- From repository root:
```
cd frontend
npm install
npm run build
```

The build output for this project is emitted to `../sigma-package/app` (this repo's Vite config does that). Confirm files:
- `sigma-package/app/index.html`
- `sigma-package/app/assets/*` (bundles)

2) Prepare Catalyst client folder

- Copy built client into Catalyst client folder (or copy the bundles):
```
# from repo root
Copy-Item -Path .\sigma-package\app\index.html -Destination .\catalyst\client\index.html -Force
# copy assets
robocopy .\sigma-package\app\assets .\catalyst\client\assets /E /NFL /NDL /NJH /NJS /nc /ns /np
```

3) Add SPA fallback config for Catalyst

- Create `catalyst/client/catalyst.json` with:
```
{
  "webClient": { "spa": true }
}
```

4) Link local folder to the correct Catalyst project

- From `catalyst/` run:
```
catalyst init --force
# choose the new project (eg. genui-be)
```

5) Deploy client and functions

- Deploy client only:
```
catalyst deploy --only client
```
- Deploy functions (after verifying `catalyst/functions/*` content):
```
catalyst deploy --only functions
```

6) Package Sigma extension (zip)

- Important: when creating the zip for Sigma, include `plugin-manifest.json` at the top level of the zip. From `sigma-package/` run:
```
# run from d:\genui-style-extractor\sigma-package
Compress-Archive -Path * -DestinationPath ..\genui-sigma-package.zip -Force
```
- Verify zip: extract to temp and confirm `plugin-manifest.json` and `app/` are at the root of the extracted folder.

7) Upload to Sigma

- Use Zoho Sigma UI and choose the zip `genui-sigma-package.zip`. If you get errors about invalid JSON or missing `en.json`, re-open the zip and ensure files exist at the correct paths:
  - `plugin-manifest.json` (root)
  - `app/index.html`
  - `app/translations/en.json`

Troubleshooting tips
- If Catalyst serves `/app/index.html` but `/app/` 404s, ensure `catalyst/client/catalyst.json` with `"webClient": { "spa": true }` is deployed. If it still fails, contact Catalyst support.

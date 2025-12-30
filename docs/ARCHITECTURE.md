# Architecture Overview — GenUI Style Extractor

High-level components:

- Frontend (React, Vite): hosted as static web client on Zoho Catalyst. Builds to `sigma-package/app` then deployed into `catalyst/client`.
- Zoho Catalyst Functions: serverless backend functions live under `catalyst/functions/*` (convertStyles, getHistory, analyzeImage, saveConversion).
- Figma Plugin: desktop/web plugin in `figma-plugin/` which can run in Figma and generate JSON to feed the frontend.
- Sigma Extension: packaged zip under `sigma-package/` for Zoho Sigma marketplace (contains `plugin-manifest.json` and `app/`)

Data flow (simplified):
1. User runs Figma plugin -> gets JSON of selected layers.
2. User pastes JSON in frontend or uploads image.
3. Frontend calls Catalyst functions (HTTP triggered) to analyze/convert styles.
4. Results are shown to user and optionally saved via `saveConversion` to Catalyst datastore.

Mermaid diagram

```mermaid
flowchart LR
  subgraph Client
    FE[Frontend (React)]
  end

  subgraph Figma
    FP[Figma Plugin]
  end

  subgraph Catalyst
    CF[Functions]
    DS[Datastore]
    Auth[Auth Providers]
  end

  FP --> FE
  FE --> CF
  CF --> DS
  Auth --> FE

  FE -. Sigma Extension .-> Sigma((Sigma ZIP))

  click CF "https://catalyst.zoho.com" "Catalyst functions"
```

Notes:
- Keep functions idempotent and stateless.
- Store sensitive keys in Catalyst secrets or environment (do not bake in client bundles).

# Authentication Setup (Google & Zoho)

This document explains how to configure social login providers for the Catalyst project.

1) Configure Google OAuth

- Create a Google Cloud project and enable OAuth consent.
- Create OAuth 2.0 Client ID credentials (Web application).
- Add redirect URI(s) — use your Catalyst app domain redirect, for example:
  - `https://<your-subdomain>.development.catalystserverless.com/auth/google/callback`

- In Catalyst Console:
  - Go to Authentication → Add Provider → Google
  - Paste Client ID and Client Secret

2) Configure Zoho OAuth

- In Zoho API Console, create a client and set redirect URI similar to Google.
- In Catalyst Console add Zoho provider and paste Client ID/Secret.

3) Frontend integration

- Use the Catalyst browser SDK (zcatalyst-sdk-browser) or built-in auth flows. Typical flow:
```js
import catalyst from 'zcatalyst-sdk-browser';
const app = catalyst.initializeApp();
app.auth.signInWithProvider('google');
```

4) Important notes
- Redirect URIs must exactly match the entry used in OAuth provider settings.
- For local testing, use `http://localhost:5173` (or your dev port) and add it as a redirect URI in provider settings.
- Store secrets in Catalyst's secret manager instead of in source.

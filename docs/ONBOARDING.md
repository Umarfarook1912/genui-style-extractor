# Project Onboarding — GenUI Style Extractor

Quick orientation for a new contributor or team member.

Repository layout (important folders):
- `frontend/` — React (Vite) source for the web UI.
- `figma-plugin/` — Figma plugin source (manifest + code).
- `catalyst/` — Zoho Catalyst backend project (client + functions).
- `sigma-package/` — packaged extension ready to upload to Zoho Sigma.

Essential files:
- `catalyst/catalyst.json` — maps deployed client and functions to project
- `sigma-package/plugin-manifest.json` — Sigma extension manifest (must be at zip root)

Prerequisites (local machine):
- Node.js (LTS) and `npm`.
- `zcatalyst-cli` (optional, for Catalyst deploy): `npm i -g @zoho-catalyst/cli` or `npm i -g zcatalyst-cli` depending on CLI.
- A Zoho account and access to Catalyst console for project provisioning.

Where to run commands (most common):
- Build frontend: run inside `frontend/`.
- Initialize/deploy Catalyst: run inside `catalyst/`.
- Build/pack Sigma extension: run inside `sigma-package/`.

Who to contact for help:
- Project owner / repo author or `support@zohocatalyst.com` for Catalyst platform issues.

Next quick actions for a new dev:
1. Clone repo and install frontend deps:
```powershell
cd frontend
npm install
```
2. Build the frontend locally:
```powershell
npm run build
```
3. Link local Catalyst to your Zoho project (in `catalyst/`):
```powershell
catalyst init --force
# choose correct project when prompted
```

What to expect when you run `catalyst init --force`
--------------------------------------------------

The `catalyst init` interactive flow will ask several questions. Below are the typical prompts and recommended choices for this repository.

- Select a default project for this directory
	- You will see a list of your Catalyst projects. Choose the new project you created (for example `genui-be`).

- Which features do you want to setup for this folder?
	- Options shown: `Functions`, `Client`, `AppSail`, `Slate` (may vary by CLI version).
	- Recommendation for this repo: select **Client** (required for web frontend). If you are also deploying serverless endpoints, also select **Functions**. Do not select AppSail unless you are deploying a containerized app.
	- Use spacebar to toggle selection, then Enter to continue.

- Functions Setup (if selected)
	- The CLI may create a `functions/` directory and sample function. If you already have a `catalyst/functions` folder in the repo, you will be asked whether to overwrite it.
	- Recommendation: choose **No** when prompted to overwrite to preserve existing code. You can still add new functions later or allow the CLI to create examples in a separate folder.

- Client Setup (if selected)
	- The CLI will ask for client type. For this repo choose **REACT** (the project uses Vite/React).
	- It then asks whether to create a new React app and which language to use (JavaScript / TypeScript). This is only for scaffolded example apps. If you already have the frontend in `../frontend`, you can accept the defaults (press Enter) or choose any name — you will replace or copy your built files into `catalyst/client` when deploying.
	- If prompted about overwriting a folder (e.g., `react-app`), answer **No** to avoid losing your existing frontend. After init, ensure `catalyst/client` contains the built files before deploying.

- AppSail / Slate (if shown)
	- Typically not needed for this project. Skip unless you intentionally want a container (AppSail) or admin panel (Slate).

- Final files updated by `catalyst init`
	- `.catalystrc` — local CLI config (auth/project link)
	- `catalyst.json` — mapping of features and their source folders (functions, client)
	- optional scaffolded folders (react-app, functions samples) — only created if you allowed overwrite

After init
-----------
- Verify `catalyst/catalyst.json` contains the correct `project_name` and `project_id` and that `client.source` points to `client` (or the folder you intend to deploy).
- If `functions` or `client` scaffolds were created but you want to keep your existing code, remove the scaffold folders or copy your code into the proper directories.

Now you are ready to copy the build output and deploy (see `docs/SETUP_AND_DEPLOY.md`).

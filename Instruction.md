You are GitHub Copilot. Help me build a full production-ready project called **GenUI**, a UI Style Extractor + Tailwind Code Generator that works inside a Zoho Sigma extension and uses Zoho Catalyst backend. The project must be structured cleanly and follow best practices with reusable components, TanStack React Query, and modular code organization.

====================================================
PROJECT GOAL
====================================================
Build a system with:
1. React Frontend (Vite + TypeScript) → GenUI interface  
2. Chrome Dev Harness to test style extraction locally  
3. Zoho Catalyst Backend (convertStyles function)  
4. Sigma Extension (Zoho Desk service) to host the frontend  
5. Integration with Zoho test account provided for the hackathon  

====================================================
TECH STACK
====================================================
Frontend:
- React 19 + TypeScript
- Vite
- TanStack React Query
- Reusable UI components (Card, Button, CodeBlock, Loader)
- Constants folder for URLs, keys, config
- Window message listener for DOM extraction (GENUI_STYLE_EXTRACTED)

Backend:
- Zoho Catalyst Node.js Cloud Function (convertStyles)
- Simple CSS → Tailwind conversion logic

Testing:
- Chrome MV3 extension harness (content script + background)
- Extract styles via content script and send via window.postMessage

Final Delivery:
- Sigma extension that loads the built React UI inside Zoho Desk

====================================================
FOLDER STRUCTURE
====================================================
genui-style-extractor/
  frontend/
    src/
      components/
      hooks/
      constants/
      utils/
      App.tsx
      main.tsx
    vite.config.ts
  chrome-dev/
    manifest.json
    content-script.js
    background.js
  catalyst/
    functions/
      convertStyles/
        index.js
        package.json
    catalyst.json
  sigma-package/
    plugin-manifest.json
    app/  (Vite build output)

====================================================
FRONTEND REQUIREMENTS (React + TS + React Query)
====================================================
Generate:
1. src/App.tsx:
   - UI layout:
       * Extracted CSS styles panel
       * Convert button
       * Tailwind result panel
   - Listen for:
       window.addEventListener("message", e => e.data.type === "GENUI_STYLE_EXTRACTED")
   - Use React Query mutation for backend call
   - Clean layout using reusable components

2. Reusable components:
   components/Card.tsx
   components/Button.tsx
   components/CodeBlock.tsx
   components/Loader.tsx

3. Constants:
   constants/api.ts → export CATALYST_CONVERT_URL

4. Custom hook:
   hooks/useConvertStyles.ts
   - Use TanStack Query Mutation
   - Accepts CSS style object
   - Returns Tailwind string on success

5. Vite configuration:
   frontend/vite.config.ts
   - outDir: "../sigma-package/app"
   - emptyOutDir: true

====================================================
CHROME DEV HARNESS
====================================================
chrome-dev/content-script.js:
- Extract element computed styles on click:
    width, height, padding, margin, fontSize, color, backgroundColor, borderRadius
- postMessage({ type: "GENUI_STYLE_EXTRACTED", styles })

chrome-dev/background.js:
- Relay events if needed (basic MV3 background)

chrome-dev/manifest.json:
- MV3 config
- Permissions: activeTab, scripting
- Load content script on all URLs

====================================================
ZOHO CATALYST BACKEND
====================================================
catalyst/functions/convertStyles/index.js:
- Accept JSON { styles }
- Produce Tailwind class output (simple mapping):
    color → text-[color]
    backgroundColor → bg-[rgb]
    fontSize px → text-sm/base/xl/etc.
    borderRadius → rounded-[value]
- Return response JSON: { output: "text-base bg-[#fff] rounded-md" }

catalyst/functions/convertStyles/package.json:
- minimal Node module

catalyst/catalyst.json:
- Register convertStyles function under Node16/Node18 runtime

====================================================
SIGMA EXTENSION (Zoho Desk SERVICE)
====================================================
sigma-package/plugin-manifest.json:
{
  "name": "GenUI Style Extractor",
  "version": "1.0",
  "description": "Extract UI styles and generate Tailwind CSS code using React frontend and Zoho Catalyst backend.",
  "services": ["desk"],
  "entry": {
    "web": {
      "main": "app/index.html"
    }
  }
}

====================================================
CONNECTION SETUP: ZOHO CATALYST → SIGMA → ZOHO DESK
====================================================

STEP 1 — Connect Catalyst:
- Go to https://catalyst.zoho.com
- Create project with same name "GenUI".
- Create function convertStyles under Functions tab.
- Paste generated index.js + package.json.
- Deploy function.
- Copy deployed URL (example):
  https://genui-12345.catalystserverless.in/server/convertStyles
- Replace this inside constants/api.ts as CATALYST_CONVERT_URL.

STEP 2 — Integrate React Query with Catalyst:
- React Query mutation calls CATALYST_CONVERT_URL
- Sigma environment can call Catalyst normally (CORS allowed automatically if same org)

STEP 3 — Sigma Extension Setup:
- Go to https://sigma.zoho.com/developerconsole
- Create new extension → choose Zoho Desk as service
- Upload zip for sigma-package/
- Configure where widget appears:
   Zoho Desk → Setup → Marketplace → Installed Extensions → Open GenUI Panel
- Widget loads app/index.html automatically

STEP 4 — Connect with Zoho Desk Test Account:
- Zoho will provide a test org for hackathon
- Login using test credentials
- Install your extension inside Desk via Marketplace Developer Mode
- Open Desk → You will see *GenUI* as a sidebar widget or panel

====================================================
GENERATE THE FOLLOWING NOW:
====================================================
1. App.tsx (full implementation with React Query, reusable components)
2. main.tsx
3. components/Card.tsx
4. components/Button.tsx
5. components/CodeBlock.tsx
6. components/Loader.tsx
7. hooks/useConvertStyles.ts
8. constants/api.ts
9. chrome-dev/manifest.json
10. chrome-dev/content-script.js
11. chrome-dev/background.js
12. catalyst/functions/convertStyles/index.js
13. catalyst/functions/convertStyles/package.json
14. catalyst/catalyst.json
15. sigma-package/plugin-manifest.json
16. vite.config.ts (with build output to sigma app folder)

IMPORTANT CODING REQUIREMENTS:
- Use TypeScript everywhere
- Clean modular components
- Use React Query correctly (useMutation)
- Handle loading, error, and success states
- Add helpful comments for developers
- No unused code or leftover Vite template elements

Begin generating all files now.

# Figma Plugin Setup & Usage

This project includes a Figma plugin to extract design styles. You can install the published plugin or import the local manifest for development.

Published plugin (recommended):
1. Open Figma Desktop or Web.
2. Plugins → Browse Plugins → search for `GenUI_Style_Extractor` → Install.
3. Run plugin on a design, click **Extract Styles**, copy the JSON and paste into the web app.

Import plugin from manifest (development):
1. In Figma: Plugins → Development → Import plugin from manifest.
2. Point to `figma-plugin/manifest.json` inside this repo (or `figma-plugin/dist/manifest.json` if built).
3. Run plugin and extract JSON.

Dev notes
- Source code for the plugin is in `figma-plugin/src/`.
- Build the plugin if you modified code (refer to `figma-plugin/package.json` scripts).

How the frontend consumes the JSON
- The frontend component `FigmaJsonInput.tsx` (in `frontend/src/components`) accepts pasted JSON, parses it and sends to Catalyst backend for conversion.

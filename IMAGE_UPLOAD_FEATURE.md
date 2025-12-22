# 📸 Image Upload & Design.json Feature

## Overview

GenUI now supports uploading UI design images (screenshots, mockups, etc.) and automatically extracting design tokens to generate a `design.json` file. This design.json can then be converted to CSS, Tailwind, or JSX using the existing conversion pipeline.

## Features

### 1. **Image Upload**
- Drag-and-drop or click to upload
- Supports JPEG, PNG, WebP, GIF (max 10MB)
- Real-time image preview
- Visual feedback during processing

### 2. **AI-Powered Design Token Extraction**
- Analyzes uploaded images using AI vision models
- Extracts design tokens including:
  - Colors (background, text, borders)
  - Typography (font size, weight, family)
  - Spacing (padding, margin)
  - Dimensions (width, height)
  - Border radius
  - Shadows/effects
  - Layout properties

### 3. **Design.json Generation**
- Automatically generates `design.json` from analyzed image
- JSON format compatible with existing conversion pipeline
- Preview and download functionality

### 4. **Seamless Integration**
- Works with existing "Convert Styles" functionality
- Same output formats: CSS, Tailwind CSS, JSX
- Unified user experience

## Architecture

### Frontend Components

1. **ImageUpload Component** (`frontend/src/components/ImageUpload.tsx`)
   - Handles file upload with drag-and-drop
   - Validates file types and sizes
   - Shows preview and processing states

2. **useImageAnalysis Hook** (`frontend/src/hooks/useImageAnalysis.ts`)
   - React Query mutation for image analysis
   - Converts image to base64
   - Calls Catalyst backend API

3. **AppContent Updates** (`frontend/src/components/AppContent.tsx`)
   - Mode selector: "Extract from Web" vs "Upload Image"
   - Integrates image upload flow
   - Displays design.json preview
   - Download functionality

### Backend Function

**analyzeImage** (`catalyst/functions/analyzeImage/index.js`)
- Receives base64-encoded image
- Uses OpenAI Vision API (if configured) for intelligent extraction
- Falls back to heuristic-based extraction
- Returns normalized design.json format

## Setup

### 1. Deploy Catalyst Function

```bash
cd catalyst
catalyst deploy
```

This will deploy the new `analyzeImage` function along with existing functions.

### 2. Configure OpenAI API (Optional but Recommended)

For best results, set the OpenAI API key in Catalyst environment:

```bash
# In Catalyst console or via CLI
catalyst env set OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** The function will work without OpenAI API key using fallback heuristics, but results will be more generic.

### 3. Update Frontend API Endpoint

The frontend automatically uses the endpoint from `constants/api.ts`. Ensure your Catalyst project URL is correct:

```typescript
export const API_BASE_URL = "https://your-project-id.development.catalystserverless.com";
```

## Usage Flow

1. **Select Upload Mode**
   - User clicks "Upload Image" tab in the app
   - Upload area appears

2. **Upload Image**
   - Drag and drop or click to browse
   - Image preview shows immediately
   - Analysis starts automatically

3. **View Design.json**
   - After analysis, design.json is displayed
   - User can preview the extracted tokens
   - Download button available

4. **Convert Styles**
   - Design.json is automatically converted to styles format
   - User selects output format (CSS/Tailwind/JSX)
   - Clicks "Convert Styles"
   - Gets generated code

## API Contract

### Request
```json
POST /server/analyzeImage/

{
  "image": "base64_encoded_image_string",
  "mimeType": "image/png",
  "fileName": "design.png"
}
```

### Response
```json
{
  "success": true,
  "designJson": {
    "width": "100%",
    "height": "auto",
    "backgroundColor": "#ffffff",
    "color": "#000000",
    "fontSize": "16px",
    "fontWeight": "400",
    "padding": "16px",
    "borderRadius": "8px"
  },
  "message": "Image analyzed successfully"
}
```

## Design.json Format

The design.json follows the same structure as extracted styles:

```json
{
  "width": "300px",
  "height": "200px",
  "backgroundColor": "#ffffff",
  "color": "#000000",
  "fontSize": "16px",
  "fontWeight": "400",
  "fontFamily": "Arial, sans-serif",
  "padding": "16px",
  "margin": "0px",
  "borderRadius": "8px",
  "border": "1px solid #e5e7eb",
  "boxShadow": "0 1px 3px rgba(0,0,0,0.1)"
}
```

All values are strings with proper CSS units (px, %, rem, etc.).

## Error Handling

- **Invalid file type**: Shows error message, allows retry
- **File too large**: Validates before upload
- **Analysis failure**: Falls back to heuristic extraction
- **API errors**: Displays user-friendly error messages

## Future Enhancements

- Support for multiple design elements in one image
- Batch image processing
- Design system extraction (colors, typography scales)
- Integration with design tools (Figma, Sketch)
- Machine learning model fine-tuning for better accuracy

## Troubleshooting

### Image analysis returns generic values
- Ensure OpenAI API key is set in Catalyst environment
- Check that the image is clear and contains visible UI elements
- Try a different image format

### Analysis fails
- Check Catalyst function logs
- Verify API endpoint URL is correct
- Ensure image is properly base64 encoded

### Design.json not converting
- Verify design.json format matches expected structure
- Check that all values are strings with units
- Ensure convertStyles function is deployed and working


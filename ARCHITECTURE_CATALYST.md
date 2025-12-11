# 🏗️ GenUI Architecture Diagram

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌─────────────┐     ┌──────────────────┐                     │
│  │   Webpage   │◄────│ GenUI Extension  │                     │
│  │  (Any Site) │     │                  │                     │
│  │             │     │  ┌────────────┐  │                     │
│  │  [Element]  │     │  │  Popup UI  │  │                     │
│  │     ▲       │     │  └──────┬─────┘  │                     │
│  │     │       │     │         │        │                     │
│  │  Highlight  │     │  ┌──────▼──────┐ │                     │
│  │     │       │     │  │ Background  │ │                     │
│  │  Extract    │     │  │  Service    │ │                     │
│  │     │       │     │  └──────┬──────┘ │                     │
│  │     │       │     │         │        │                     │
│  └─────┼───────┘     │  ┌──────▼──────┐ │                     │
│        │             │  │   Content   │ │                     │
│        └─────────────┼──│   Script    │ │                     │
│                      │  └─────────────┘ │                     │
└──────────────────────┼────────────────────────────────────────┘
                       │
                       │ HTTPS API Call
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ZOHO CATALYST CLOUD                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Catalyst Functions (Serverless)               │ │
│  │                                                            │ │
│  │  ┌────────────────────────────────────────────────────┐   │ │
│  │  │         convertStyles Function                     │   │ │
│  │  │                                                    │   │ │
│  │  │  Input: { styles: {...}, format: "tailwind" }    │   │ │
│  │  │                                                    │   │ │
│  │  │  Process:                                         │   │ │
│  │  │  1. Parse CSS properties                         │   │ │
│  │  │  2. Convert px → rem                              │   │ │
│  │  │  3. Map to Tailwind classes                       │   │ │
│  │  │  4. Format JSX styles                             │   │ │
│  │  │                                                    │   │ │
│  │  │  Output: { code: "w-[300px] bg-blue-500 ..." }   │   │ │
│  │  └────────────────────────────────────────────────────┘   │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Authentication (Optional)                     │ │
│  │  - User login/logout                                      │ │
│  │  - OAuth 2.0 with Zoho                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Data Store (Optional)                         │ │
│  │  - User preferences                                       │ │
│  │  - Saved design tokens                                    │ │
│  │  - Conversion history                                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Zia AI (Optional)                             │ │
│  │  - Smart component generation                             │ │
│  │  - Pattern recognition                                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow (Step-by-Step)

### Step 1: User Interaction
```
User clicks on webpage element
         ↓
Content Script captures click event
         ↓
Extracts computed CSS styles
```

### Step 2: Style Extraction
```
Content Script extracts:
{
  width: "300px",
  height: "200px",
  backgroundColor: "rgb(59, 130, 246)",
  fontSize: "16px",
  padding: "20px",
  ...
}
```

### Step 3: Communication
```
Content Script → Background Service Worker
         ↓
Background prepares API request
         ↓
Sends to Catalyst Cloud (HTTPS POST)
```

### Step 4: Catalyst Processing
```
Catalyst receives styles
         ↓
convertStyles function processes:
  - Converts px to rem
  - Maps to Tailwind classes
  - Formats CSS
  - Creates JSX syntax
         ↓
Returns three formats:
{
  css: "{ width: 18.75rem; ... }",
  tailwind: "w-[300px] h-[200px] bg-blue-500 ...",
  jsx: "style={{ width: '300px', ... }}"
}
```

### Step 5: Display Results
```
Catalyst → Background Service Worker
         ↓
Background → Popup UI
         ↓
User sees formatted code
         ↓
User copies and pastes ✨
```

---

## 📁 File Structure & Responsibilities

```
chrome-dev/
│
├── manifest.json           → Extension configuration
│                             Defines permissions, scripts
│
├── popup.html/js           → User Interface
│                             Shows converted code
│                             Copy to clipboard
│
├── content-script.js       → DOM Interaction
│                             Highlights elements
│                             Extracts computed styles
│                             Handles user clicks
│
├── background.js           → Communication Hub
│                             Receives from content script
│                             Calls Catalyst API
│                             Sends to popup
│
├── config.js               → Configuration
│                             Catalyst function URL
│                             Project settings
│
└── catalyst-service.js     → API Layer
                              Handles HTTP requests
                              Error handling
                              Fallback conversion

catalyst/
│
├── catalyst.json           → Project Configuration
│                             Function definitions
│                             Runtime settings
│
└── functions/
    └── convertStyles/
        ├── index.js        → Conversion Logic
        │                     CSS parser
        │                     Tailwind mapper
        │                     Format generator
        │
        └── package.json    → Dependencies
                              Express, body-parser
```

---

## 🔌 API Contract

### Request Format
```javascript
POST /server/convertStyles_function/convertStyles

Headers:
  Content-Type: application/json

Body:
{
  "styles": {
    "width": "300px",
    "backgroundColor": "#3b82f6",
    // ... more CSS properties
  },
  "format": "tailwind",  // or "css" or "jsx"
  "useRem": true         // convert px to rem
}
```

### Response Format
```javascript
{
  "success": true,
  "format": "tailwind",
  "code": "w-[300px] bg-blue-500 ...",
  "originalStyles": { /* original styles */ }
}
```

### Error Response
```javascript
{
  "success": false,
  "error": "Error message",
  "code": "fallback conversion"
}
```

---

## 🎯 Component Interactions

### Scenario: User Extracts Button Styles

```
1. User clicks "Start Extraction" in popup
   ↓
2. Popup → Background: "START_EXTRACTION"
   ↓
3. Background → Content Script: "START_EXTRACTION"
   ↓
4. Content Script: Enables extraction mode
   ↓
5. User hovers over <button>
   ↓
6. Content Script: Highlights button with blue overlay
   ↓
7. User clicks button
   ↓
8. Content Script: getComputedStyle(button)
   ↓
9. Content Script → Background: "STYLES_EXTRACTED" + styles
   ↓
10. Background → Catalyst API: POST /convertStyles
   ↓
11. Catalyst: Processes styles, returns converted code
   ↓
12. Catalyst → Background: Response with CSS/Tailwind/JSX
   ↓
13. Background → Popup: "STYLES_READY" + converted code
   ↓
14. Popup: Displays code in UI
   ↓
15. User: Clicks "Copy"
   ↓
16. Done! ✨
```

---

## 🔐 Security Flow (When Auth is Added)

```
1. User clicks "Login" in popup
   ↓
2. Extension opens OAuth flow
   ↓
3. User authenticates with Zoho
   ↓
4. Zoho returns access token
   ↓
5. Extension stores token
   ↓
6. All API calls include: Authorization: Bearer <token>
   ↓
7. Catalyst validates token before processing
   ↓
8. User-specific data stored with user ID
```

---

## 💾 Data Storage (Optional Enhancement)

```
User Table:
┌─────────┬────────────┬───────────┬──────────┐
│ user_id │    name    │   email   │ settings │
├─────────┼────────────┼───────────┼──────────┤
│   123   │  John Doe  │ john@...  │ {...}    │
└─────────┴────────────┴───────────┴──────────┘

Preferences Table:
┌─────────┬────────────────┬─────────┬────────┐
│ user_id │ default_format │ use_rem │  theme │
├─────────┼────────────────┼─────────┼────────┤
│   123   │   tailwind     │  true   │  dark  │
└─────────┴────────────────┴─────────┴────────┘

Design Tokens Table:
┌─────────┬────────────┬──────────┬────────────┐
│ user_id │    name    │  value   │    type    │
├─────────┼────────────┼──────────┼────────────┤
│   123   │ primary    │ #3b82f6  │   color    │
│   123   │ spacing-4  │   1rem   │  spacing   │
└─────────┴────────────┴──────────┴────────────┘
```

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine:
  - Code editing in VS Code
  - Local testing with 'catalyst serve'
  - Chrome extension in dev mode
  
Catalyst Development:
  - Function: http://localhost:9000/...
  - Quick iteration
  - No deployment needed
```

### Production Environment
```
Local Machine:
  - Final code ready
  - Run: catalyst deploy
  
Catalyst Production:
  - Function: https://genui-backend-xxx.catalystserverless.com/...
  - Globally distributed
  - Auto-scaling
  - Monitoring & logs

Chrome Web Store:
  - Published extension
  - Auto-updates for users
```

---

## 📊 Performance Metrics

```
Typical Request Timeline:
┌─────────────────────────────────────────────────────┐
│ Event                           │ Time              │
├─────────────────────────────────┼───────────────────┤
│ User clicks element             │ 0ms               │
│ Extract styles                  │ +10ms             │
│ Send to Catalyst                │ +50ms (network)   │
│ Catalyst processing             │ +100ms            │
│ Return to extension             │ +50ms (network)   │
│ Display in popup                │ +10ms             │
├─────────────────────────────────┼───────────────────┤
│ Total                           │ ~220ms            │
└─────────────────────────────────┴───────────────────┘

User Experience: Nearly instant! ⚡
```

---

## 🎨 Technology Stack Summary

### Frontend (Chrome Extension)
- **Language:** JavaScript (vanilla)
- **Framework:** None (lightweight)
- **APIs:** Chrome Extension APIs
- **UI:** HTML + CSS

### Backend (Catalyst)
- **Platform:** Zoho Catalyst
- **Runtime:** Node.js 16
- **Type:** Serverless Functions
- **Hosting:** Catalyst Cloud

### Communication
- **Protocol:** HTTPS
- **Format:** JSON
- **Auth:** OAuth 2.0 (optional)

### Development
- **CLI:** Catalyst CLI
- **Version Control:** Git
- **Editor:** VS Code

---

## 🔄 Development Workflow

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. Write Code                                      │
│     ↓                                               │
│  2. Test Locally (catalyst serve)                   │
│     ↓                                               │
│  3. Fix Bugs                                        │
│     ↓                                               │
│  4. Deploy to Catalyst (catalyst deploy)            │
│     ↓                                               │
│  5. Update Extension Config                         │
│     ↓                                               │
│  6. Reload Extension in Chrome                      │
│     ↓                                               │
│  7. Test on Real Websites                           │
│     ↓                                               │
│  8. Monitor Logs (catalyst logs)                    │
│     ↓                                               │
│  9. Iterate                                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📈 Scaling Considerations

**Current (MVP):**
- Single function
- No authentication
- No data persistence

**Phase 2:**
- Add authentication
- User preferences stored
- Multiple users supported

**Phase 3:**
- Design token library
- Conversion history
- Analytics dashboard

**Future:**
- Zia AI integration
- Team collaboration
- Figma plugin
- VS Code extension

---

This architecture diagram should help you visualize how everything connects! 🎯

For implementation details, refer to:
- `QUICKSTART_CATALYST.md` - Setup guide
- `README_CATALYST.md` - Complete overview

# 📊 GenUI Datastore Architecture

## 🏗️ System Flow with Datastore

```
┌─────────────────┐
│  Chrome         │
│  Extension      │
│  (User clicks   │
│   element)      │
└────────┬────────┘
         │
         │ 1. Extract styles
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend (React App)               │
│  - Displays extracted styles        │
│  - User selects format              │
│  - Sends to Catalyst                │
└────────┬────────────────────────────┘
         │
         │ 2. POST /convertStyles
         │    { styles, format, useRem }
         │
         ▼
┌─────────────────────────────────────┐
│  Catalyst Function: convertStyles   │
│  ┌──────────────────────────────┐   │
│  │ 1. Convert styles            │   │
│  │ 2. Send response immediately │   │
│  │ 3. Save to datastore (async) │   │
│  └──────────────────────────────┘   │
└────────┬───────────┬────────────────┘
         │           │
         │           │ 3. Save (async)
         │           │
         │           ▼
         │    ┌─────────────────┐
         │    │  Datastore      │
         │    │  Table:         │
         │    │  Conversion     │
         │    │  History        │
         │    └─────────────────┘
         │
         │ 4. Response
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend shows generated code      │
│  - Tailwind classes / CSS / JSX     │
│  - Copy button                      │
│  - [NEW] History tab available      │
└─────────────────────────────────────┘
         │
         │ 5. User clicks "History" tab
         │
         ▼
┌─────────────────────────────────────┐
│  GET /getHistory?limit=10&offset=0  │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Catalyst Function: getHistory      │
│  ┌──────────────────────────────┐   │
│  │ 1. Query datastore           │   │
│  │ 2. Apply filters/pagination  │   │
│  │ 3. Return formatted results  │   │
│  └──────────────────────────────┘   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Frontend displays history          │
│  - List of past conversions         │
│  - Filter by format                 │
│  - Copy any previous result         │
└─────────────────────────────────────┘
```

## 📦 Datastore Schema

### Table: `ConversionHistory`

| Column | Type | Description |
|--------|------|-------------|
| `ROWID` | BIGINT | Auto-generated unique ID |
| `format` | VARCHAR(20) | "tailwind" / "css" / "jsx" |
| `input_styles` | TEXT | JSON string of extracted styles |
| `output_code` | TEXT | Generated code result |
| `user_agent` | VARCHAR(500) | Browser info |
| `CREATEDTIME` | TIMESTAMP | Auto-generated creation time |
| `MODIFIEDTIME` | TIMESTAMP | Auto-generated update time |

### Example Row:

```json
{
  "ROWID": "50209000001234567",
  "format": "tailwind",
  "input_styles": "{\"width\":\"300px\",\"backgroundColor\":\"rgb(59, 130, 246)\"}",
  "output_code": "w-[300px] bg-[#3b82f6]",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "CREATEDTIME": "2025-12-11T10:30:45.123Z",
  "MODIFIEDTIME": "2025-12-11T10:30:45.123Z"
}
```

## 🔧 Functions Overview

### 1. **convertStyles** (Updated)

**Endpoint:** `POST /server/convertStyles/`

**Request:**
```json
{
  "styles": {
    "width": "300px",
    "backgroundColor": "rgb(59, 130, 246)"
  },
  "format": "tailwind",
  "useRem": true
}
```

**Response:**
```json
{
  "success": true,
  "format": "tailwind",
  "code": "w-[300px] bg-[#3b82f6]",
  "originalStyles": { ... }
}
```

**Side Effect:** Saves to datastore (async, non-blocking)

---

### 2. **getHistory** (New)

**Endpoint:** `GET /server/getHistory/`

**Query Parameters:**
- `limit` (default: 10) - Number of records
- `offset` (default: 0) - Pagination offset
- `format` (optional) - Filter by format

**Example Requests:**
```
GET /server/getHistory/
GET /server/getHistory/?limit=5
GET /server/getHistory/?limit=10&offset=20
GET /server/getHistory/?format=css
GET /server/getHistory/?format=tailwind&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "50209000001234567",
      "format": "tailwind",
      "inputStyles": { "width": "300px", ... },
      "outputCode": "w-[300px] bg-[#3b82f6]",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-12-11T10:30:45.123Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 47,
    "hasMore": true
  }
}
```

## 📈 Benefits of Datastore Integration

### ✅ **For Users:**
- 📜 View conversion history
- 🔍 Search past conversions
- 📋 Reuse previous code snippets
- ⏱️ No need to re-extract same elements

### ✅ **For Developers:**
- 📊 Usage analytics
- 🐛 Debug conversion issues
- 💡 Understand popular formats
- 📈 Track growth metrics

### ✅ **For Hackathon:**
- 🎯 Shows advanced Catalyst features
- 💪 Demonstrates full-stack integration
- 🚀 Production-ready architecture
- ⭐ Impressive feature set

## 🎯 Implementation Checklist

- [x] Create `saveToDatastore()` function in convertStyles
- [x] Create `getHistory` function with pagination
- [x] Update `catalyst.json` with new function
- [x] Create package.json for getHistory
- [ ] **Create table in Catalyst Console** ⭐
- [ ] Deploy functions (`catalyst deploy`)
- [ ] Test datastore saving
- [ ] Test history retrieval
- [ ] Add History UI to frontend
- [ ] Add export/download feature (optional)

## 🔐 Security Considerations

### Current Setup (No Auth):
- ✅ Simple for hackathon
- ✅ Anyone can use extension
- ❌ No user-specific history
- ❌ No rate limiting per user

### Future Enhancements:
- Add Zoho OAuth for user login
- Save history per user
- Add rate limiting
- Add data privacy controls

## 💰 Cost Estimate (Zoho Catalyst Free Tier)

**Current Usage:**
- Functions: 2 (convertStyles + getHistory)
- Datastore: 1 table
- Expected records: ~100-500/day for testing

**Free Tier Limits:**
- ✅ 1M function executions/month
- ✅ 1GB datastore storage
- ✅ 100K datastore operations/month

**Verdict:** Well within free tier for hackathon! 🎉

---

**Ready to deploy?** Follow `DATASTORE_DEPLOYMENT.md`! 🚀

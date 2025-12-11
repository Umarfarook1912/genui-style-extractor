# 🎯 Quick Reference: Datastore Setup

## 🚀 Quick Start (3 Steps)

### 1️⃣ Create Table (Catalyst Console)
```
https://console.catalyst.zoho.com/
→ Select "genui-backend"
→ Data Store → Tables → Create Table
→ Name: ConversionHistory
→ Add columns: format, input_styles, output_code, user_agent
```

### 2️⃣ Deploy Functions
```powershell
cd d:\genui-style-extractor\catalyst
catalyst deploy
```

### 3️⃣ Test It
```powershell
# Use extension to convert styles
# Then check table in console
# Or fetch via API:
curl "https://genui-backend-908193831.development.catalystserverless.com/server/getHistory/"
```

---

## 📋 Table Configuration Copy-Paste

| Column | Type | Length | Required |
|--------|------|--------|----------|
| format | VARCHAR | 20 | Yes |
| input_styles | TEXT | 10000 | Yes |
| output_code | TEXT | 10000 | Yes |
| user_agent | VARCHAR | 500 | No |

---

## 🔗 API Endpoints

### Convert Styles (Existing)
```
POST https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles/
```

### Get History (New)
```
GET https://genui-backend-908193831.development.catalystserverless.com/server/getHistory/
GET .../getHistory/?limit=5
GET .../getHistory/?format=css
GET .../getHistory/?limit=10&offset=10
```

---

## 🎨 What's Changed

### Files Modified:
- ✅ `catalyst/functions/convertStyles/index.js` - Now saves to datastore
- ✅ `catalyst/catalyst.json` - Added getHistory to targets

### Files Created:
- ✅ `catalyst/functions/getHistory/index.js` - New history endpoint
- ✅ `catalyst/functions/getHistory/package.json` - Dependencies

---

## ⚡ Testing Commands

```powershell
# Deploy
cd d:\genui-style-extractor\catalyst
catalyst deploy

# Test history endpoint
curl "https://genui-backend-908193831.development.catalystserverless.com/server/getHistory/"

# Test with filters
curl "https://genui-backend-908193831.development.catalystserverless.com/server/getHistory/?format=tailwind&limit=5"

# Check Catalyst logs
# Go to: https://console.catalyst.zoho.com/
# → Functions → convertStyles/getHistory → View Logs
```

---

## 🐛 Troubleshooting

### Error: "Table not found"
→ Create table in Catalyst Console first!

### Error: "Column not found"
→ Verify column names match exactly: `format`, `input_styles`, `output_code`, `user_agent`

### No data saved
→ Check function logs in Catalyst Console
→ Verify table exists and is named `ConversionHistory`

### Can't fetch history
→ Ensure getHistory function is deployed
→ Check URL is correct
→ Verify table has data

---

## 📊 Expected Response Examples

### Successful Conversion (No Change for User)
```json
{
  "success": true,
  "format": "tailwind",
  "code": "w-[300px] bg-[#3b82f6]"
}
```
*Now also saves to datastore in background!*

### History Response
```json
{
  "success": true,
  "data": [{
    "id": "123",
    "format": "tailwind",
    "outputCode": "w-[300px]...",
    "createdAt": "2025-12-11T..."
  }],
  "pagination": {
    "total": 10,
    "hasMore": false
  }
}
```

---

## 📝 Next Steps After Deployment

1. ✅ Verify conversions save to table
2. ✅ Test history API endpoint
3. 🎨 Add History UI to extension (optional)
4. 📊 Add analytics dashboard (optional)
5. 🚀 Demo for hackathon!

---

**Need help?** Check:
- `DATASTORE_DEPLOYMENT.md` - Full deployment guide
- `DATASTORE_ARCHITECTURE.md` - System architecture
- Catalyst Console logs for errors

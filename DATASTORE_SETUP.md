# Setting Up Catalyst Datastore for GenUI

## Step 1: Create Table in Catalyst Console

1. **Go to Catalyst Console**: https://console.catalyst.zoho.com/
2. **Select your project**: `genui-backend`
3. **Navigate to**: Data Store → Tables
4. **Click**: "Create Table"

### Table Configuration

**Table Name**: `ConversionHistory`

**Columns**:

| Column Name | Data Type | Max Length | Required | Unique |
|------------|-----------|------------|----------|--------|
| ROWID | BIGINT | - | ✅ Auto | ✅ Auto |
| format | VARCHAR | 20 | ✅ | ❌ |
| input_styles | TEXT | 10000 | ✅ | ❌ |
| output_code | TEXT | 10000 | ✅ | ❌ |
| user_agent | VARCHAR | 500 | ❌ | ❌ |
| CREATEDTIME | TIMESTAMP | - | ✅ Auto | ❌ |
| MODIFIEDTIME | TIMESTAMP | - | ✅ Auto | ❌ |

**Notes**:
- `ROWID`, `CREATEDTIME`, `MODIFIEDTIME` are auto-created by Catalyst
- `format`: "tailwind", "css", or "jsx"
- `input_styles`: JSON string of extracted styles
- `output_code`: The generated code result
- `user_agent`: Browser info (optional for analytics)

## Step 2: After Table Creation

Once the table is created in the console:

1. Note down the **Table ID** (found in table settings)
2. Run: `catalyst pull datastore` to sync the table locally
3. The table schema will appear in your project structure

## Alternative: Manual Table Creation via API

If you prefer to create the table programmatically, you'll need to:

1. Use Catalyst Node.js SDK in your function
2. Call `catalyst.datastore().createTable()` on first deployment
3. This is more complex and not recommended for hackathon timeline

## Next Steps

After creating the table in the console:
- I'll update the `convertStyles` function to insert records
- Add a `getHistory` endpoint to retrieve past conversions
- Update the frontend to display history

**Ready to proceed?** Create the table in the console, then let me know when done!

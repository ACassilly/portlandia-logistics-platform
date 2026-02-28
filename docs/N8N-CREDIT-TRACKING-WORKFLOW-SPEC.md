# n8n Workflow Spec: Automated Credit Building Milestone Tracker
**For Portlandia Logistics LLC 12-Month Seasoning (Feb 2026 - Feb 2027)**

---

## Document Control

| Attribute | Value |
|-----------|-------|
| **Owner** | Alex Cassilly (alex@cassilly.capital) |
| **Created** | February 28, 2026 |
| **n8n Instance** | automations.bsdyno.com |
| **Related Docs** | [DDS-TO-PL-TRANSITION-ROADMAP.md](./DDS-TO-PL-TRANSITION-ROADMAP.md), [GitHub Issue #6](https://github.com/ACassilly/portlandia-logistics-platform/issues/6) |
| **Deployment** | git.bsdyno.com (GitLab EE) → automations.bsdyno.com |

---

## Workflow Overview

### Purpose
Automatically track Portlandia Logistics LLC's credit building milestones, send progress alerts, update GitHub Issues, and generate monthly reports to ensure the company stays on track for DBA transition readiness by February 2027.

### Key Features
1. **Monthly milestone checks** (1st of each month)
2. **Real-time data pulls** from Odoo, Chase API (if available), credit bureaus (via Nav.com API)
3. **GitHub issue updates** (check/uncheck boxes in Issue #6)
4. **Slack/Email notifications** to Alex Cassilly
5. **CSV export** to GitLab for monthly snapshots

---

## Workflow Architecture

### Trigger Node
**Node**: Schedule Trigger  
**Frequency**: 1st of every month at 9:00 AM EST  
**Start Date**: March 1, 2026  
**End Date**: February 1, 2027  

---

## Data Sources & Integrations

### 1. Odoo 19 ERP (pes.bsdyno.com)
**API Endpoint**: `https://pes.bsdyno.com/api/v1/`  
**Authentication**: API Key (stored in Infisical)

**Queries**:
- Count of invoices issued by Portlandia Logistics LLC (`res.company` = PL LLC)
- Total revenue (sum of `amount_untaxed` for paid invoices)
- Count of vendor/carrier contacts with Net 30 payment terms
- Count of paid invoices (to calculate payment history)

**SQL Query (via Odoo API)**:
```python
# Invoice count & revenue
SELECT 
    COUNT(*) as invoice_count,
    SUM(amount_untaxed) as total_revenue
FROM account_move
WHERE 
    company_id = [PL_LLC_COMPANY_ID]
    AND state = 'posted'
    AND payment_state = 'paid'
    AND move_type = 'out_invoice'
    AND invoice_date >= '2026-02-01'
    AND invoice_date <= CURRENT_DATE;

# Vendor/carrier count with Net 30 terms
SELECT COUNT(*) as vendor_count
FROM res_partner
WHERE 
    company_id = [PL_LLC_COMPANY_ID]
    AND supplier_rank > 0
    AND property_payment_term_id = [NET_30_TERM_ID];
```

---

### 2. Chase Business Banking API (Optional)
**API Endpoint**: `https://api.chase.com/` (if available)  
**Authentication**: OAuth 2.0 (stored in Infisical)

**Queries**:
- Account balance
- Transaction count (deposits/withdrawals)
- Average monthly balance

**Fallback**: If Chase API is unavailable, manually export CSV monthly and upload to GitLab at `data/chase-statements/YYYY-MM.csv`

---

### 3. Nav.com API (Business Credit Monitoring)
**API Endpoint**: `https://api.nav.com/v1/`  
**Authentication**: API Key (stored in Infisical)

**Queries**:
- D&B DUNS number status
- D&B PAYDEX score
- Experian Business credit score
- Equifax Business credit score
- Trade reference count

**Sample API Call**:
```bash
curl -X GET "https://api.nav.com/v1/business-credit-report" \
  -H "Authorization: Bearer {API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"business_id": "[PL_LLC_DUNS_NUMBER]"}'
```

**Response Fields**:
- `paydex_score` (target: 80+)
- `experian_score` (target: 75+)
- `equifax_score` (target: 75+)
- `trade_reference_count` (target: 5+)
- `duns_status` ("active" or "pending")

---

### 4. GitHub API (Issue #6 Updates)
**API Endpoint**: `https://api.github.com/repos/ACassilly/portlandia-logistics-platform/issues/6`  
**Authentication**: GitHub Personal Access Token (stored in Infisical)

**Actions**:
- **Read** current issue body (markdown with checkboxes)
- **Parse** checkbox states (checked/unchecked)
- **Update** checkboxes based on milestone completion
- **Add comment** with monthly summary

**Checkbox Update Logic**:
```javascript
// Example: Mark "First freight invoice" as complete
const issueBody = $node["GitHub_Get_Issue"].json.body;
const updatedBody = issueBody.replace(
  '- [ ] First freight invoice to Portlandia Electric Supply LLC ($2,000+)',
  '- [x] First freight invoice to Portlandia Electric Supply LLC ($2,000+) ✅'
);

// POST updated body back to GitHub
```

---

## Workflow Nodes (Detailed)

### Node 1: Schedule Trigger
- **Type**: Cron Schedule
- **Schedule**: `0 9 1 * *` (9 AM on the 1st of every month)
- **Timezone**: America/New_York

---

### Node 2: Get Current Date & Calculate Month
- **Type**: Code (JavaScript)
- **Purpose**: Determine which milestone quarter we're in (Month 1-3, 4-6, 7-9, 10-12)

```javascript
const now = new Date();
const startDate = new Date('2026-02-01');
const monthsSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30));

let quarter;
if (monthsSinceStart <= 3) quarter = 'Q1';
else if (monthsSinceStart <= 6) quarter = 'Q2';
else if (monthsSinceStart <= 9) quarter = 'Q3';
else quarter = 'Q4';

return [{
  json: {
    current_date: now.toISOString(),
    months_since_start: monthsSinceStart,
    quarter: quarter
  }
}];
```

---

### Node 3: Query Odoo (Invoice Count & Revenue)
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://pes.bsdyno.com/api/v1/search_read`
- **Headers**:
  - `Authorization: Bearer {{$env.ODOO_API_KEY}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "model": "account.move",
  "domain": [
    ["company_id", "=", "{{$env.PL_LLC_COMPANY_ID}}"],
    ["state", "=", "posted"],
    ["payment_state", "=", "paid"],
    ["move_type", "=", "out_invoice"],
    ["invoice_date", ">=", "2026-02-01"]
  ],
  "fields": ["id", "name", "amount_untaxed", "invoice_date"]
}
```

---

### Node 4: Query Odoo (Vendor Count with Net 30)
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://pes.bsdyno.com/api/v1/search_count`
- **Body**:
```json
{
  "model": "res.partner",
  "domain": [
    ["company_id", "=", "{{$env.PL_LLC_COMPANY_ID}}"],
    ["supplier_rank", ">", 0],
    ["property_payment_term_id", "=", "{{$env.NET_30_TERM_ID}}"]
  ]
}
```

---

### Node 5: Query Nav.com (Credit Scores)
- **Type**: HTTP Request
- **Method**: GET
- **URL**: `https://api.nav.com/v1/business-credit-report?business_id={{$env.PL_LLC_DUNS}}`
- **Headers**:
  - `Authorization: Bearer {{$env.NAV_API_KEY}}`
- **Fallback**: If API call fails (404 = DUNS not yet active), return default scores of 0

---

### Node 6: Calculate Milestone Completion
- **Type**: Code (JavaScript)
- **Purpose**: Compare actual data vs. targets and determine which checkboxes to mark complete

```javascript
const odooInvoices = $node["Odoo_Invoices"].json;
const odooVendors = $node["Odoo_Vendors"].json;
const navCredit = $node["Nav_Credit"].json;

const invoiceCount = odooInvoices.length;
const totalRevenue = odooInvoices.reduce((sum, inv) => sum + inv.amount_untaxed, 0);
const vendorCount = odooVendors.count;
const paydexScore = navCredit.paydex_score || 0;
const experianScore = navCredit.experian_score || 0;
const equifaxScore = navCredit.equifax_score || 0;
const dunsStatus = navCredit.duns_status || 'pending';

// Define milestones (example for Month 4-6)
const milestones = {
  duns_active: dunsStatus === 'active',
  six_invoices: invoiceCount >= 6,
  ten_k_revenue: totalRevenue >= 10000,
  five_vendors: vendorCount >= 5
};

return [{
  json: {
    invoice_count: invoiceCount,
    total_revenue: totalRevenue,
    vendor_count: vendorCount,
    paydex_score: paydexScore,
    experian_score: experianScore,
    equifax_score: equifaxScore,
    duns_status: dunsStatus,
    milestones_completed: milestones
  }
}];
```

---

### Node 7: Update GitHub Issue (Check Boxes)
- **Type**: HTTP Request
- **Method**: PATCH
- **URL**: `https://api.github.com/repos/ACassilly/portlandia-logistics-platform/issues/6`
- **Headers**:
  - `Authorization: token {{$env.GITHUB_TOKEN}}`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "body": "{{$node['Node6'].json.updated_issue_body}}"
}
```

**Logic**: Use JavaScript in Node 6 to replace `- [ ]` with `- [x]` for completed milestones.

---

### Node 8: Add GitHub Comment (Monthly Summary)
- **Type**: HTTP Request
- **Method**: POST
- **URL**: `https://api.github.com/repos/ACassilly/portlandia-logistics-platform/issues/6/comments`
- **Body**:
```json
{
  "body": "## Monthly Credit Building Update: {{$node['Node2'].json.quarter}}\n\n**Invoice Count**: {{$node['Node6'].json.invoice_count}}\n**Total Revenue**: ${{$node['Node6'].json.total_revenue}}\n**Vendor Count (Net 30)**: {{$node['Node6'].json.vendor_count}}\n**D&B PAYDEX**: {{$node['Node6'].json.paydex_score}}\n**Experian Business**: {{$node['Node6'].json.experian_score}}\n**Equifax Business**: {{$node['Node6'].json.equifax_score}}\n**DUNS Status**: {{$node['Node6'].json.duns_status}}\n\n✅ Milestones completed this month: [list]\n⚠️ Behind schedule: [list]"
}
```

---

### Node 9: Send Slack Notification
- **Type**: Slack (native n8n node)
- **Channel**: `#credit-building` (create this channel)
- **Message**:
```markdown
🎯 **Monthly Credit Building Update: {{$node['Node2'].json.quarter}}**

📊 **Current Stats**:
- Invoices: {{$node['Node6'].json.invoice_count}}
- Revenue: ${{$node['Node6'].json.total_revenue}}
- Vendors (Net 30): {{$node['Node6'].json.vendor_count}}
- D&B PAYDEX: {{$node['Node6'].json.paydex_score}}
- Experian: {{$node['Node6'].json.experian_score}}
- Equifax: {{$node['Node6'].json.equifax_score}}

✅ On track | ⚠️ Behind schedule

🔗 [View GitHub Tracker](https://github.com/ACassilly/portlandia-logistics-platform/issues/6)
```

---

### Node 10: Export CSV to GitLab
- **Type**: Code (JavaScript) + HTTP Request
- **Purpose**: Save monthly snapshot as CSV for historical tracking

**CSV Format**:
```csv
month,invoice_count,total_revenue,vendor_count,paydex_score,experian_score,equifax_score,duns_status
2026-03,2,4000,3,0,0,0,pending
2026-04,4,8000,4,0,0,0,pending
...
```

**GitLab Commit**:
- **Repo**: `git.bsdyno.com/portlandia-logistics/credit-tracking-data`
- **File**: `monthly-snapshots/YYYY-MM.csv`
- **Method**: POST to GitLab Files API

---

### Node 11: Send Email to Alex (Alert if Behind)
- **Type**: Email (SendGrid)
- **Condition**: IF milestones are **not** on track (use IF node before this)
- **To**: alex@cassilly.capital
- **Subject**: ⚠️ Portlandia Logistics LLC Credit Building: Behind Schedule
- **Body**:
```markdown
Alex,

Our automated credit tracker has detected that Portlandia Logistics LLC is behind schedule on the following milestones:

[List of incomplete milestones that should have been complete by now]

**Current Stats**:
- Invoices: {{invoice_count}} (target: [target])
- Revenue: ${{total_revenue}} (target: $[target])
- Vendors: {{vendor_count}} (target: [target])

**Action Items**:
1. [Auto-generated suggestions based on gaps]

🔗 [View GitHub Tracker](https://github.com/ACassilly/portlandia-logistics-platform/issues/6)
🔗 [View Full Roadmap](https://github.com/ACassilly/portlandia-logistics-platform/blob/main/docs/DDS-TO-PL-TRANSITION-ROADMAP.md)

This is an automated alert from automations.bsdyno.com.
```

---

## Environment Variables (Infisical)

Store these secrets in Infisical at `shared/portlandia-logistics/credit-tracker`:

| Variable | Value | Source |
|----------|-------|--------|
| `ODOO_API_KEY` | [Your Odoo API Key] | pes.bsdyno.com Settings |
| `PL_LLC_COMPANY_ID` | [PL LLC Company ID in Odoo] | Odoo `res.company` table |
| `NET_30_TERM_ID` | [Payment Term ID for Net 30] | Odoo `account.payment.term` table |
| `NAV_API_KEY` | [Nav.com API Key] | Nav.com Account Settings |
| `PL_LLC_DUNS` | [DUNS Number for PL LLC] | D&B website |
| `GITHUB_TOKEN` | [GitHub Personal Access Token] | GitHub Settings → Developer |
| `SENDGRID_API_KEY` | [SendGrid API Key] | SendGrid Dashboard |
| `SLACK_WEBHOOK_URL` | [Slack Webhook for #credit-building] | Slack App Settings |

---

## Deployment Instructions

### Step 1: Create n8n Workflow
1. Log in to `automations.bsdyno.com`
2. Create new workflow: "Portlandia Logistics Credit Tracker"
3. Import nodes as specified above
4. Connect nodes in sequence (Trigger → Node 2 → Node 3 → ... → Node 11)

### Step 2: Configure Infisical Integration
1. Add Infisical node at the start of workflow
2. Fetch all secrets from `shared/portlandia-logistics/credit-tracker`
3. Make secrets available as `$env` variables

### Step 3: Test Workflow
1. **Manual trigger**: Run workflow once manually to test all nodes
2. **Verify outputs**:
   - GitHub Issue #6 is updated
   - Slack message appears in `#credit-building`
   - CSV is committed to GitLab
3. **Check for errors**: Review n8n execution logs

### Step 4: Enable Schedule
1. Activate the Schedule Trigger node
2. Verify cron syntax: `0 9 1 * *`
3. Set workflow to "Active"

### Step 5: Backup to GitLab
1. Export n8n workflow as JSON
2. Commit to GitLab: `git.bsdyno.com/portlandia-logistics/n8n-workflows/credit-tracker.json`
3. Use GitLab CI/CD to auto-deploy changes to `automations.bsdyno.com`

---

## Monitoring & Maintenance

### Monthly Review (by Alex Cassilly)
- Review Slack notifications on the 1st of each month
- Check GitHub Issue #6 for updated checkboxes
- If behind schedule, address gaps immediately
- Update targets in workflow if business conditions change

### Quarterly Audit (by Alex Cassilly)
- Export all CSV snapshots from GitLab
- Generate trend chart (invoice count, revenue, credit scores over time)
- Compare actual vs. target using execute_code tool
- Document lessons learned in GitHub issue comments

### Annual Review (Feb 2027)
- Final assessment: Are we ready for DBA transition?
- If yes: Proceed with customer transition emails (see [DDS-PL-CUSTOMER-TRANSITION-EMAIL-TEMPLATE.md](./DDS-PL-CUSTOMER-TRANSITION-EMAIL-TEMPLATE.md))
- If no: Extend timeline and document reasons in GitHub

---

## Error Handling

### If Odoo API Fails
- **Fallback**: Manual CSV upload to GitLab at `data/manual-uploads/YYYY-MM-odoo.csv`
- **Alert**: Send email to alex@cassilly.capital with error details

### If Nav.com API Fails (DUNS not yet active)
- **Fallback**: Return default scores of 0 (don't fail the workflow)
- **Note in GitHub**: Add comment "⚠️ Nav.com API returned 404 - DUNS not yet active"

### If GitHub API Fails
- **Fallback**: Skip GitHub update, but still send Slack/email notifications
- **Alert**: Log error to GitLab issue tracker

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 28, 2026 | Alex Cassilly | Initial workflow spec created |

---

**End of Spec**

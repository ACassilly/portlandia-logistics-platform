# Portlandia Logistics Platform - Deployment Guide

## 🎯 Infrastructure Overview

### Current Status: READY FOR DEPLOYMENT ✅

All infrastructure components are configured and operational:

- **GitHub Repository**: ACassilly/portlandia-logistics-platform
- **Azure Static Web Apps**: portlandia-logistics (Production)
- **Microsoft Clarity**: Analytics configured (ID: uybmm1wu3o) 
- **ClickUp**: 6 tasks tracking implementation
- **Domain**: www.portlandialogistics.com (pending DNS)

## 🚀 Deployment Steps

### Step 1: Get Application Code from v0.dev

The application code is currently in v0.dev and includes:
- ✅ Complete Next.js application
- ✅ Microsoft Clarity tracking (already integrated)
- ✅ Google Analytics
- ✅ Odoo ERP integration points
- ✅ Professional UI components

**To export from v0.dev:**
1. Open v0.dev project: [Portlandia Logistics Migration Build](https://v0.app/chat/portlandia-logistics-migration-build-from-shopify-vKUqjE4pfvI)
2. Click the GitHub icon (top right)
3. Create repository or push to existing
4. Select ACassilly as the Git scope
5. Use repository name: `portlandia-logistics-platform`

### Step 2: Configure Azure Deployment Token

1. **Get deployment token from Azure:**
   - Go to [Azure Portal - portlandia-logistics](https://portal.azure.com/#@PortlandiaElectricSupply.onmicrosoft.com/resource/subscriptions/32de7f57-53c1-4305-a5d6-c72902f50b69/resourcegroups/rg-rds-pes/providers/Microsoft.Web/staticSites/portlandia-logistics/staticsite)
   - Click "Manage deployment token"
   - Copy the token

2. **Add to GitHub Secrets:**
   - Go to repository Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - Value: (paste the deployment token)
   - Click "Add secret"

### Step 3: Create GitHub Actions Workflow

Create `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          api_location: ""
          output_location: "out"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

### Step 4: Configure Environment Variables

Create `.env.local` (for local development):

```env
NEXT_PUBLIC_CLARITY_ID=uybmm1wu3o
NEXT_PUBLIC_GA_ID=GT-TBVWPB48
ODOO_URL=https://erp.portlandialogistics.com
ODOO_DB=portlandia_logistics
```

For Azure Static Web Apps, add these in Azure Portal:
- Configuration > Application settings

### Step 5: Configure Custom Domain

1. **In Azure Portal:**
   - Navigate to portlandia-logistics resource
   - Click "Custom domains"
   - Click "Add"
   - Enter: `www.portlandialogistics.com`
   - Follow validation steps

2. **Configure DNS:**
   - Add CNAME record:
     - Name: `www`
     - Value: `green-hill-08d7dec10.4.azurestaticapps.net`
   - Add TXT record for validation (Azure will provide)

### Step 6: Verify Deployment

1. **Check GitHub Actions:**
   - Go to repository > Actions tab
   - Verify workflow runs successfully

2. **Test site:**
   - Visit: https://green-hill-08d7dec10.4.azurestaticapps.net
   - Once DNS configured: https://www.portlandialogistics.com

3. **Verify Analytics:**
   - Open Microsoft Clarity: https://clarity.microsoft.com/projects/view/uybmm1wu3o
   - Check for incoming data

## 🔧 Configuration Files

### Required Files:
- `staticwebapp.config.json` - Azure routing configuration
- `next.config.js` - Next.js configuration with static export
- `.github/workflows/azure-static-web-apps.yml` - CI/CD pipeline

### Example staticwebapp.config.json:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "responseOverrides": {
    "404": {
      "rewrite": "/404.html"
    }
  }
}
```

### Example next.config.js:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  }
}

module.exports = nextConfig
```

## 📊 Post-Deployment Checklist

- [ ] Application deploys successfully to Azure
- [ ] Custom domain www.portlandialogistics.com configured
- [ ] SSL certificate active
- [ ] Microsoft Clarity tracking verified
- [ ] Google Analytics tracking verified
- [ ] Odoo ERP integration tested
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Mobile responsiveness verified

## 🔗 Key Resources

- **Azure Portal**: https://portal.azure.com (portlandia-logistics)
- **Clarity Dashboard**: https://clarity.microsoft.com/projects/view/uybmm1wu3o
- **Odoo ERP**: https://erp.portlandialogistics.com
- **v0.dev Project**: https://v0.app/chat/portlandia-logistics-migration-build-from-shopify-vKUqjE4pfvI
- **ClickUp Tasks**: Big Sky Dynamics / Portlandia Logistics Platform

## 🆘 Troubleshooting

### Build Failures
- Check GitHub Actions logs for errors
- Verify all dependencies in package.json
- Ensure Next.js configured for static export

### Deployment Token Issues
- Regenerate token in Azure Portal
- Update GitHub Secret
- Re-run workflow

### Analytics Not Tracking
- Verify Clarity ID in environment variables
- Check browser console for errors
- Confirm tracking code in layout.tsx

---

# portlandia-logistics-platform
Full-stack freight brokerage platform for Portlandia Logistics - Next.js frontend with Odoo ERP backend, Azure deployment, Microsoft Clarity analytics

## 🚀 Project Overview

Modern freight brokerage platform built with Next.js, integrating with Odoo ERP for comprehensive logistics management. Deployed on Azure Static Web Apps with Microsoft Clarity analytics.

## 🏗️ Infrastructure

### Production Environment
- **Platform**: Azure Static Web Apps
- **URL**: https://green-hill-08d7dec10.4.azurestaticapps.net
- **Custom Domain**: www.portlandialogistics.com (pending DNS configuration)
- **Resource Group**: rg-rds-pes
- **Deployment**: GitHub Actions CI/CD

### Analytics
- **Microsoft Clarity**: Project ID `uybmm1wu3o`
- **Tracking**: User behavior, heatmaps, session recordings

### Backend Integration
- **Odoo ERP**: erp.portlandialogistics.com
- **API**: Azure Functions for serverless backend

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Deployment**: Azure Static Web Apps
- **Analytics**: Microsoft Clarity
- **ERP**: Odoo (Headless)
- **CI/CD**: GitHub Actions

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- Azure CLI
- GitHub account

### Local Development

```bash
# Clone repository
git clone https://github.com/ACassilly/portlandia-logistics-platform.git
cd portlandia-logistics-platform

# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_CLARITY_ID=uybmm1wu3o
ODOO_URL=https://erp.portlandialogistics.com
ODOO_DB=your_database
ODOO_USERNAME=your_username
ODOO_PASSWORD=your_password
```

## 🚢 Deployment

### Azure Static Web Apps

1. **Configure GitHub Secret**:
   - Get deployment token from Azure Portal
   - Add as `AZURE_STATIC_WEB_APPS_API_TOKEN` in GitHub Secrets

2. **GitHub Actions Workflow**:
   - Located at `.github/workflows/azure-static-web-apps.yml`
   - Automatic deployment on push to `main` branch

3. **Custom Domain**:
   - Configure DNS: CNAME record pointing to Azure Static Web Apps URL
   - Add custom domain in Azure Portal

## 📊 Project Management

- **Platform**: ClickUp
- **Workspace**: Big Sky Dynamics - PES Global - Cassilly Capital
- **Folder**: Portlandia Logistics Platform

## 🔗 Key Links

- **Production**: https://www.portlandialogistics.com
- **Azure Portal**: [portlandia-logistics](https://portal.azure.com/#@PortlandiaElectricSupply.onmicrosoft.com/resource/subscriptions/32de7f57-53c1-4305-a5d6-c72902f50b69/resourcegroups/rg-rds-pes/providers/Microsoft.Web/staticSites/portlandia-logistics/staticsite)
- **Clarity Dashboard**: [Project uybmm1wu3o](https://clarity.microsoft.com/projects/view/uybmm1wu3o)
- **Odoo ERP**: https://erp.portlandialogistics.com

## 📝 License

MIT License - see LICENSE file for details

## 👥 Team

Dynamic Distribution Solutions LLC
A Cassilly Capital Portfolio Company

# Vendor & Product Setup Guide

## Overview
This document outlines the vendor hierarchy and product supercession setup for the Generac product line demonstration.

## Vendor Hierarchy

### Master Catalog Holder
- **Company**: PES Global Group Company
- **Role**: Parent organization holding the master product catalog

### Manufacturer
- **Name**: Generac Power Systems
- **Type**: Manufacturer
- **Parent**: PES Global Group Company
- **Website**: https://www.generac.com

### Sub-Vendors (Authorized Dealers)

| Vendor Name | Type | Relationship | Portal |
|-------------|------|--------------|--------|
| Generac Official Store | Direct | Primary Supplier | shop.generac.com |
| Power Equipment Direct | Authorized Dealer | Secondary | powerequipmentdirect.com |
| Electric Generators Direct | Authorized Dealer | Tertiary | electricgeneratorsdirect.com |

## Products

### Legacy Product (Superseded)
- **SKU**: 7043-2
- **Name**: Generac Guardian 22kW Standby Generator (Legacy)
- **Status**: Discontinued/Superseded
- **Supercession**: Replaced by 7043-3

### Current Product
- **SKU**: 7043-3  
- **Name**: Generac Guardian 22.0KW Standby Generator
- **Status**: Active
- **Features**: Air-Cooled, WiFi Enabled, Mobile Link Compatible

## Supercession Configuration

### Product Relationship
```
7043-2 (Legacy) --> SUPERSEDED BY --> 7043-3 (Current)
```

### Cross-Sell/Upsell Configuration
- Legacy product pages display supercession notice
- Automatic redirect with interstitial banner option
- Cross-sell accessories maintained across supercession

## Procurement Credentials
- **Portal**: shop.generac.com
- **Account**: procurement@pessupply.com
- **Stored in**: GitHub Secrets (GENERAC_PROCUREMENT_CREDENTIALS)

## Odoo Configuration Tasks

### Project: Product Supercession Updates
1. Send dealer notification email about 7043-2 to 7043-3 supercession
2. Update Dealer Portal (Odoo Webshop): Configure product visibility and supercession notification
3. Update Shopify: Set up 301 redirect for 7043-2 to 7043-3 with interstitial banner

## Related Documentation
- Notion: Vendor Management Procedures
- Odoo: Product Supercession Module Configuration
- Shopify: URL Redirect Management

---
*Last Updated: January 2026*
*Maintained by: Portlandia Logistics Team*

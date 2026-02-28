# Dynamic Distribution Solutions → Portlandia Logistics LLC Transition Roadmap
**5PL Evolution Strategy: From DBA to Independent Agency Model**

---

## Document Control

| Attribute | Value |
|-----------|-------|
| **Owner** | Alex Cassilly (alex@cassilly.capital) |
| **Created** | February 28, 2026 |
| **Status** | Active Roadmap |
| **Source** | Perplexity Space → PES Supply Product Management |
| **GitHub Repo** | [ACassilly/portlandia-logistics-platform](https://github.com/ACassilly/portlandia-logistics-platform) |
| **Related Docs** | [Portlandia Logistics Odoo 19 Build Spec](./Portlandia-Logistics-Odoo-19-Build-Spec.md), [COMPANY_STRUCTURE.md](https://github.com/PESConnect/pes-odoo-erp-infrastructure/blob/main/docs/COMPANY_STRUCTURE.md) |

---

## Executive Summary

**Dynamic Distribution Solutions LLC (DDS)** and **Portlandia Logistics LLC** are two distinct legal entities with a strategic transition plan:

- **Current State (2026)**: DDS operates as a 3PL DBA "Portlandia Logistics" handling external freight brokerage; Portlandia Logistics LLC is a newly formed Wyoming LLC building credit as the internal 5PL for PES Supply.
- **Future State (2027+)**: DDS drops the "Portlandia Logistics" DBA and becomes the **backend operational stack** (carriers, systems, infrastructure) while **Portlandia Logistics LLC** becomes the **customer-facing 5PL agency brand**.

This document defines the **12-month seasoning timeline**, **brand transition**, **DBA sunset**, and **operational handoff** between the two entities.

---

## Part 1: Entity Structure & Current State

### Dynamic Distribution Solutions LLC (DDS)

| Attribute | Value |
|-----------|-------|
| **Legal Name** | Dynamic Distribution Solutions LLC |
| **DBA** | Portlandia Logistics (customer-facing brand) |
| **Role** | 3PL (Third-Party Logistics) — External freight brokerage |
| **Parent** | Cassilly Capital LLC |
| **Status** | ✅ Active (Phase 1) |
| **Operations** | External freight customers, carrier network, operational backbone |
| **Odoo Company** | Separate `res.company` in Cassilly/PES shared DB |
| **Banking** | Consolidated under Cassilly Capital |

**Key Point**: DDS is the **legacy entity** that has been operating freight brokerage services under the "Portlandia Logistics" brand name. It handles **external 3PL services** for non-PES customers.

---

### Portlandia Logistics LLC (Standalone)

| Attribute | Value |
|-----------|-------|
| **Legal Name** | Portlandia Logistics LLC (Wyoming LLC, Standalone) |
| **DBA** | None (operates under legal name) |
| **Role** | 5PL (Fifth-Party Logistics) — Internal logistics orchestration for PES Supply |
| **Parent** | Cassilly Capital LLC |
| **Status** | ✅ Newly formed (Phase 1, 2026) |
| **Operations** | Internal PES fulfillment coordination, supply chain management, tech platform |
| **Website** | portlandialogistics.com |
| **Portal** | id.portlandialogistics.com |
| **Banking** | Own Chase business account, own EIN |
| **Odoo Company** | Separate `res.company` in Cassilly/PES shared DB |

**Key Point**: Portlandia Logistics LLC is the **new standalone entity** that will become the primary customer-facing 5PL agency brand after seasoning. It currently operates **internally** as PES Supply's logistics coordination hub.

---

## Part 2: The Strategic Transition Plan

### Phase 1: Parallel Operations (2026 — Current)

**Timeline**: February 2026 → February 2027 (12 months)

**DDS Operations**:
- Continues as 3PL DBA "Portlandia Logistics"
- Handles external freight customers
- Maintains carrier network and operational infrastructure
- Odoo 19 integrated under Cassilly Capital hierarchy

**Portlandia Logistics LLC Operations**:
- **Building credit**: 12 months of independent transactions on its own EIN
- **Internal 5PL**: Coordinates PES Supply fulfillment, tracks shipments, manages logistics workflows
- **Revenue generation**: When PL LLC sells freight services to Portlandia Electric Supply LLC, it's treated as an **arm's length vendor transaction** (not inter-company elimination) to build independent credit profile
- **Tech stack**: portlandialogistics.com website, id.portlandialogistics.com portal, Odoo 19 integration, OpenClaw agent gateway

**Credit Building Activities**:
1. Chase business banking with 12 months of deposits/withdrawals
2. Payment history with carriers, insurance providers, SaaS vendors
3. Vendor freight invoices to Portlandia Electric Supply LLC (tracked as external vendor, not inter-company)
4. Revenue documentation for business credit bureaus (Dun & Bradstreet, Experian Business, Equifax Business)

---

### Phase 2: DBA Sunset & Brand Handoff (Q1 2027)

**Timeline**: February 2027 → April 2027

**Trigger**: Portlandia Logistics LLC completes 12 months of seasoning and has established:
- ✅ 12+ months of Chase banking history
- ✅ Dun & Bradstreet PAYDEX score (target: 80+)
- ✅ Experian Business and Equifax Business credit scores
- ✅ Trade references with 5+ vendors/carriers
- ✅ Revenue documentation (invoices, bank statements)

**Actions**:
1. **DDS drops the DBA "Portlandia Logistics"**:
   - File DBA cancellation with Wyoming Secretary of State
   - Update all legal/banking/vendor records to show "Dynamic Distribution Solutions LLC" (no DBA)
   - Notify external customers of brand transition

2. **Portlandia Logistics LLC assumes full brand ownership**:
   - All customer-facing materials rebrand to "Portlandia Logistics LLC"
   - Website, portal, email domains remain unchanged (already owned by PL LLC)
   - Marketing collateral updated to reflect standalone LLC

3. **Customer transition**:
   - External 3PL customers currently served by DDS DBA "Portlandia Logistics" are **transitioned to Portlandia Logistics LLC** as the customer-facing entity
   - Existing contracts/agreements novated or assigned to PL LLC
   - DDS becomes the **backend service provider** to PL LLC (white-label operational stack)

---

### Phase 3: Backend Stack Model (Q2 2027+)

**Timeline**: April 2027 → Ongoing

**DDS Role (Post-DBA Sunset)**:
- **No longer customer-facing** (no DBA, no external brand)
- **Backend operational stack provider** for Portlandia Logistics LLC:
  - Carrier network and freight execution
  - Dispatch and routing systems
  - Warehouse/distribution infrastructure (if applicable)
  - Operational support (hidden from customers)

**Portlandia Logistics LLC Role (Post-Seasoning)**:
- **Customer-facing 5PL agency**:
  - All external freight brokerage customers
  - Tech platform (portlandialogistics.com, id.portlandialogistics.com)
  - Sales, marketing, customer success
  - Billing and invoicing under "Portlandia Logistics LLC"

**Inter-Company Model**:
- **Portlandia Logistics LLC** invoices customers for freight services
- **Portlandia Logistics LLC** pays **DDS** for backend operational execution (inter-company transaction, eliminated at Cassilly consolidation)
- **DDS** remains as the **hidden infrastructure provider** (no customer exposure)

---

## Part 3: Odoo 19 Integration Plan

### Current Odoo Setup (Phase 1)

Both entities exist as separate `res.company` records in the **Cassilly/PES shared Odoo 19 database**:

| Entity | Odoo Company ID | Parent | Role | Portal |
|--------|-----------------|--------|------|--------|
| **Cassilly Capital LLC** | 1 | *(root)* | HoldCo | *(no public portal)* |
| **Dynamic Distribution Solutions LLC** | *(TBD)* | Cassilly Capital | 3PL Ops | *(no public portal)* |
| **Portlandia Logistics LLC** | *(TBD)* | Cassilly Capital | 5PL Agency | id.portlandialogistics.com |

**OpenClaw Integration**:
- Both DDS and PL LLC have access to **OpenClaw agent gateway** for AI-driven logistics automation
- Shared n8n workflows at `automations.bsdyno.com`
- Shared GitLab EE at `git.bsdyno.com` for deployment automation

---

### Post-Transition Odoo Model (Phase 3)

| Entity | Odoo Role | Customer Access | Backend Access |
|--------|-----------|-----------------|----------------|
| **Portlandia Logistics LLC** | Customer-facing company | ✅ id.portlandialogistics.com portal | ✅ Full ERP access |
| **Dynamic Distribution Solutions LLC** | Backend operations company | ❌ No portal | ✅ Internal Odoo access only |

**Key Changes**:
1. **All customer contacts, sales orders, invoices** → migrated to Portlandia Logistics LLC `res.company`
2. **All carrier contacts, purchase orders, dispatch tasks** → remain under DDS `res.company` (backend)
3. **Inter-company invoicing**: PL LLC purchases "freight execution services" from DDS monthly (eliminated at consolidation)
4. **Automation workflows**: n8n/OpenClaw scripts updated to route customer-facing tasks to PL LLC, backend execution to DDS

---

## Part 4: Credit Building Milestones

### Month 1-3 (Feb-Apr 2026)

| Milestone | Target | Status |
|-----------|--------|--------|
| Chase business account opened | $5,000 initial deposit | ✅ Complete |
| First freight invoice to Portlandia Electric Supply LLC | $2,000+ per invoice | ✅ In Progress |
| Carrier payment history started | Net 30 terms, 3+ carriers | ✅ In Progress |
| D&B DUNS number requested | File for DUNS within 30 days | 🔄 Pending |

---

### Month 4-6 (May-Jul 2026)

| Milestone | Target | Status |
|-----------|--------|--------|
| D&B DUNS number active | DUNS assigned, D&B profile live | 🔄 Pending |
| 6+ freight invoices paid | $10,000+ cumulative revenue | 🔄 Pending |
| Trade references established | 5+ vendors with Net 30 terms | 🔄 Pending |
| Business insurance active | General liability + cargo insurance | 🔄 Pending |

---

### Month 7-9 (Aug-Oct 2026)

| Milestone | Target | Status |
|-----------|--------|--------|
| Experian Business credit file opened | Score: 60+ | 🔄 Pending |
| Equifax Business credit file opened | Score: 60+ | 🔄 Pending |
| 10+ freight invoices paid | $20,000+ cumulative revenue | 🔄 Pending |
| SaaS vendor reporting to business bureaus | n8n, OpenClaw, Grafana, etc. | 🔄 Pending |

---

### Month 10-12 (Nov 2026-Jan 2027)

| Milestone | Target | Status |
|-----------|--------|--------|
| D&B PAYDEX score | 80+ (Pay 30 days early) | 🔄 Pending |
| Experian Business score | 75+ | 🔄 Pending |
| Equifax Business score | 75+ | 🔄 Pending |
| 15+ freight invoices paid | $30,000+ cumulative revenue | 🔄 Pending |
| **READY FOR FINANCING** | Business credit established, DBA sunset approved | 🔄 Pending |

---

## Part 5: Brand Transition Checklist

### Pre-Transition (Month 11, January 2027)

- [ ] **Credit verification**: Confirm D&B, Experian, Equifax scores meet targets (80+, 75+, 75+)
- [ ] **Legal review**: Wyoming attorney confirms DBA cancellation process for DDS
- [ ] **Customer communication plan**: Draft email/letter template notifying external customers of brand transition
- [ ] **Contract review**: Identify all DDS customer contracts requiring novation/assignment to PL LLC
- [ ] **Odoo data migration plan**: Map all DDS customer records → PL LLC `res.company`

---

### Transition Month (Month 12, February 2027)

- [ ] **File DBA cancellation**: DDS drops "Portlandia Logistics" DBA with Wyoming SOS
- [ ] **Customer notifications**: Send transition emails to all external 3PL customers
- [ ] **Contract novations**: Execute contract assignments/novations to Portlandia Logistics LLC
- [ ] **Odoo migration**: Migrate customer records, sales orders, invoices to PL LLC company
- [ ] **Website/portal update**: Update portlandialogistics.com footer/legal to reference "Portlandia Logistics LLC" (already correct, no change needed)
- [ ] **Banking update**: Notify Chase of brand transition (PL LLC already has own account, no change needed)

---

### Post-Transition (Month 13+, March 2027+)

- [ ] **DDS rebranding (internal only)**: Update DDS internal materials to reflect "backend operations" role
- [ ] **Inter-company invoicing setup**: Establish monthly invoicing from DDS → PL LLC for backend services
- [ ] **Customer success check-ins**: Follow up with transitioned customers to ensure smooth handoff
- [ ] **Credit monitoring**: Continue monitoring business credit scores monthly
- [ ] **Financing applications**: Apply for business credit lines, equipment financing, SBA loans as needed

---

## Part 6: Risk Mitigation

### Risk 1: Credit Profile Not Ready by Month 12

**Mitigation**:
- **Extend timeline**: If credit scores don't hit targets (80+, 75+, 75+), delay DBA sunset by 3-6 months
- **Accelerate vendor payments**: Pay invoices 15-30 days early to boost PAYDEX score
- **Add trade references**: Onboard additional vendors reporting to business bureaus

---

### Risk 2: Customer Confusion During Transition

**Mitigation**:
- **Clear communication**: Email + phone call to each customer explaining the transition
- **Brand continuity**: Emphasize that portlandialogistics.com, contact info, and team remain the same
- **Contract addendums**: Offer simple one-page addendum confirming entity change (not a full re-contract)

---

### Risk 3: Odoo Data Migration Errors

**Mitigation**:
- **Test migration**: Run pilot migration on 5 customer records in Odoo sandbox first
- **Backup plan**: Export all DDS customer data to CSV before migration, keep as rollback archive
- **Gradual rollout**: Migrate customers in batches (10 per week) rather than all at once

---

### Risk 4: Inter-Company Invoicing Complexity

**Mitigation**:
- **Standard rate card**: Establish fixed monthly rate for DDS backend services (e.g., $5,000/month + 10% of freight revenue)
- **Automated workflows**: Use n8n to auto-generate DDS → PL LLC invoices monthly
- **Consolidation notes**: Clearly document that these invoices are eliminated at Cassilly Capital consolidation (not external expenses)

---

## Part 7: Success Metrics

### Credit Building Success (Month 12)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| D&B PAYDEX Score | 80+ | *(TBD)* | 🔄 Pending |
| Experian Business Score | 75+ | *(TBD)* | 🔄 Pending |
| Equifax Business Score | 75+ | *(TBD)* | 🔄 Pending |
| Trade References | 5+ vendors | *(TBD)* | 🔄 Pending |
| Cumulative Revenue | $30,000+ | *(TBD)* | 🔄 Pending |

---

### Operational Success (Month 18, Post-Transition)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Customer Retention (Post-Transition) | 95%+ | *(TBD)* | 🔄 Pending |
| PL LLC Revenue Growth | 20% YoY | *(TBD)* | 🔄 Pending |
| DDS Backend Cost Efficiency | <15% of PL LLC revenue | *(TBD)* | 🔄 Pending |
| Customer NPS (Net Promoter Score) | 50+ | *(TBD)* | 🔄 Pending |

---

## Part 8: Timeline Visualization

```
2026
│
├── Feb: Portlandia Logistics LLC formed (Wyoming), Chase account opened
├── Mar-Apr: First freight invoices to PES Supply, DUNS number requested
├── May-Jul: Trade references established, business insurance active
├── Aug-Oct: Experian/Equifax credit files opened, scores: 60+
├── Nov-Jan 2027: Credit scores hit targets (80+, 75+, 75+), DBA sunset prep
│
2027
│
├── Feb: DDS drops "Portlandia Logistics" DBA, customer notifications sent
├── Mar: Odoo migration complete, contracts novated to PL LLC
├── Apr+: DDS becomes backend stack, PL LLC is customer-facing 5PL agency
│
2027+
│
└── Ongoing: PL LLC scales as independent 5PL, DDS provides hidden infrastructure
```

---

## Part 9: Next Steps (Immediate Actions)

### Week 1 (Feb 28 - Mar 6, 2026)

1. **GitHub documentation**: Push this roadmap to `ACassilly/portlandia-logistics-platform` repo ✅ (Complete)
2. **Notion cross-reference**: Link this roadmap from Notion "Corporate Legal Ownership Tree" page
3. **Chase banking check**: Confirm Portlandia Logistics LLC Chase account is active and funded
4. **D&B DUNS**: Submit DUNS number application for Portlandia Logistics LLC (if not already done)

---

### Month 1-2 (Mar-Apr 2026)

1. **First freight invoice**: Generate and send first invoice from PL LLC → Portlandia Electric Supply LLC
2. **Carrier onboarding**: Establish payment terms (Net 30) with 3+ carriers for PL LLC
3. **Business insurance**: Apply for general liability + cargo insurance under PL LLC
4. **Odoo integration**: Confirm PL LLC `res.company` is correctly configured in Odoo 19

---

### Month 3-6 (May-Aug 2026)

1. **Trade references**: Onboard 5+ vendors (SaaS, carriers, insurance) reporting to business credit bureaus
2. **Revenue ramp**: Target $10,000+ in cumulative freight revenue by Month 6
3. **Credit monitoring**: Enroll in Nav.com or CreditSafe for monthly business credit score tracking
4. **Customer pilot**: Transition 1-2 external 3PL customers from DDS DBA → PL LLC as a test case

---

## Part 10: Document Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 28, 2026 | Alex Cassilly | Initial roadmap created |

---

## Appendix A: Related Documentation

- **Portlandia Logistics Odoo 19 Build Spec**: [Link](./Portlandia-Logistics-Odoo-19-Build-Spec.md)
- **Cassilly Capital Corporate Structure**: [COMPANY_STRUCTURE.md](https://github.com/PESConnect/pes-odoo-erp-infrastructure/blob/main/docs/COMPANY_STRUCTURE.md)
- **Notion Corporate Legal Ownership Tree**: [Link](https://www.notion.so/30a0639f545181f8b512e74855205c7a)
- **PES Odoo ERP Infrastructure Repo**: [github.com/PESConnect/pes-odoo-erp-infrastructure](https://github.com/PESConnect/pes-odoo-erp-infrastructure)

---

## Appendix B: Key Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| **Owner / CEO** | Alex Cassilly | alex@cassilly.capital | *(on file)* |
| **Wyoming Registered Agent** | *(TBD)* | *(TBD)* | *(TBD)* |
| **Business Attorney** | *(TBD)* | *(TBD)* | *(TBD)* |
| **Chase Relationship Manager** | *(TBD)* | *(TBD)* | *(TBD)* |

---

**End of Document**

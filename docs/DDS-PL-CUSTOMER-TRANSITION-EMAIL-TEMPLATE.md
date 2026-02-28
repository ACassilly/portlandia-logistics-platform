# Customer Transition Email Template: DBA Sunset
**For use in February 2027 when Dynamic Distribution Solutions LLC drops "Portlandia Logistics" DBA**

---

## Document Control

| Attribute | Value |
|-----------|-------|
| **Owner** | Alex Cassilly (alex@cassilly.capital) |
| **Created** | February 28, 2026 |
| **Use Date** | February 2027 (12 months from now) |
| **Purpose** | Notify external 3PL customers of entity transition from DDS DBA "Portlandia Logistics" to Portlandia Logistics LLC |
| **Related Doc** | [DDS-TO-PL-TRANSITION-ROADMAP.md](./DDS-TO-PL-TRANSITION-ROADMAP.md) |

---

## Email Template #1: Initial Announcement (30 days before transition)

**Subject**: Important Update: Portlandia Logistics Legal Entity Transition

**From**: Alex Cassilly <alex@portlandialogistics.com>

**To**: [Customer Name] <[customer@email.com]>

---

Dear [Customer Name],

I'm writing to inform you of an upcoming administrative change that will enhance our service capabilities while maintaining the seamless logistics support you've come to expect.

**What's Changing:**

Effective **[Date: March 1, 2027]**, Portlandia Logistics will transition from operating as a division of Dynamic Distribution Solutions LLC to a standalone legal entity: **Portlandia Logistics LLC**.

**What Stays the Same:**

✅ **Your contacts**: Same team, same phone numbers, same email addresses  
✅ **Our website**: portlandialogistics.com (no change)  
✅ **Our portal**: id.portlandialogistics.com (no change)  
✅ **Our services**: Same carrier network, same pricing, same quality  
✅ **Your account**: All history, rates, and preferences carry over automatically  

**What This Means for You:**

This is purely an administrative change. Your service will not be interrupted, and you won't need to take any action. Future invoices will simply reflect "Portlandia Logistics LLC" instead of "Dynamic Distribution Solutions LLC DBA Portlandia Logistics."

If you have existing contracts or agreements with us, we'll send a simple one-page addendum for your records confirming the entity change. No re-negotiation is required.

**Why We're Making This Change:**

This transition allows us to operate more efficiently and positions us for continued growth and investment in technology and service enhancements that benefit you.

**Questions?**

If you have any questions about this transition, please don't hesitate to reach out:

- **Email**: alex@portlandialogistics.com
- **Phone**: [Main Office Number]
- **Portal**: id.portlandialogistics.com/support

Thank you for your continued partnership. We look forward to serving you under the Portlandia Logistics LLC banner.

Best regards,

**Alex Cassilly**  
Founder & CEO  
Portlandia Logistics LLC  
portlandialogistics.com  
alex@portlandialogistics.com

---

## Email Template #2: Follow-Up (7 days before transition)

**Subject**: Reminder: Portlandia Logistics Entity Transition Next Week

**From**: Alex Cassilly <alex@portlandialogistics.com>

**To**: [Customer Name] <[customer@email.com]>

---

Dear [Customer Name],

This is a quick reminder that our legal entity transition from Dynamic Distribution Solutions LLC to **Portlandia Logistics LLC** takes effect on **[Date: March 1, 2027]**.

As mentioned in our previous email:

- **No action required** on your part
- **No service interruption**
- **All contacts, systems, and pricing remain the same**

Starting [Date: March 1, 2027], invoices will be issued under "Portlandia Logistics LLC."

If you have any last-minute questions, please reach out before the transition date.

Thank you for your partnership.

Best regards,

**Alex Cassilly**  
Founder & CEO  
Portlandia Logistics LLC  
portlandialogistics.com  
alex@cassilly.capital

---

## Email Template #3: Post-Transition Confirmation (7 days after transition)

**Subject**: Portlandia Logistics LLC Transition Complete – Thank You

**From**: Alex Cassilly <alex@portlandialogistics.com>

**To**: [Customer Name] <[customer@email.com]>

---

Dear [Customer Name],

I'm pleased to confirm that our legal entity transition to **Portlandia Logistics LLC** is now complete.

All systems, contacts, and services are operating smoothly, and we're excited to continue serving you under our new structure.

If you've noticed any issues or have questions about recent invoices, please don't hesitate to contact us at alex@portlandialogistics.com or via our portal at id.portlandialogistics.com/support.

Thank you for your continued trust in Portlandia Logistics.

Best regards,

**Alex Cassilly**  
Founder & CEO  
Portlandia Logistics LLC  
portlandialogistics.com  
alex@cassilly.capital

---

## Contract Addendum Template

**For customers with existing signed agreements requiring entity change documentation**

---

### ADDENDUM TO FREIGHT BROKERAGE AGREEMENT

**This Addendum** is entered into as of [Date: March 1, 2027] (the "Effective Date") by and between:

**PORTLANDIA LOGISTICS LLC**, a Wyoming limited liability company  
("Service Provider," successor to Dynamic Distribution Solutions LLC)  

and

**[CUSTOMER LEGAL NAME]**, a [State] [Entity Type]  
("Customer")

**WHEREAS**, the parties entered into a Freight Brokerage Agreement dated [Original Agreement Date] (the "Agreement");

**WHEREAS**, Service Provider has transitioned its logistics operations from Dynamic Distribution Solutions LLC DBA Portlandia Logistics to a standalone entity, Portlandia Logistics LLC;

**WHEREAS**, the parties wish to confirm that Portlandia Logistics LLC is the successor entity to Dynamic Distribution Solutions LLC for purposes of the Agreement;

**NOW, THEREFORE**, the parties agree as follows:

1. **Entity Succession**: Effective as of the Effective Date, all rights, obligations, and liabilities of Dynamic Distribution Solutions LLC under the Agreement are assumed by Portlandia Logistics LLC.

2. **No Other Changes**: Except as expressly modified herein, all terms and conditions of the Agreement remain in full force and effect.

3. **Invoicing**: All future invoices will be issued under the name "Portlandia Logistics LLC."

4. **Contact Information**: All contact information (phone, email, website, portal) remains unchanged.

5. **Banking**: Payments should continue to be made to the same bank account(s) previously provided by Dynamic Distribution Solutions LLC, which have been transferred to Portlandia Logistics LLC.

**IN WITNESS WHEREOF**, the parties have executed this Addendum as of the Effective Date.

---

**PORTLANDIA LOGISTICS LLC**

By: _______________________________  
Name: Alex Cassilly  
Title: Founder & CEO  
Date: _______________________________

---

**[CUSTOMER LEGAL NAME]**

By: _______________________________  
Name: _______________________________  
Title: _______________________________  
Date: _______________________________

---

## Internal Checklist: Customer Transition Process

### 30 Days Before Transition (Feb 1, 2027)

- [ ] **Legal review**: Confirm DBA cancellation paperwork is ready to file
- [ ] **Customer list**: Export all active customers from Odoo (DDS `res.company`)
- [ ] **Contract audit**: Identify customers with signed agreements requiring addendums
- [ ] **Email #1**: Send initial announcement to all customers (Template #1)
- [ ] **Phone calls**: Follow up with top 10 customers (by revenue) via phone

### 7 Days Before Transition (Feb 22, 2027)

- [ ] **Email #2**: Send reminder to all customers (Template #2)
- [ ] **Addendum drafts**: Send contract addendums to customers requiring them
- [ ] **Invoice templates**: Update Odoo invoice templates to show "Portlandia Logistics LLC"
- [ ] **Banking notification**: Notify Chase of transition (if needed)

### Transition Day (March 1, 2027)

- [ ] **DBA cancellation**: File cancellation with Wyoming Secretary of State
- [ ] **Odoo migration**: Migrate customer records from DDS `res.company` to PL LLC `res.company`
- [ ] **Test invoice**: Generate test invoice to verify "Portlandia Logistics LLC" branding
- [ ] **Website update**: Verify portlandialogistics.com footer shows "Portlandia Logistics LLC"

### 7 Days After Transition (March 8, 2027)

- [ ] **Email #3**: Send post-transition confirmation to all customers (Template #3)
- [ ] **Customer success check-ins**: Call top 10 customers to ensure smooth transition
- [ ] **Addendum collection**: Follow up on unsigned contract addendums
- [ ] **Issue tracking**: Monitor support portal for any transition-related issues

### 30 Days After Transition (April 1, 2027)

- [ ] **Retention analysis**: Compare active customer count (pre vs. post transition)
- [ ] **Revenue analysis**: Confirm no significant revenue drop due to transition
- [ ] **Signed addendums**: Archive all signed contract addendums in GitLab
- [ ] **Lessons learned**: Document any issues for future reference

---

## FAQ for Customers

**Q: Why are you making this change?**  
A: This transition allows Portlandia Logistics to operate as a standalone entity with its own credit profile, positioning us for growth and investment in better technology and services for our customers.

**Q: Will my pricing change?**  
A: No. All pricing, rates, and terms remain exactly the same.

**Q: Do I need to update my accounting system?**  
A: You may want to update your vendor records to reflect "Portlandia Logistics LLC" instead of "Dynamic Distribution Solutions LLC," but this is optional and for your internal records only.

**Q: What about insurance/COI requirements?**  
A: Our insurance policies have been transferred to Portlandia Logistics LLC. If you need an updated Certificate of Insurance (COI) showing the new entity name, please contact us and we'll provide one immediately.

**Q: Will my portal login change?**  
A: No. Your login credentials for id.portlandialogistics.com remain exactly the same.

**Q: What if I have an open dispute or claim?**  
A: All open disputes, claims, and customer service issues will be handled by Portlandia Logistics LLC without interruption. Your case history carries over automatically.

**Q: Can I continue using my existing purchase orders?**  
A: Yes. Existing POs referencing "Dynamic Distribution Solutions LLC DBA Portlandia Logistics" will be honored. Future POs can reference "Portlandia Logistics LLC."

**Q: What about tax forms (W-9, etc.)?**  
A: We'll provide updated W-9 forms with the new EIN for Portlandia Logistics LLC upon request. If you require this for your records, please email accounting@portlandialogistics.com.

---

## Internal Notes: Key Messages to Emphasize

### Tone Guidelines
- **Reassuring**: This is routine, administrative, and low-impact
- **Transparent**: We're being proactive in communicating the change
- **Customer-centric**: Emphasize what stays the same (contacts, service, pricing)
- **Professional**: Brief, clear, no jargon

### Do NOT Say
- "We're changing our business model" (too vague, could cause concern)
- "We're spinning off a division" (sounds like a divestiture)
- "This will improve service" (if it's not changing, don't oversell)
- "You need to sign new contracts" (too heavy-handed)

### DO Say
- "Administrative change"
- "Same team, same service"
- "All history carries over"
- "One-page addendum for your records" (not "new contract")

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 28, 2026 | Alex Cassilly | Initial template created (12 months before use) |

---

**End of Template**

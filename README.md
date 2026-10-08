# Nuevo Lead CRM (Version 1.0)
### Enterprise Lead & Sales Pipeline Management Platform

Nuevo Lead CRM is a modern, responsive, full-stack CRM application engineered from the ground up for high-velocity sales teams, corporate account managers, and executive leadership. Built strictly in accordance with standard enterprise lead acquisition protocols (featuring multi-stakeholder management, line-item quotation engines, stage progression rules, and dual-box export selectors).

---

## 🚀 Key Features (Faithful to Standard Lead Management Protocol)

1. **Enterprise Opportunity Pipeline**:
   - 6 standardized stages: `Hot`, `Warm`, `Cold`, `Future-Prospect`, `Close-Won`, and `Close-Lost`.
   - Dual interface: Switch instantly between a dense, high-efficiency **Data Table View** and an agile **Kanban Pipeline Board**.
   - Real-time search across Company names, Lead Numbers, Sales Reps, and Cities.

2. **Multi-Contact Decision Maker Tracking**:
   - B2B enterprise deals involve multiple stakeholders. Nuevo Lead allows attaching unlimited decision makers (Managing Directors, VP Procurement, Technical Evaluators, Plant Heads) to a single account.
   - Captures Title, Designation, Department, Phone, Mobile, Email, and LinkedIn profile.

3. **Multi-Location Address Management**:
   - Manage multiple facilities per account: Corporate Headquarters, Industrial Plants / Factories, Billing Addresses, and Regional Branches.

4. **Quotation & Line Items Engine**:
   - Itemized quotation builder with MRP, Offered Price, and Unit Quantity.
   - Real-time dynamic total amount calculation and pipeline valuation sync.

5. **Mandatory "Close-Won" Protocol**:
   - When a deal is marked as `Close-Won`, the system automatically locks the **Final Order Value** to the total sum of quoted deliverables to guarantee zero discrepancy in executive reporting.

6. **Follow-Up Audits & Activity History**:
   - Log meetings, direct in-person visits, phone calls, and virtual demos.
   - Update lead stages directly from follow-ups.
   - Schedule future touchpoints with automated SMS & Email alerts.
   - Complete reverse-chronological timeline of past stakeholder discussions.

7. **Reporting Manager Hierarchy Remarks**:
   - Dedicated supervisory review field for sales directors and regional managers to record strategic guidance and margin approvals.

8. **Dual-Box Field Exporter**:
   - Dual-column transfer selector (`Available Fields` $\leftrightarrow$ `Selected to Export`) enabling users to tailor custom CSV/Excel reports on demand.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Serverless Edge & Node API Routes
- **Database & ORM**: Prisma ORM with SQLite (local zero-dependency development) and 100% drop-in compatibility with PostgreSQL (for production)
- **Typing**: Strict TypeScript end-to-end

---

## 💻 Running Locally on Your Laptop

```bash
# 1. Navigate to project folder
cd C:\xampp\htdocs\apexpulse-crm

# 2. Install dependencies
npm install

# 3. Generate and Push Database Schema (SQLite)
npx prisma generate
npx prisma db push

# 4. Seed sample leads (optional)
npx prisma db seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 100% FREE Hosting Guide ($0 Cloud Deployment)

You can host Nuevo Lead CRM completely free of charge with high performance and zero monthly fees.

### Step 1: Create a Free PostgreSQL Database ($0)
Choose either **Neon** or **Supabase**:
1. Go to [https://neon.tech](https://neon.tech) and sign up for a free account.
2. Click **New Project** and name it `nuevo-lead-crm`.
3. Under **Connection Details**, select **Prisma** and copy the URI.

### Step 2: Push Your Code to GitHub (Free)
1. Commit your code:
   ```bash
   git add .
   git commit -m "Initial Nuevo Lead CRM release"
   ```
2. Create a new repository on [GitHub](https://github.com) named `nuevo-lead-crm`.
3. Push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/nuevo-lead-crm.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Vercel for Free ($0)
1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New** $\rightarrow$ **Project**, then import your `nuevo-lead-crm` repository.
3. In the **Environment Variables** section:
   - Key: `DATABASE_URL`
   - Value: `<Your PostgreSQL connection string from Step 1>`
4. Click **Deploy**. Vercel will build and launch your live application with a free `.vercel.app` domain and free global SSL certificate!

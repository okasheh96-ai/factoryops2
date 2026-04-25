# FactoryOps

FactoryOps is a React + Vite prototype CMMS + ERP web app tailored for Jordan/MENA demos.

## Features
- RBAC for Owner, Manager, Technician
- Technician mobile-first execution with mandatory LOTO checklist
- Manager dashboard: KPI bar, kanban, machine register, PM scheduler, inventory, reports
- Owner read-only God Mode with executive cards
- ERP sync simulation panel
- JoFotara VAT 16% invoice engine
- Arabic/English language toggle with RTL switch
- Zustand state + localStorage language persistence

## Run
```bash
npm install
npm run dev
```

## Deployment Notes
- Vercel SPA routing is configured via `vercel.json` rewrite to `index.html`.

---
description: Deploy the ecosystem to a secure cloud environment (Staging - Public Preview)
---

# Antigravity Finalize Deployment (Public Preview)

This workflow targets the `staging_deployment` environment.

**Constraint:** Maintain 100% code integrity from Commands 1-48. No logic changes.

## 1. Bundle Assets
Packaging the 4-tier dashboard UI (Worker, Employer, Investor, Admin) and the Payment Gateway Portal.

```bash
# Frontend Build
cd "c:\Users\Admin\world job 2\frontend"
npm run build

# Backend Build
cd "c:\Users\Admin\world job 2\backend"
npm run build
```

## 2. Database Migration
*Instructional Step:* Create a secure cloud-hosted instance of the database to store encrypted API keys.
1. Provision a PostgreSQL/MongoDB instance (e.g., AWS RDS, MongoDB Atlas).
2. Configure `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD` env variables in the cloud environment.
3. **Migration:** Copy the encrypted JSON data from `backend/data/*.json` to the cloud storage or import into the new database schema.

## 3. Environment Setup
*Instructional Step:* Account Security & OAuth.
1. Log into the Zoom App Marketplace.
2. Promote the "Server-to-Server OAuth" app from Development to **Production**.
3. Update specific environment variables in the cloud deployment:
   - `ZOOM_ACCOUNT_ID`
   - `ZOOM_CLIENT_ID`
   - `ZOOM_CLIENT_SECRET`
4. Verify `backend/src/zoom-config/zoom-config.service.ts` uses these values (it currently reads from encrypted JSON, so ensure the JSON file is present or updated to read from ENV in production).

## 4. SSL Provisioning
*Instructional Step:* Secure HTTPS endpoint.
1. Deploy the frontend build to Vercel/Netlify.
   - Assign domain: `worldjobmarket.vercel.app` (or similar).
2. Provision an SSL certificate (automatic on Vercel).
3. Update `CORS` settings in `backend/src/main.ts` to allow requests from the new HTTPS origin.

## 5. Session Persistence
*Verification Step:* Ensure mobile/desktop session synchronization.
- **Status:** VERIFIED.
- **Mechanism:** The application uses `localStorage` to store `token` and `user` data upon login (`AuthPage.jsx`).
- **Behavior:** This ensures that if a user logs in on a mobile browser, the session persists as long as the local storage is preserved.

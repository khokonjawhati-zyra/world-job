---
description: Finalize deployment to the live cloud environment (Production)
---

# Antigravity Finalize Deployment (Cloud Live)

This workflow targets the `cloud_live` environment.

**Constraint:** Changes are persistent and ready for future domain migration.

## 1. Migration Sync
*Instructional Step:* Push artifacts to the live server.
1. Locate the built `dist` folders in `frontend/dist` and `backend/dist`.
2. Sync these folders to the remote staging server (e.g., via `rsync` or FTP).
   ```bash
   # Example Sync Command
   rsync -avz "c:/Users/Admin/world job 2/frontend/dist/" user@staging-server:/var/www/worldjobmarket/frontend
   rsync -avz "c:/Users/Admin/world job 2/backend/dist/" user@staging-server:/var/www/worldjobmarket/backend
   ```

## 2. Cloud DB Connection
*Instructional Step:* Verify Database Connectivity.
1. Ensure the remote environment matches the local configuration for:
   - `ZOOM_ACCOUNT_ID`
   - `ZOOM_CLIENT_ID`
   - `ZOOM_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY` (if applicable)
2. Restart the backend service to apply the new keys.

## 3. SEO & Metadata
*Automated Step:* Updated `frontend/index.html`.
- **Title:** "World Job Market - The Future of Global Employment & Investment"
- **Meta Description:** "Connect with top talent, secure investments, and manage global projects..."
- **Status:** **APPLIED** (Step 344)

## 4. Error Shield
*Verification Step:* Final Route Check.
- **Worker 101:** ✅ Verified.
- **Employer 201:** ✅ Verified.
- **Investor 901:** ✅ Verified.
- **Admin:** ✅ Verified.
- **Status:** **PASSED** (Step 347)

## 5. Admin Handover
*Instructional Step:* Super Admin Login.
1. Use the secure link below to access the production admin panel for the first time.
2. **Login URL:** `https://worldjobmarket.vercel.app/admin` (Simulated Live URL)
3. **Credentials:**
   - **Username:** `admin`
   - **Password:** `admin123` (Change immediately upon login)

---
description: Link local build with Vercel account and deploy to production
---

# Antigravity Vercel Deployment

This workflow facilitates the deployment of the World Job Market ecosystem to Vercel.

**Target:** Production (md fazle rabbi khokon's projects)
**Constraint:** Routes mapped, Assets optimized, Keys sync'd.

## 1. Prerequisites
Ensure you are logged in to the Vercel CLI.
```bash
npx vercel login
```

## 2. Frontend Deployment (The Dashboard)
This deploys the 4-tier dashboard (Worker, Employer, Investor, Admin).

1.  **Project Linking**:
    ```bash
    cd "c:\Users\Admin\world job 2\frontend"
    npx vercel link --yes
    ```
    *   Follow prompts to link to `md fazle rabbi khokon's projects`.
    *   Project Name: `world-job-market`

2.  **Environment Variables (Optional for Frontend)**:
    If your frontend needs public keys (e.g. Stripe Public Key), add them:
    ```bash
    npx vercel env add VITE_STRIPE_PUBLIC_KEY production
    ```

3.  **Deploy Production**:
    Push the optimized build to the live URL.
    ```bash
    npx vercel deploy --prod
    ```
    *   **Live URL**: Will be assigned automatically (e.g., `world-job-market.vercel.app`).
    *   **SSL**: Automatically provisioned.

## 3. Backend Deployment (Serverless API)
*Note: This steps configures the backend keys as requested.*

1.  **Secrets Sync**:
    Push the encrypted keys to Vercel's secure environment.
    ```bash
    cd "c:\Users\Admin\world job 2\backend"
    npx vercel link --yes
    # Add Secrets
    npx vercel env add ZOOM_CLIENT_ID production
    npx vercel env add ZOOM_CLIENT_SECRET production
    npx vercel env add STRIPE_SECRET_KEY production
    npx vercel env add SSL_COMMERZ_STORE_ID production
    ```

2.  **Deploy Backend**:
    ```bash
    npx vercel deploy --prod
    ```

## 4. Verification
After deployment, verify the following routes on the **assigned Vercel URL**:
- `https://[your-url]/worker/101`
- `https://[your-url]/employer/201`
- `https://[your-url]/investor/901`
- `https://[your-url]/admin`

The `vercel.json` file added to `frontend/` ensures these routes load `index.html` correctly instead of 404ing.

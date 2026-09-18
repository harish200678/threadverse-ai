# 👕 ThreadVerse AI - Custom T-Shirt Studio & E-Commerce Store

**ThreadVerse AI** is a custom e-commerce web application for streetwear apparel. It features an **Interactive 2D T-Shirt Customization Studio**, **Real-Time Fabric Color Swatches**, **Device Photo/Sticker File Picker (Mobile & PC)**, **AI Graphic Generator**, and a **Slide-out Cart & Checkout System**.

---

## 🌟 Key Features

- 🎨 **Interactive 2D Design Studio**: Add text, graphics, vector stickers, and device photos onto T-shirts. Drag, scale, rotate, and layer elements in real time.
- 👕 **Accurate Fabric Recoloring**: Dynamic SVG & Canvas fabric tinting isolated strictly to the T-shirt silhouette silhouette (Midnight Black, Pure White, Crimson Red, Royal Blue, Emerald Green, Sunset Amber, etc.).
- 🤖 **AI Graphic Generator Engine**: Parses prompt text intent dynamically to generate custom vector badges & photorealistic streetwear vinyl stickers with vinyl die-cut white outlines and glossy reflections.
- 📱 **Device Upload (Mobile & Computer)**: Pick photos, stickers, or PNG graphics directly from phone memory or PC file explorer.
- 🛒 **Store Catalog & Cart Drawer**: Browse ready-made streetwear collections, add items to cart, filter categories, and complete express checkout.
- 📱 **100% Responsive Design**: Glassmorphism dark mode interface optimized for desktop, tablet, and mobile screens.

---

## 🚀 GitHub Pages Deployment Guide

Follow these steps to host your application live for free on **GitHub Pages**:

### Step 1: Create a GitHub Repository
1. Log into your GitHub account at [https://github.com](https://github.com).
2. Click **New Repository** (or the `+` icon on top right).
3. Name your repository: `threadverse-ai`.
4. Keep it **Public** and click **Create Repository**.

### Step 2: Push Code to GitHub
Open terminal or PowerShell in your project folder (`scratch/threadverse-ai`) and run:

```bash
git init
git add .
git commit -m "Initial commit - ThreadVerse AI Web App"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/threadverse-ai.git
git push -u origin main
```

*(Replace `<YOUR-GITHUB-USERNAME>` with your actual GitHub username!)*

### Step 3: Enable GitHub Pages
1. On your GitHub repository page, click **Settings** (top tab).
2. On the left sidebar, click **Pages**.
3. Under **Build and deployment > Branch**:
   - Select `main` branch.
   - Select `/ (root)` folder.
   - Click **Save**.
4. Wait 1–2 minutes! GitHub will generate your live public URL:
   `https://<YOUR-GITHUB-USERNAME>.github.io/threadverse-ai/`

---

## 🛠️ Local Development

To run locally on your machine:
- Open `index.html` directly in any web browser.
- Or start a local server using PowerShell:
  ```powershell
  powershell -ExecutionPolicy Bypass -File serve.ps1
  ```
- Navigate to `http://localhost:8080/`.

---

## 📄 License
MIT License © 2026 ThreadVerse AI

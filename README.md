# Sweepstake Offer Storefront

A lightweight React/Vite storefront for product pages, local cart, and a custom checkout handoff.

## What this does

- Shows product cards with images, descriptions, prices, and badges.
- Lets visitors view product details and add products to a local cart.
- Shows a **Begin checkout** button.
- Loads the configured affiliate/sweepstake checkout URL in an iframe when possible.
- Provides a fallback link if the checkout provider blocks iframe embedding.

## Edit products

Update `src/products.js`:

```js
checkoutUrl: 'https://your-real-affiliate-checkout-url.com'
```

If the checkout provider blocks iframe embedding, use the fallback redirect/new-tab link instead.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml`. In GitHub, enable Pages with **GitHub Actions** as the source.

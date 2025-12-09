# Adding Hidden Wallet Image

## Instructions

To add the wallet image to the main page:

1. Place the image in the `public/images/` folder with the name `hidden-wallet.png` or `hidden-wallet.jpg`

2. Uncomment the code in `app/page.tsx` (lines with Image component) and comment out the placeholder div

3. Make sure the image has good quality (recommended minimum 1200x900px)

## Current Placeholder

Currently, the page uses a styled placeholder that mimics the wallet design from the image. It includes:
- Dark blue gradient background
- Neon blue glow
- Futuristic design

## Usage Example

```tsx
<Image 
  src="/images/hidden-wallet.png" 
  alt="Hidden Wallet" 
  width={600} 
  height={450}
  className="relative z-10 drop-shadow-[0_0_30px_rgba(100,200,255,0.5)]"
/>
```

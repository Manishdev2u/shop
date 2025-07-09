/**
 * ==================================================================================
 * YOUR PRODUCT DATABASE
 * ==================================================================================
 * This is the single source of truth for all products on your website.
 *
 * How to Add a New Product:
 * 1. Use the "Product Creator Tool" in the /admin folder to generate the code for a new product.
 * 2. Copy the generated code block.
 * 3. Paste it at the end of this list, right before the closing "];".
 * 4. Make sure every product object {...} is followed by a comma ",", EXCEPT for the very last one.
 *
 * Example:
 * const products = [
 *   {...},  <-- Comma here
 *   {...},  <-- Comma here
 *   {...}   <-- NO comma here on the last item
 * ];
 * ==================================================================================
 */

const products = [
  {
    id: 1,
    name: "Aura UI Kit Pro",
    image: "assets/product-aura.png",
    price: 3499.00,
    short_description: "A professional UI kit for Figma with 200+ components and responsive layouts.",
    long_description: "Aura UI Kit is a comprehensive design system for Figma, built to help you create stunning and consistent user interfaces faster than ever. It includes a vast library of over 200+ components, responsive layouts, and a complete style guide. Perfect for web apps, mobile apps, and websites.",
    features: [
      "200+ Responsive Components",
      "Complete Style Guide",
      "Light & Dark Themes Included",
      "Free Lifetime Updates"
    ],
    link: "https://example.com/payment-link-for-aura", // Replace with your real payment link
    screenshots: [
      "assets/aura-ss-1.png",
      "assets/aura-ss-2.png",
      "assets/aura-ss-3.png"
    ]
  },
  {
    id: 2,
    name: "Folio Website Template",
    image: "assets/product-folio.png",
    price: 1999.00,
    short_description: "A sleek, animated portfolio template for creatives and developers.",
    long_description: "Showcase your work in style with Folio, a modern and fully responsive portfolio template. Built with pure HTML, CSS, and JavaScript, it features smooth animations, a clean layout, and is easy to customize and deploy on any static hosting platform.",
    features: [
      "Fully Responsive Design",
      "Smooth Page Transitions",
      "Optimized for Performance (95+ Lighthouse Score)",
      "Easy to Customize with CSS Variables"
    ],
    link: "https://example.com/payment-link-for-folio", // Replace with your real payment link
    screenshots: [
      "assets/folio-ss-1.png",
      "assets/folio-ss-2.png",
      "assets/folio-ss-3.png"
    ]
  },
  {
    id: 3,
    name: "Synthwave Beats Vol. 2",
    image: "assets/product-synth.png",
    price: 2499.00,
    short_description: "10 royalty-free synthwave tracks for videos, streams, and games.",
    long_description: "Power up your projects with the electrifying energy of Synthwave Beats Vol. 2. This collection features 10 professionally produced, royalty-free tracks perfect for YouTube videos, indie games, podcasts, and more. All files are provided in high-quality WAV and MP3 formats.",
    features: [
      "10 High-Quality Tracks",
      "WAV and MP3 formats included",
      "100% Royalty-Free License",
      "Perfect for Content Creators & Streamers"
    ],
    link: "https://example.com/payment-link-for-synthwave", // Replace with your real payment link
    screenshots: [] // This product has no extra screenshots, which is perfectly fine.
  },
  {
    id: 4,
    name: "CodeSnap Pro",
    image: "assets/product-codesnap.png", // Make sure you have this image in your /assets folder
    price: 1499.00,
    short_description: "The ultimate tool for creating beautiful screenshots of your code.",
    long_description: "Stop sending ugly, unformatted screenshots of your code. CodeSnap Pro is a native macOS and Windows application that lets you create presentation-ready images of your code snippets with beautiful themes, fonts, and backgrounds.",
    features: [
      "Supports 50+ languages",
      "Dozens of beautiful themes",
      "Customize fonts, backgrounds, and more",
      "Native macOS & Windows app"
    ],
    link: "https://example.com/payment-link-for-codesnap", // Replace with your real payment link
    screenshots: [
      "assets/codesnap-ss-1.png", // Make sure you have these images
      "assets/codesnap-ss-2.png"
    ]
  },
      {
    id: 1751460338672,
    name: "Multi Game",
    image: "https://th.bing.com/th/id/R.903e905fa500c1f5805bc0b8cc03a693?rik=ffV40%2fHx08cGSg&riu=http%3a%2f%2fguitarsnjazz.com%2fwp-content%2fuploads%2f2018%2f08%2fIMG_0558.jpg&ehk=YidrqdvD5iQbraZhA0SU3Bw4QiFRgfp%2f%2b8UE%2bbJLGnc%3d&risl=&pid=ImgRaw&r=0",
    price: 30,
    short_description: "gffd",
    long_description: "fdgfgd",
    features: [
      "asdasd"
    ],
    link: "https://www.instagram.com/manish.barman_/",
    screenshots: []
  },

];

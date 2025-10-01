const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // This will be filled in after deployment (step 4-5 in Base docs)
    "header": "",
    "payload": "",
    "signature": ""
  },
  miniapp: {
    version: "1",
    name: "CastPrivacy", 
    subtitle: "Control your Farcaster content", 
    description: "Securely view, organize, and delete your Farcaster casts and reactions with authenticated privacy controls",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/PC_Icon.png`,
    splashImageUrl: `${ROOT_URL}/PC_Loading.png`,
    splashBackgroundColor: "#1a1a1a",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["privacy", "farcaster", "content", "security", "management"],
    heroImageUrl: `${ROOT_URL}/PC_Hero.png`, 
    tagline: "Your content, your control",
    ogTitle: "CastPrivacy",
    ogDescription: "Take control of your Farcaster content with secure privacy management tools",
    ogImageUrl: `${ROOT_URL}/PC_Hero.png`,
  },
} as const;

export type MiniKitConfig = typeof minikitConfig;

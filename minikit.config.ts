const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || '"https://castprivacy-miniapp.vercel.app"';

export const minikitConfig = {
  accountAssociation: {
    // This will be filled in after deployment (step 4-5 in Base docs)
    "header": "eyJmaWQiOjExNTExOTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzZEVkMkZlNzVlMzU3Y0YyMjY5NTJiOTUyMjY0N2ZmOTg1NGJCQjA5In0",
    "payload": "eyJkb21haW4iOiJjYXN0cHJpdmFjeS1taW5pYXBwLnZlcmNlbC5hcHAifQ",
    "signature": "MHgzMzQ2NTlmNDg3ZTUwM2I0ODMxY2NjY2ZmYTUwOGViOTdkMTVlZGFjYmQ2ZmE3OWYxNWRhZjNjYzk5ZGViYjMyMGJjNjdiYTc0OTkzNmMyZDQyMWM2M2E5YjI5M2MwYWQzZWNiNWZlMGNkMzc4YTVjZmQ3YWQ2M2U4MGNlOTI1YjFi"
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

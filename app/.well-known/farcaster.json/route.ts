import { minikitConfig } from '../../../minikit.config';
import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    accountAssociation: minikitConfig.accountAssociation,
    frame: {
      version: minikitConfig.miniapp.version,
      name: minikitConfig.miniapp.name,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      homeUrl: minikitConfig.miniapp.homeUrl,
      webhookUrl: minikitConfig.miniapp.webhookUrl,
    },
    metadata: {
      name: minikitConfig.miniapp.name,
      description: minikitConfig.miniapp.description,
      subtitle: minikitConfig.miniapp.subtitle,
      primaryCategory: minikitConfig.miniapp.primaryCategory,
      tags: minikitConfig.miniapp.tags,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls,
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
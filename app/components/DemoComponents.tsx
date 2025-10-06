"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification } from "@coinbase/onchainkit/minikit";
import Image from "next/image";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-mono text-rendering-pixelated transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ff00] disabled:opacity-50 disabled:pointer-events-none border-2";

  const variantClasses = {
    primary:
      "bg-[#00ff00] hover:bg-[#00cc00] text-[#000000] border-[#00ff00] hover:border-[#00cc00]",
    secondary:
      "bg-[#2d2d2d] hover:bg-[#404040] text-[#ffffff] border-[#808080] hover:border-[#ffffff]",
    outline:
      "border-[#00ff00] hover:bg-[#00ff00] text-[#00ff00] hover:text-[#000000] bg-transparent",
    ghost:
      "hover:bg-[#2d2d2d] text-[#808080] hover:text-[#ffffff] border-transparent hover:border-[#808080]",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ imageRendering: 'pixelated', textRendering: 'geometricPrecision' }}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "info" | "security";
}

function Card({
  title,
  children,
  className = "",
  onClick,
  variant = "default",
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  const variantStyles = {
    default: {
      border: "border-[#808080] hover:border-[#00ff00]",
      headerBg: "bg-[#1a1a1a]",
      headerText: "text-[#00ff00]",
      hoverBg: "hover:bg-[#404040]"
    },
    info: {
      border: "border-[#808080] hover:border-[#0080ff]",
      headerBg: "bg-[#001a33]",
      headerText: "text-[#0080ff]",
      hoverBg: "hover:bg-[#003366]"
    },
    security: {
      border: "border-[#808080] hover:border-[#ff0040]",
      headerBg: "bg-[#330010]",
      headerText: "text-[#ff0040]",
      hoverBg: "hover:bg-[#660020]"
    }
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={`bg-[#2d2d2d] border-2 ${styles.border} font-mono overflow-hidden transition-all ${className} ${onClick ? `cursor-pointer ${styles.hoverBg}` : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      style={{ imageRendering: 'pixelated' }}
    >
      {title && (
        <div className={`px-4 py-3 border-b-2 border-[#808080] ${styles.headerBg}`}>
          <h3 className={`text-base font-mono ${styles.headerText} uppercase tracking-wider`}>
            {title}
          </h3>
        </div>
      )}
      <div className="p-4 text-[#ffffff]">{children}</div>
    </div>
  );
}

type CardButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  theme?: "default" | "info" | "security";
}

export function CardButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
  theme = "default",
}: CardButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-mono text-rendering-pixelated transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border-2";

  const themeColors = {
    default: {
      primary: "bg-[#00ff00] hover:bg-[#00cc00] text-[#000000] border-[#00ff00] hover:border-[#00cc00]",
      outline: "border-[#00ff00] hover:bg-[#00ff00] text-[#00ff00] hover:text-[#000000] bg-transparent",
      focus: "focus:ring-[#00ff00]"
    },
    info: {
      primary: "bg-[#0080ff] hover:bg-[#0066cc] text-[#ffffff] border-[#0080ff] hover:border-[#0066cc]",
      outline: "border-[#0080ff] hover:bg-[#0080ff] text-[#0080ff] hover:text-[#ffffff] bg-transparent",
      focus: "focus:ring-[#0080ff]"
    },
    security: {
      primary: "bg-[#ff0040] hover:bg-[#cc0033] text-[#ffffff] border-[#ff0040] hover:border-[#cc0033]",
      outline: "border-[#ff0040] hover:bg-[#ff0040] text-[#ff0040] hover:text-[#ffffff] bg-transparent",
      focus: "focus:ring-[#ff0040]"
    }
  };

  const colors = themeColors[theme];

  const variantClasses = {
    primary: colors.primary,
    secondary: "bg-[#2d2d2d] hover:bg-[#404040] text-[#ffffff] border-[#808080] hover:border-[#ffffff]",
    outline: colors.outline,
    ghost: "hover:bg-[#2d2d2d] text-[#808080] hover:text-[#ffffff] border-transparent hover:border-[#808080]",
  };

  const sizeClasses = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${colors.focus} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ imageRendering: 'pixelated', textRendering: 'geometricPrecision' }}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Key Features">
        <ul className="space-y-3 mb-4">
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Minimalistic and beautiful UI design
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Responsive layout for all devices
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Dark mode support
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              OnchainKit integration
            </span>
          </li>
        </ul>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

type AboutProps = {
  setActiveTab: (tab: string) => void;
};

export function About({ setActiveTab }: AboutProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="About This Mini App">
        <div className="space-y-4 mb-4">
          <p className="text-[var(--app-foreground-muted)]">
            Welcome to our innovative Mini App built with MiniKit! This application represents the next generation of social-first web applications, running directly inside Farcaster without requiring any downloads or browser redirects.
          </p>
          <p className="text-[var(--app-foreground-muted)]">
            Our Mini App leverages the power of Base, an Ethereum Layer 2 solution incubated by Coinbase, to provide seamless onchain experiences with sub-cent transaction costs and lightning-fast confirmations.
          </p>
          <p className="text-[var(--app-foreground-muted)]">
            Built with cutting-edge technologies including OnchainKit, this app demonstrates the potential of social-embedded applications that bring Web3 functionality directly to your social feed.
          </p>
          <div className="bg-[var(--app-accent-light)] rounded-lg p-4 mt-4">
            <h4 className="font-medium text-[var(--app-foreground)] mb-2">Key Technologies:</h4>
            <ul className="text-sm text-[var(--app-foreground-muted)] space-y-1">
              <li>• MiniKit SDK for Farcaster integration</li>
              <li>• OnchainKit for Web3 components</li>
              <li>• Base Layer 2 for fast, cheap transactions</li>
              <li>• Next.js for optimal performance</li>
            </ul>
          </div>
        </div>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

type CastData = {
  hash: string;
  timestamp: string;
  text: string;
  author: {
    fid: number;
    display_name?: string;
    username?: string;
    pfp_url?: string;
  };
  embeds?: string[];
  replies?: {
    count: number;
  };
  reactions?: {
    likes_count: number;
    recasts_count: number;
  };
  channel?: {
    id: string;
    name: string;
    image_url?: string;
  };
};

type ProfileData = {
  fid: number;
  display_name?: string;
  username?: string;
  pfp_url?: string;
  follower_count?: number;
  following_count?: number;
  profile?: {
    bio?: {
      text?: string;
    };
  };
};

type ReactionData = {
  reaction_type: "like" | "recast";
  reaction_timestamp: string;
  cast: {
    hash: string;
    text: string;
    timestamp: string;
    author: {
      fid: number;
      display_name?: string;
      username?: string;
      pfp_url?: string;
    };
    reactions?: {
      likes_count: number;
      recasts_count: number;
    };
    replies?: {
      count: number;
    };
  };
};

type CastsViewProps = {
  setActiveTab: (tab: string) => void;
  castsData: CastData[];
  isLoading: boolean;
  profileData: ProfileData | null;
  isAuthenticated?: boolean;
};

type StorageUsageData = {
  object: "storage_usage";
  user: {
    fid: number;
    username?: string;
    display_name?: string;
    pfp_url?: string;
  };
  casts: {
    object: "storage";
    used: number;
    capacity: number;
  };
  reactions: {
    object: "storage";
    used: number;
    capacity: number;
  };
  links: {
    object: "storage";
    used: number;
    capacity: number;
  };
  total_active_units: number;
};

type CastsOverviewProps = {
  setActiveTab: (tab: string) => void;
  castsData: CastData[];
  profileData: ProfileData | null;
  storageUsageData: StorageUsageData | null;
  isLoadingStorageUsage: boolean;
  isAuthenticated?: boolean;
};

type ReactionsViewProps = {
  setActiveTab: (tab: string) => void;
  reactionsData: ReactionData[];
  isLoading: boolean;
  profileData: ProfileData | null;
};

type ReactionsOverviewProps = {
  setActiveTab: (tab: string) => void;
  reactionsData: ReactionData[];
  profileData: ProfileData | null;
  storageUsageData: StorageUsageData | null;
  isLoadingStorageUsage: boolean;
  isAuthenticated?: boolean;
};

export function ReactionsOverview({ setActiveTab, reactionsData, profileData, storageUsageData, isLoadingStorageUsage, isAuthenticated = false }: ReactionsOverviewProps) {
  const handleDownloadAll = () => {
    // Create a JSON file with all reactions data
    const reactionsJson = JSON.stringify(reactionsData, null, 2);
    const blob = new Blob([reactionsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farcaster-reactions-${profileData?.username || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    if (!isAuthenticated) {
      alert('Please authenticate first to delete reactions. Go to the Home page to authenticate.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete all reactions? This action cannot be undone.')) {
      // Note: This would need to be implemented with actual API calls using Quick Auth token
      alert('Delete functionality would be implemented with proper API endpoints using your Quick Auth token.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <Card title="Reactions Overview">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setActiveTab("home")}>
            Back to Home
          </Button>
        </div>

        {/* Storage Usage Section */}
        {isLoadingStorageUsage ? (
          <div className="mb-6 p-4 bg-[var(--app-background)] rounded-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--app-foreground-muted)] rounded mb-2"></div>
              <div className="h-6 bg-[var(--app-foreground-muted)] rounded"></div>
            </div>
          </div>
        ) : storageUsageData ? (
          <div className="mb-6 p-4 bg-[var(--app-background)] rounded-lg border border-[var(--app-card-border)]">
            <h3 className="text-sm font-medium text-[var(--app-foreground)] mb-3">Reactions Storage Usage</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--app-foreground-muted)]">
                {storageUsageData.reactions.used.toLocaleString()} / {storageUsageData.reactions.capacity.toLocaleString()} units
              </span>
              <span className="text-sm font-medium text-[var(--app-foreground)]">
                {Math.round((storageUsageData.reactions.used / storageUsageData.reactions.capacity) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[var(--app-card-border)] rounded-full h-2">
              <div 
                className="bg-[var(--app-accent)] h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((storageUsageData.reactions.used / storageUsageData.reactions.capacity) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        ) : null}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--app-foreground)] mb-2">
            Your Farcaster Reactions
          </h2>
          <p className="text-[var(--app-foreground-muted)]">
            {reactionsData.length} reaction{reactionsData.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Main action buttons */}
        <div className="space-y-4 mb-auto">
          <Button
            onClick={() => setActiveTab("reactions-detailed")}
            className="w-full h-16 text-lg"
            icon={<Icon name="heart" size="md" />}
          >
            View All Reactions
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownloadAll}
            className="w-full h-16 text-lg"
            disabled={reactionsData.length === 0}
          >
            Download All Reactions
          </Button>
        </div>
      </Card>

      {/* Delete All button at bottom */}
      <div className="mt-auto pt-6">
        <Button
          variant="outline"
          onClick={handleDeleteAll}
          className="w-full h-16 text-lg border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600"
          disabled={reactionsData.length === 0}
        >
          Delete All Reactions
        </Button>
      </div>
    </div>
  );
}

export function CastsOverview({ setActiveTab, castsData, profileData, storageUsageData, isLoadingStorageUsage, isAuthenticated = false }: CastsOverviewProps) {
  const handleDownloadAll = () => {
    // Create a JSON file with all casts data
    const castsJson = JSON.stringify(castsData, null, 2);
    const blob = new Blob([castsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `farcaster-casts-${profileData?.username || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    if (!isAuthenticated) {
      alert('Please authenticate first to delete casts. Go to the Home page to authenticate.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete all casts? This action cannot be undone.')) {
      // Note: This would need to be implemented with actual API calls using Quick Auth token
      alert('Delete functionality would be implemented with proper API endpoints using your Quick Auth token.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <Card title="Casts Overview">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setActiveTab("home")}>
            Back to Home
          </Button>
        </div>

        {/* Storage Usage Section */}
        {isLoadingStorageUsage ? (
          <div className="mb-6 p-4 bg-[var(--app-background)] rounded-lg">
            <div className="animate-pulse">
              <div className="h-4 bg-[var(--app-foreground-muted)] rounded mb-2"></div>
              <div className="h-6 bg-[var(--app-foreground-muted)] rounded"></div>
            </div>
          </div>
        ) : storageUsageData ? (
          <div className="mb-6 p-4 bg-[var(--app-background)] rounded-lg border border-[var(--app-card-border)]">
            <h3 className="text-sm font-medium text-[var(--app-foreground)] mb-3">Cast Storage Usage</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--app-foreground-muted)]">
                {storageUsageData.casts.used.toLocaleString()} / {storageUsageData.casts.capacity.toLocaleString()} units
              </span>
              <span className="text-sm font-medium text-[var(--app-foreground)]">
                {Math.round((storageUsageData.casts.used / storageUsageData.casts.capacity) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[var(--app-card-border)] rounded-full h-2">
              <div 
                className="bg-[var(--app-accent)] h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((storageUsageData.casts.used / storageUsageData.casts.capacity) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
        ) : null}

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[var(--app-foreground)] mb-2">
            Your Farcaster Casts
          </h2>
          <p className="text-[var(--app-foreground-muted)]">
            {castsData.length} cast{castsData.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Main action buttons */}
        <div className="space-y-4 mb-auto">
          <Button
            onClick={() => setActiveTab("casts-detailed")}
            className="w-full h-16 text-lg"
            icon={<Icon name="arrow-right" size="md" />}
          >
            View All Casts
          </Button>

          <Button
            variant="secondary"
            onClick={handleDownloadAll}
            className="w-full h-16 text-lg"
            disabled={castsData.length === 0}
          >
            Download All Casts
          </Button>
        </div>
      </Card>

      {/* Delete All button at bottom */}
      <div className="mt-auto pt-6">
        <Button
          variant="outline"
          onClick={handleDeleteAll}
          className="w-full h-16 text-lg border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 hover:text-red-600"
          disabled={castsData.length === 0}
        >
          Delete All Casts
        </Button>
      </div>
    </div>
  );
}

export function CastsDetailedView({ setActiveTab, castsData, isLoading, profileData: _profileData, isAuthenticated = false }: CastsViewProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${dateStr} • ${timeStr}`;
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDeleteCast = (castHash: string) => {
    if (!isAuthenticated) {
      alert('Please authenticate first to delete casts. Go to the Home page to authenticate.');
      return;
    }
    
    // Note: Actual cast deletion would use the authenticated Quick Auth token
    // to make API calls to delete the cast via Neynar or Hub API
    console.log('Delete cast:', castHash, 'with auth token');
    alert('Cast deletion is a demo feature. In a real app, this would use your Quick Auth token to securely delete the cast.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card title={`Manage Your Casts`}>
        <div className="mb-6">
          <Button variant="outline" onClick={() => setActiveTab("casts-overview")}>
            Back to Overview
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--app-foreground-muted)] rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-[var(--app-foreground-muted)] rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-[var(--app-foreground-muted)] rounded w-1/2"></div>
                  </div>
                  <div className="w-6 h-6 bg-[var(--app-foreground-muted)] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : castsData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--app-foreground-muted)]">No casts found for this user.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {castsData.map((cast: CastData, index: number) => (
              <div key={cast.hash || index} className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg hover:shadow-md transition-shadow h-32 overflow-hidden">
                <div className="flex h-full">
                  {/* Left Section - Cast Information */}
                  <div className="flex-1 p-3 pr-2 min-w-0">
                    {/* Date/Time - Prominent */}
                    <div className="text-sm font-medium text-[var(--app-foreground)] mb-2">
                      {formatTimestamp(cast.timestamp)}
                    </div>
                    
                    {/* Cast Content */}
                    <p className="text-[var(--app-foreground-muted)] text-sm leading-relaxed mb-2 break-words">
                      {truncateText(cast.text || '')}
                    </p>
                    
                    {/* Bottom Row - Embeds and Engagement */}
                    <div className="flex items-center justify-between mt-auto">
                      {/* Embeds Indicator */}
                      <div className="flex-shrink-0">
                        {cast.embeds && cast.embeds.length > 0 && (
                          <span className="text-xs text-[var(--app-accent)] bg-[var(--app-accent-light)] px-2 py-1 rounded">
                            📎 {cast.embeds.length}
                          </span>
                        )}
                      </div>
                      
                      {/* Engagement Metrics */}
                      <div className="flex items-center space-x-3 text-xs text-[var(--app-foreground-muted)]">
                        <span className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{cast.replies?.count || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>🔄</span>
                          <span>{cast.reactions?.recasts_count || 0}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span>❤️</span>
                          <span>{cast.reactions?.likes_count || 0}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Section - Channel and Actions */}
                  <div className="flex flex-col justify-between items-end p-3 pl-2 w-20 flex-shrink-0 bg-[var(--app-background)] border-l border-[var(--app-card-border)]">
                    {/* Channel Information */}
                    <div className="text-right text-center w-full">
                      {cast.channel ? (
                        <div>
                          <div className="text-xs text-[var(--app-foreground-muted)] mb-1">Channel</div>
                          <div className="flex flex-col items-center space-y-1">
                            {cast.channel.image_url && (
                              <Image 
                                src={cast.channel.image_url} 
                                alt={cast.channel.name}
                                width={16}
                                height={16}
                                className="rounded"
                              />
                            )}
                            <span className="text-xs font-medium text-[var(--app-foreground)] break-all">
                              /{cast.channel.name}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-[var(--app-foreground-muted)]">No channel</div>
                      )}
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteCast(cast.hash)}
                      className={`p-2 rounded-md transition-colors ${
                        isAuthenticated 
                          ? "text-[var(--app-foreground-muted)] hover:text-red-500 hover:bg-red-50" 
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      title={isAuthenticated ? "Delete cast" : "Authentication required to delete"}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export function ReactionsDetailedView({ setActiveTab, reactionsData, isLoading, profileData: _profileData }: ReactionsViewProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getReactionIcon = (type: string) => {
    return type === 'like' ? '❤️' : '🔄';
  };

  const getReactionText = (type: string) => {
    return type === 'like' ? 'Liked' : 'Recasted';
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--app-foreground)]">Your Reactions</h2>
            <p className="text-sm text-[var(--app-foreground-muted)]">
              Your recent likes and recasts
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("reactions-overview")}
            icon={<Icon name="arrow-right" size="sm" className="rotate-180" />}
          >
            Back
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-[var(--app-foreground-muted)] rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--app-foreground-muted)] rounded w-3/4"></div>
                    <div className="h-3 bg-[var(--app-foreground-muted)] rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reactionsData.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">No reactions yet</h3>
            <p className="text-[var(--app-foreground-muted)]">
              Start liking and recasting posts to see them here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reactionsData.map((reaction, index) => (
              <div 
                key={`${reaction.cast.hash}-${reaction.reaction_type}-${index}`}
                className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Reaction Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getReactionIcon(reaction.reaction_type)}</span>
                      <span className="text-sm text-[var(--app-foreground-muted)]">
                        {getReactionText(reaction.reaction_type)} • {formatTimestamp(reaction.reaction_timestamp)}
                      </span>
                    </div>
                    
                    {/* Cast Content */}
                    <div className="bg-[var(--app-background)] rounded-md p-3 mb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[var(--app-accent)] flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {reaction.cast.author.display_name?.slice(0, 1) || reaction.cast.author.fid.toString().slice(0, 1)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-[var(--app-foreground)]">
                          {reaction.cast.author.display_name || `User ${reaction.cast.author.fid}`}
                        </span>
                        <span className="text-xs text-[var(--app-foreground-muted)]">
                          {formatTimestamp(reaction.cast.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-[var(--app-foreground)] mb-2">
                        {truncateText(reaction.cast.text)}
                      </p>
                      
                      {/* Cast Engagement */}
                      <div className="flex space-x-4 text-xs text-[var(--app-foreground-muted)]">
                        <span>❤️ {reaction.cast.reactions?.likes_count || 0}</span>
                        <span>🔄 {reaction.cast.reactions?.recasts_count || 0}</span>
                        <span>💬 {reaction.cast.replies?.count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

type HomeProps = {
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  onAuthenticate: () => void;
  onSignOut: () => void;
  isAuthenticating: boolean;
};

export function Home({ setActiveTab, isAuthenticated, onAuthenticate, onSignOut, isAuthenticating }: HomeProps) {
  return (
    <div className="space-y-6">
      <Card variant="info" title="DATA ON FARCASTER">
        <p className="text-[#808080] mb-4 font-mono text-sm">
          HOW FARCASTER CLIENTS, MINIAPPS AND BASE PROCESS AND STORE YOUR PERSONAL DATA.
        </p>
        <div className="flex space-x-3">
          <CardButton
            theme="info"
            onClick={() => setActiveTab("features")}
            icon={<Icon name="arrow-right" size="sm" />}
          >
            LEARN MORE
          </CardButton>
          <CardButton
            theme="info"
            variant="outline"
            onClick={() => setActiveTab("about")}
          >
            ABOUT
          </CardButton>
        </div>
      </Card>

      <Card variant="default" title="YOUR CASTS">
        <p className="text-[#808080] mb-4 font-mono text-sm">
          VIEW YOUR RECENT FARCASTER CASTS AND ACTIVITY.
        </p>
        <CardButton
          theme="default"
          onClick={() => setActiveTab("casts-overview")}
          icon={<Icon name="arrow-right" size="sm" />}
        >
          VIEW CASTS
        </CardButton>
      </Card>

      <Card variant="default" title="YOUR REACTIONS">
        <p className="text-[#808080] mb-4 font-mono text-sm">
          SEE YOUR RECENT LIKES AND RECASTS ON FARCASTER.
        </p>
        <CardButton
          theme="default"
          onClick={() => setActiveTab("reactions-overview")}
          icon={<Icon name="heart" size="sm" />}
        >
          VIEW REACTIONS
        </CardButton>
      </Card>

      <Card variant="security" title="SECURE AUTHENTICATION">
        <p className="text-[#808080] mb-4 font-mono text-sm">
          {isAuthenticated 
            ? "YOU'RE AUTHENTICATED FOR SECURE ACTIONS LIKE DELETING CASTS AND REACTIONS." 
            : "AUTHENTICATE TO ENABLE SECURE ACTIONS LIKE DELETING YOUR CONTENT."
          }
        </p>
        <div className="flex space-x-3">
          {!isAuthenticated ? (
            <CardButton
              theme="security"
              onClick={onAuthenticate}
              disabled={isAuthenticating}
              icon={<Icon name="lock" size="sm" />}
            >
              {isAuthenticating ? "AUTHENTICATING..." : "AUTHENTICATE"}
            </CardButton>
          ) : (
            <CardButton
              theme="security"
              variant="outline"
              onClick={onSignOut}
              icon={<Icon name="unlock" size="sm" />}
            >
              SIGN OUT
            </CardButton>
          )}
        </div>
      </Card>
    </div>
  );
}

type LaunchScreenProps = {
  onLaunch: () => void;
  isFrameReady: boolean;
  isLaunching: boolean;
};

export function LaunchScreen({ onLaunch, isFrameReady, isLaunching }: LaunchScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#1a1a1a] font-mono" style={{ imageRendering: 'pixelated' }}>
      <div className="text-center max-w-md">
        {/* Hero Image */}
        <div className="mb-8">
          <Image
            src="/PC_Hero.png"
            alt="CastPrivacy"
            width={200}
            height={200}
            className="mx-auto border-2 border-[#00ff00]"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* App Title */}
        <h1 className="text-4xl font-mono text-[#00ff00] mb-4 uppercase tracking-widest">
          CASTPRIVACY
        </h1>

        {/* Tagline */}
        <p className="text-xl text-[#ffffff] mb-6 uppercase tracking-wide">
          TAKE CONTROL OF YOUR FARCASTER CONTENT
        </p>

        {/* Description */}
        <p className="text-[#808080] mb-8 leading-relaxed font-mono text-sm">
          VIEW, ORGANIZE, AND MANAGE YOUR FARCASTER CASTS AND REACTIONS WITH SECURE PRIVACY CONTROLS.
        </p>

        {/* Launch Button */}
        <Button
          onClick={onLaunch}
          disabled={!isFrameReady || isLaunching}
          size="lg"
          className="w-full h-14 text-lg font-mono uppercase tracking-wider"
          icon={isLaunching ? undefined : <Icon name="arrow-right" size="md" />}
        >
          {isLaunching ? "LAUNCHING..." : "LAUNCH CASTPRIVACY"}
        </Button>

        {/* Status Text */}
        <p className="text-sm text-[#808080] mt-4 font-mono uppercase tracking-wide">
          {!isFrameReady 
            ? "PREPARING SECURE ENVIRONMENT..." 
            : isLaunching 
            ? "INITIALIZING PRIVACY CONTROLS..."
            : "READY TO LAUNCH"
          }
        </p>
      </div>
    </div>
  );
}

type IconProps = {
  name: "heart" | "star" | "check" | "plus" | "arrow-right" | "lock" | "unlock";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    heart: (
      <div 
        className={`${sizeClasses[size]} bg-[#ff0040] ${className}`}
        style={{ 
          clipPath: 'polygon(50% 15%, 85% 0%, 100% 35%, 50% 100%, 0% 35%, 15% 0%)',
          imageRendering: 'pixelated'
        }}
        title="Heart"
      />
    ),
    star: (
      <div 
        className={`${sizeClasses[size]} bg-[#ffff00] ${className}`}
        style={{ 
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          imageRendering: 'pixelated'
        }}
        title="Star"
      />
    ),
    check: (
      <div 
        className={`${sizeClasses[size]} bg-[#00ff00] ${className}`}
        style={{ 
          clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)',
          imageRendering: 'pixelated'
        }}
        title="Check"
      />
    ),
    plus: (
      <div 
        className={`${sizeClasses[size]} bg-current ${className}`}
        style={{ 
          clipPath: 'polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)',
          imageRendering: 'pixelated'
        }}
        title="Plus"
      />
    ),
    "arrow-right": (
      <div 
        className={`${sizeClasses[size]} bg-current ${className}`}
        style={{ 
          clipPath: 'polygon(0% 40%, 60% 40%, 60% 20%, 100% 50%, 60% 80%, 60% 60%, 0% 60%)',
          imageRendering: 'pixelated'
        }}
        title="Arrow Right"
      />
    ),
    lock: (
      <div 
        className={`${sizeClasses[size]} bg-[#ff0040] ${className}`}
        style={{ 
          clipPath: 'polygon(25% 45%, 25% 30%, 75% 30%, 75% 45%, 85% 45%, 85% 100%, 15% 100%, 15% 45%)',
          imageRendering: 'pixelated'
        }}
        title="Lock"
      />
    ),
    unlock: (
      <div 
        className={`${sizeClasses[size]} bg-[#00ff00] ${className}`}
        style={{ 
          clipPath: 'polygon(25% 45%, 25% 30%, 65% 30%, 65% 15%, 85% 15%, 85% 45%, 95% 45%, 95% 100%, 15% 100%, 15% 45%)',
          imageRendering: 'pixelated'
        }}
        title="Unlock"
      />
    ),
  };

  return (
    <span className={`inline-block ${className}`}>
      {icons[name]}
    </span>
  );
}


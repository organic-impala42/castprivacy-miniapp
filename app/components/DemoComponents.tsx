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
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
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
}

function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
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

export function CastsDetailedView({ setActiveTab, castsData, isLoading, profileData, isAuthenticated = false }: CastsViewProps) {
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
                              <img 
                                src={cast.channel.image_url} 
                                alt={cast.channel.name}
                                className="w-4 h-4 rounded"
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

export function ReactionsDetailedView({ setActiveTab, reactionsData, isLoading, profileData }: ReactionsViewProps) {
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
    <div className="space-y-6 animate-fade-in">
      <Card title="My First Mini App">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          This is a minimalistic Mini App built with OnchainKit components.
        </p>
        <div className="flex space-x-3">
          <Button
            onClick={() => setActiveTab("features")}
            icon={<Icon name="arrow-right" size="sm" />}
          >
            Explore Features
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveTab("about")}
          >
            About
          </Button>
        </div>
      </Card>

      <Card title="Your Casts">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          View your recent Farcaster casts and activity.
        </p>
        <Button
          onClick={() => setActiveTab("casts-overview")}
          icon={<Icon name="arrow-right" size="sm" />}
        >
          View Casts
        </Button>
      </Card>

      <Card title="Your Reactions">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          See your recent likes and recasts on Farcaster.
        </p>
        <Button
          onClick={() => setActiveTab("reactions-overview")}
          icon={<Icon name="heart" size="sm" />}
        >
          View Reactions
        </Button>
      </Card>

      <Card title="Secure Authentication">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          {isAuthenticated 
            ? "You're authenticated for secure actions like deleting casts and reactions." 
            : "Authenticate to enable secure actions like deleting your content."
          }
        </p>
        <div className="flex space-x-3">
          {!isAuthenticated ? (
            <Button
              onClick={onAuthenticate}
              disabled={isAuthenticating}
              icon={<Icon name="lock" size="sm" />}
            >
              {isAuthenticating ? "Authenticating..." : "Authenticate"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={onSignOut}
              icon={<Icon name="unlock" size="sm" />}
            >
              Sign Out
            </Button>
          )}
        </div>
      </Card>
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    lock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Lock</title>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <circle cx="12" cy="16" r="1" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    unlock: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Unlock</title>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <circle cx="12" cy="16" r="1" />
        <path d="M7 11V7a5 5 0 0 1 9 0" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}

type Todo = {
  id: number;
  text: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Learn about MiniKit", completed: false },
    { id: 2, text: "Build a Mini App", completed: true },
    { id: 3, text: "Deploy to Base and go viral", completed: false },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const newId =
      todos.length > 0 ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
    setTodos([...todos, { id: newId, text: newTodo, completed: false }]);
    setNewTodo("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  return (
    <Card title="Get started">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          />
          <Button
            variant="primary"
            size="md"
            onClick={addTodo}
            icon={<Icon name="plus" size="sm" />}
          >
            Add
          </Button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  id={`todo-${todo.id}`}
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    todo.completed
                      ? "bg-[var(--app-accent)] border-[var(--app-accent)]"
                      : "border-[var(--app-foreground-muted)] bg-transparent"
                  }`}
                >
                  {todo.completed && (
                    <Icon
                      name="check"
                      size="sm"
                      className="text-[var(--app-background)]"
                    />
                  )}
                </button>
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-[var(--app-foreground-muted)] cursor-pointer ${todo.completed ? "line-through opacity-70" : ""}`}
                >
                  {todo.text}
                </label>
              </div>
              <button
                type="button"
                onClick={() => deleteTodo(todo.id)}
                className="text-[var(--app-foreground-muted)] hover:text-[var(--app-foreground)]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}


function TransactionCard() {
  const { address } = useAccount();

  // Example transaction call - sending 0 ETH to self
  const calls = useMemo(() => address
    ? [
        {
          to: address,
          data: "0x" as `0x${string}`,
          value: BigInt(0),
        },
      ]
    : [], [address]);

  const sendNotification = useNotification();

  const handleSuccess = useCallback(async (response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;

    console.log(`Transaction successful: ${transactionHash}`);

    await sendNotification({
      title: "Congratulations!",
      body: `You sent your a transaction, ${transactionHash}!`,
    });
  }, [sendNotification]);

  return (
    <Card title="Make Your First Transaction">
      <div className="space-y-4">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Experience the power of seamless sponsored transactions with{" "}
          <a
            href="https://onchainkit.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0052FF] hover:underline"
          >
            OnchainKit
          </a>
          .
        </p>

        <div className="flex flex-col items-center">
          {address ? (
            <Transaction
              calls={calls}
              onSuccess={handleSuccess}
              onError={(error: TransactionError) =>
                console.error("Transaction failed:", error)
              }
            >
              <TransactionButton className="text-white text-md" />
              <TransactionStatus>
                <TransactionStatusAction />
                <TransactionStatusLabel />
              </TransactionStatus>
              <TransactionToast className="mb-4">
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
          ) : (
            <p className="text-yellow-400 text-sm text-center mt-2">
              Connect your wallet to send a transaction
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

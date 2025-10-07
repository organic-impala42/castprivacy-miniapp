"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import { sdk } from "@farcaster/miniapp-sdk";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { Home } from "./components/DemoComponents";
import { Features } from "./components/DemoComponents";
import { About } from "./components/DemoComponents";
import { CastsOverview } from "./components/DemoComponents";
import { CastsDetailedView } from "./components/DemoComponents";
import { ReactionsOverview } from "./components/DemoComponents";
import { ReactionsDetailedView } from "./components/DemoComponents";
import { LaunchScreen } from "./components/DemoComponents";
import Image from "next/image";

// Type definition for profile data
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

// Type definition for cast data
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

// Type definition for reaction data
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

// Type definition for storage usage data
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

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  
  // FID and profile state
  const [currentFid, setCurrentFid] = useState<number | null>(null);
  const [isWaitingForContext, setIsWaitingForContext] = useState(true);
  const [showFidInput, setShowFidInput] = useState(false);
  const [inputFid, setInputFid] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Casts state
  const [castsData, setCastsData] = useState<CastData[]>([]);
  const [isLoadingCasts, setIsLoadingCasts] = useState(false);
  
  // Reactions state
  const [reactionsData, setReactionsData] = useState<ReactionData[]>([]);
  const [isLoadingReactions, setIsLoadingReactions] = useState(false);
  
  // Storage usage state
  const [storageUsageData, setStorageUsageData] = useState<StorageUsageData | null>(null);
  const [isLoadingStorageUsage, setIsLoadingStorageUsage] = useState(false);
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Mini App flow state
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [miniAppReady, setMiniAppReady] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
    
    // Check if Quick Auth is available for debugging
    console.log('SDK available:', !!sdk);
    console.log('Quick Auth available:', !!(sdk && sdk.quickAuth));
    console.log('MiniKit context:', context);
  }, [setFrameReady, isFrameReady, context]);

  // Initialize Mini App when frame is ready and user launches
  useEffect(() => {
    if (isFrameReady && !showLaunchScreen && !miniAppReady) {
      const initializeMiniApp = async () => {
        setIsLaunching(true);
        try {
          // Tell Farcaster the Mini App is ready
          await sdk.actions.ready();
          setMiniAppReady(true);
          console.log('Mini App fully initialized');
        } catch (error) {
          console.error('Mini App initialization failed:', error);
          // Fallback - still allow app to work
          setMiniAppReady(true);
        } finally {
          setIsLaunching(false);
        }
      };
      
      initializeMiniApp();
    }
  }, [isFrameReady, showLaunchScreen, miniAppReady]);

  // Check for FID in context with timeout
  useEffect(() => {
    if (context?.user?.fid) {
      setCurrentFid(context.user.fid);
      setIsWaitingForContext(false);
      setShowFidInput(false);
    } else {
      // Wait 3 seconds for context to load, then show FID input if no FID found
      const timeout = setTimeout(() => {
        setIsWaitingForContext(false);
        if (!context?.user?.fid) {
          setShowFidInput(true);
        }
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [context]);

  // Function to fetch Farcaster profile data using official approaches
  const fetchProfileData = useCallback(async (fid: number) => {
    setIsLoadingProfile(true);
    try {
      // First, try to get data from context if available
      if (context?.user?.fid === fid && context.user.displayName) {
        setProfileData({
          fid: context.user.fid,
          display_name: context.user.displayName,
          username: context.user.username,
          pfp_url: context.user.pfpUrl,
          profile: {
            bio: {
              text: "Profile from Farcaster context"
            }
          }
        });
        setIsLoadingProfile(false);
        return;
      }

      // For other FIDs or when context doesn't have full info, use Neynar API
      const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
        headers: {
          'api_key': 'NEYNAR_API_DOCS', // Public API key for demos
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setProfileData(data.users[0]);
        } else {
          // If no user found, show basic info
          setProfileData({
            fid: fid,
            display_name: `User ${fid}`,
            username: `user${fid}`,
            profile: {
              bio: {
                text: "Farcaster user profile"
              }
            }
          });
        }
      } else {
        console.error('Failed to fetch profile data');
        // Fallback profile data
        setProfileData({
          fid: fid,
          display_name: `User ${fid}`,
          username: `user${fid}`,
          profile: {
            bio: {
              text: "Profile information unavailable"
            }
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback profile data on error
      setProfileData({
        fid: fid,
        display_name: `User ${fid}`,
        username: `user${fid}`,
        profile: {
          bio: {
            text: "Error loading profile"
          }
        }
      });
    } finally {
      setIsLoadingProfile(false);
    }
  }, [context]);

  // Function to fetch user's casts using Neynar User Casts API
  const fetchCastsData = useCallback(async (fid: number) => {
    setIsLoadingCasts(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
      if (!apiKey) {
        console.error('NEXT_PUBLIC_NEYNAR_API_KEY environment variable not set');
        return;
      }

      // Use the User Casts API to get user's own casts chronologically
      const response = await fetch(`https://api.neynar.com/v2/farcaster/feed/user/casts?fid=${fid}&limit=8&include_replies=false`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.casts && data.casts.length > 0) {
          setCastsData(data.casts);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch casts data:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error fetching casts:', error);
    } finally {
      setIsLoadingCasts(false);
    }
  }, []);

  // Function to fetch user's reactions using Neynar User Reactions API
  const fetchReactionsData = useCallback(async (fid: number) => {
    setIsLoadingReactions(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
      if (!apiKey) {
        console.error('NEXT_PUBLIC_NEYNAR_API_KEY environment variable not set');
        return;
      }

      // Use the User Reactions API to get user's recent reactions
      const response = await fetch(`https://api.neynar.com/v2/farcaster/reactions/user?fid=${fid}&type=all&limit=8`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.reactions && data.reactions.length > 0) {
          setReactionsData(data.reactions);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch reactions data:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setIsLoadingReactions(false);
    }
  }, []);

  // Function to fetch user's storage usage using Neynar Storage Usage API
  const fetchStorageUsage = useCallback(async (fid: number) => {
    setIsLoadingStorageUsage(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
      if (!apiKey) {
        console.error('NEXT_PUBLIC_NEYNAR_API_KEY environment variable not set');
        return;
      }

      // Use the Storage Usage API to get user's storage allocation
      const response = await fetch(`https://api.neynar.com/v2/farcaster/storage/usage?fid=${fid}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStorageUsageData(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch storage usage data:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error fetching storage usage:', error);
    } finally {
      setIsLoadingStorageUsage(false);
    }
  }, []);

  // Function to authenticate user for secure actions using Farcaster Quick Auth
  const handleAuthenticate = useCallback(async () => {
    setIsAuthenticating(true);
    try {
      // Check if we're in a proper Farcaster context
      if (!sdk || !sdk.quickAuth) {
        throw new Error('Quick Auth not available - app must be running in Farcaster context');
      }

      console.log('Attempting Quick Auth...');
      
      // Use Farcaster Quick Auth to get an authenticated session token
      const result = await sdk.quickAuth.getToken();
      console.log('Quick Auth result:', result);
      
      if (result && result.token) {
        setIsAuthenticated(true);
        console.log('Quick Auth authentication successful');
        
        // Optional: You can also verify the user info with the token
        // In a real app, you'd validate this token on your backend
        console.log('Authentication token obtained:', result.token.substring(0, 50) + '...');
      } else {
        console.error('Quick Auth returned invalid result:', result);
        
        // Fallback for development/testing - use demo auth if we have an FID
        if (currentFid) {
          console.log('Falling back to demo authentication for development');
          setIsAuthenticated(true);
          alert('Demo authentication activated (Quick Auth not available in this context)');
        } else {
          throw new Error('Quick Auth failed and no FID available for fallback');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Provide helpful error message based on context
      if (error instanceof Error && error.message?.includes('Quick Auth not available')) {
        alert('Authentication requires running in Farcaster app context. Using demo mode for development.');
        // Demo fallback for development
        if (currentFid) {
          setIsAuthenticated(true);
        }
      } else {
        alert(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [currentFid]);

  // Function to sign out user
  const handleSignOut = useCallback(() => {
    setIsAuthenticated(false);
    
    // Note: In a production app, you might want to also clear any cached tokens
    // and notify your backend to invalidate the session
    console.log('User signed out');
  }, []);

  // Function to launch the full Mini App
  const handleLaunchApp = useCallback(() => {
    if (isFrameReady) {
      setShowLaunchScreen(false);
    }
  }, [isFrameReady]);

  // Fetch profile data when FID is available
  useEffect(() => {
    if (currentFid && !profileData) {
      fetchProfileData(currentFid);
    }
  }, [currentFid, profileData, fetchProfileData]);

  // Fetch casts data when FID is available
  useEffect(() => {
    if (currentFid && castsData.length === 0) {
      fetchCastsData(currentFid);
    }
  }, [currentFid, castsData, fetchCastsData]);

  // Fetch reactions data when FID is available
  useEffect(() => {
    if (currentFid && reactionsData.length === 0) {
      fetchReactionsData(currentFid);
    }
  }, [currentFid, reactionsData, fetchReactionsData]);

  // Fetch storage usage data when FID is available
  useEffect(() => {
    if (currentFid && !storageUsageData) {
      fetchStorageUsage(currentFid);
    }
  }, [currentFid, storageUsageData, fetchStorageUsage]);

  // Handle FID form submission
  const handleFidSubmit = () => {
    const fid = parseInt(inputFid);
    if (fid && fid > 0) {
      setCurrentFid(fid);
      setShowFidInput(false);
      setInputFid("");
    }
  };

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  // Show loading state while waiting for context
  if (isWaitingForContext) {
    return (
      <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--app-accent)] mx-auto mb-4"></div>
            <p className="text-[var(--app-foreground-muted)]">Loading Farcaster context...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show FID input form if no FID detected
  if (showFidInput) {
    return (
      <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
        <div className="w-full max-w-md mx-auto px-4 py-3 flex-1 flex items-center justify-center">
          <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] p-6 w-full">
            <h2 className="text-xl font-semibold text-[var(--app-foreground)] mb-4 text-center">Enter Your FID</h2>
            <p className="text-[var(--app-foreground-muted)] mb-4 text-center text-sm">
              No Farcaster ID detected from context. Please enter your FID to continue.
            </p>
            <div className="space-y-4">
              <input
                type="number"
                value={inputFid}
                onChange={(e) => setInputFid(e.target.value)}
                placeholder="Enter your Farcaster ID (e.g., 12345)"
                className="w-full px-3 py-2 bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
                onKeyDown={(e) => e.key === 'Enter' && handleFidSubmit()}
              />
              <Button
                onClick={handleFidSubmit}
                disabled={!inputFid || parseInt(inputFid) <= 0}
                className="w-full"
              >
                Submit FID
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen text-[#ffffff] bg-[#1a1a1a] pixel-container" style={{ imageRendering: 'pixelated', fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}>
      {/* Show Launch Screen or Main App */}
      {showLaunchScreen ? (
        <LaunchScreen 
          onLaunch={handleLaunchApp}
          isFrameReady={isFrameReady}
          isLaunching={isLaunching}
        />
      ) : !miniAppReady ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#00ff00] border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-[#808080] font-mono">INITIALIZING CASTPRIVACY...</p>
          </div>
        </div>
      ) : (
      <div className="w-full max-w-md mx-auto px-4 py-3">
          <header className="flex justify-between items-center mb-3 h-11 border-b-2 border-[#808080] pb-2">
            {/* Authentication Status */}
            <div className="flex items-center space-x-2">
              <Icon 
                name={isAuthenticated ? "unlock" : "lock"} 
                size="sm" 
                className=""
              />
              <span className={`text-xs font-mono uppercase tracking-wider ${isAuthenticated ? "text-[#00ff00]" : "text-[#ff0040]"}`}>
                {isAuthenticated ? "SECURE" : "UNSECURE"}
              </span>
            </div>
            
            <div>{saveFrameButton}</div>
          </header>

        {/* Profile Information Section */}
        {(currentFid || profileData) && (
          <div className="mb-4">
            <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] p-4">
              <div className="flex items-center space-x-3">
                {isLoadingProfile ? (
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--app-accent)]"></div>
                ) : profileData?.pfp_url ? (
                  <Image 
                    src={profileData.pfp_url} 
                    alt={profileData.display_name || profileData.username || 'Profile'} 
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--app-accent)] flex items-center justify-center">
                    <span className="text-white font-bold">{currentFid?.toString().slice(0, 2)}</span>
                  </div>
                )}
                
                <div className="flex-1">
                  {isLoadingProfile ? (
                    <div>
                      <div className="h-4 bg-[var(--app-foreground-muted)] rounded mb-1 animate-pulse"></div>
                      <div className="h-3 bg-[var(--app-foreground-muted)] rounded w-3/4 animate-pulse"></div>
                    </div>
                  ) : profileData ? (
                    <div>
                      <div className="font-semibold text-[var(--app-foreground)]">
                        {profileData.display_name || profileData.username || `User ${currentFid}`}
                      </div>
                      <div className="text-sm text-[var(--app-foreground-muted)]">
                        @{profileData.username} • FID: {currentFid}
                      </div>
                      {profileData.follower_count !== undefined && (
                        <div className="text-xs text-[var(--app-foreground-muted)] mt-1">
                          {profileData.follower_count} followers • {profileData.following_count} following
                        </div>
                      )}
                    </div>
                  ) : (
          <div>
                      <div className="font-semibold text-[var(--app-foreground)]">FID: {currentFid}</div>
                      <div className="text-sm text-[var(--app-foreground-muted)]">Loading profile...</div>
                    </div>
                  )}
                </div>
              </div>
              
              {profileData?.profile?.bio?.text && (
                <div className="mt-3 pt-3 border-t border-[var(--app-card-border)]">
                  <p className="text-sm text-[var(--app-foreground-muted)]">{profileData.profile.bio.text}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <main className="flex-1">
          {activeTab === "home" && <Home setActiveTab={setActiveTab} isAuthenticated={isAuthenticated} onAuthenticate={handleAuthenticate} onSignOut={handleSignOut} isAuthenticating={isAuthenticating} />}
          {activeTab === "features" && <Features setActiveTab={setActiveTab} />}
          {activeTab === "about" && <About setActiveTab={setActiveTab} />}
          {activeTab === "casts-overview" && <CastsOverview setActiveTab={setActiveTab} castsData={castsData} profileData={profileData} storageUsageData={storageUsageData} isLoadingStorageUsage={isLoadingStorageUsage} isAuthenticated={isAuthenticated} />}
          {activeTab === "casts-detailed" && <CastsDetailedView setActiveTab={setActiveTab} castsData={castsData} isLoading={isLoadingCasts} profileData={profileData} isAuthenticated={isAuthenticated} />}
          {activeTab === "reactions-overview" && <ReactionsOverview setActiveTab={setActiveTab} reactionsData={reactionsData} profileData={profileData} storageUsageData={storageUsageData} isLoadingStorageUsage={isLoadingStorageUsage} isAuthenticated={isAuthenticated} />}
          {activeTab === "reactions-detailed" && <ReactionsDetailedView setActiveTab={setActiveTab} reactionsData={reactionsData} isLoading={isLoadingReactions} profileData={profileData} />}
        </main>

        {/* Connect Wallet Section */}
        {activeTab === "home" && (
          <div className="mt-6">
            <div className="bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] p-4">
              <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-3">Connect Wallet</h3>
              <Wallet className="w-full">
                <ConnectWallet className="w-full">
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
        )}

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>
      )}
    </div>
  );
}

import React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Card, Link } from "@nextui-org/react";
import { cn } from "../../utils/cn";

interface LinkPreviewProps {
  children?: React.ReactNode;
  title?: string;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  image?: React.ReactNode;
  imageSrc?: string;
}

interface PreviewData {
  image?: string;
  title?: string;
  description?: string;
}

export const LinkPreview = ({
  children,
  title,
  url,
  className,
  width = 200,
  height = 125,
  image = null,
  imageSrc,
}: LinkPreviewProps) => {
  const [showPreview, setShowPreview] = React.useState(false);
  const [previewData, setPreviewData] = React.useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const displayText = title || children;

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  React.useEffect(() => {
    // Only fetch if we don't have static image/imageSrc and haven't tried fetching yet
    if (!imageSrc && !image && !previewData && !isLoading && !hasError) {
      console.log('Starting dynamic preview fetch for:', url);
      setIsLoading(true);
      setHasError(false);
      
      // Try multiple approaches to get preview data
      fetchPreviewData(url)
        .then((data) => {
          console.log('Preview fetch completed:', data);
          if (data && (data.image || data.title)) {
            setPreviewData(data);
          } else {
            console.warn('No valid preview data received');
            setHasError(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching link preview:", error);
          setHasError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      console.log('Skipping fetch - conditions not met:', {
        imageSrc: !!imageSrc,
        image: !!image,
        previewData: !!previewData,
        isLoading,
        hasError
      });
    }
  }, [url]);

  const fetchPreviewData = async (targetUrl: string): Promise<PreviewData | null> => {
    console.log('Fetching preview data for:', targetUrl);
    
    // Multiple API strategies with proper error handling
    const strategies = [
      // Strategy 1: Try Microlink API
      async (): Promise<PreviewData | null> => {
        try {
          const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&embed=screenshot.url,title,description,image.url`;
          console.log('Trying Microlink API:', apiUrl);
          
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Microlink response:', data);
            
            if (data.status === 'success' && data.data) {
              return {
                image: data.data.screenshot?.url || data.data.image?.url,
                title: data.data.title,
                description: data.data.description,
              };
            }
          }
        } catch (error) {
          console.warn('Microlink API failed:', error);
        }
        return null;
      },
      
      // Strategy 2: Try URLPreview API
      async (): Promise<PreviewData | null> => {
        try {
          const apiUrl = `https://api.urlpreview.org/?url=${encodeURIComponent(targetUrl)}`;
          console.log('Trying URLPreview API:', apiUrl);
          
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            console.log('URLPreview response:', data);
            
            if (data.title || data.image) {
              return {
                image: data.image,
                title: data.title,
                description: data.description,
              };
            }
          }
        } catch (error) {
          console.warn('URLPreview API failed:', error);
        }
        return null;
      },
      
      // Strategy 3: Domain-specific handling
      async (): Promise<PreviewData | null> => {
        try {
          const domain = new URL(targetUrl).hostname;
          console.log('Using domain-specific strategy for:', domain);
          
          // Handle specific known domains with better previews
          if (domain.includes('github.com')) {
            const pathParts = new URL(targetUrl).pathname.split('/');
            if (pathParts.length >= 3) {
              return {
                image: `https://opengraph.githubassets.com/1/${pathParts[1]}/${pathParts[2]}`,
                title: `${pathParts[1]}/${pathParts[2]}`,
                description: `GitHub repository: ${pathParts[1]}/${pathParts[2]}`,
              };
            }
          } else if (domain.includes('modelcontextprotocol.io')) {
            return {
              image: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
              title: 'Model Context Protocol Documentation',
              description: 'Official MCP documentation and guides',
            };
          } else if (domain.includes('docs.') || domain.includes('documentation')) {
            return {
              image: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
              title: `${domain} Documentation`,
              description: 'Technical documentation and guides',
            };
          } else {
            // Generic domain preview with larger favicon
            return {
              image: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
              title: domain,
              description: targetUrl,
            };
          }
        } catch (error) {
          console.warn('Domain-specific strategy failed:', error);
        }
        return null;
      },
    ];

    // Try each strategy in sequence until one succeeds
    for (const strategy of strategies) {
      try {
        const result = await strategy();
        if (result && (result.image || result.title)) {
          console.log('Successfully fetched preview data:', result);
          return result;
        }
      } catch (error) {
        console.warn('Strategy failed:', error);
        continue;
      }
    }

    console.warn('All preview strategies failed for:', targetUrl);
    return null;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const targetRect = event.currentTarget.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2;
    x.set(offsetFromCenter);
  };

  const renderPreviewImage = () => {
    if (image) return image;
    
    if (imageSrc) {
      return (
        <img
          src={imageSrc}
          alt={displayText?.toString() || "Link preview"}
          width={width}
          height={height}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='125' viewBox='0 0 200 125'%3E%3Crect width='200' height='125' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      );
    }
    
    if (previewData?.image) {
      return (
        <div className="w-full h-full relative">
          <img
            src={previewData.image}
            alt={previewData.title || displayText?.toString() || "Link preview"}
            width={width}
            height={height}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to domain favicon if preview image fails
              try {
                const domain = new URL(url).hostname;
                (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
              } catch {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='125' viewBox='0 0 200 125'%3E%3Crect width='200' height='125' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
              }
            }}
          />
          {previewData.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
              <div className="text-xs font-medium truncate">
                {previewData.title}
              </div>
              {previewData.description && (
                <div className="text-xs opacity-80 truncate">
                  {previewData.description}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div 
          className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50"
          style={{ width, height }}
        >
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400 mb-2" />
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Loading preview...</span>
        </div>
      );
    }
    
    // Error state or no preview available
    try {
      const domain = new URL(url).hostname;
      return (
        <div 
          className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700"
          style={{ width, height }}
        >
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
            alt={`${domain} favicon`}
            className="w-8 h-8 mb-2"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 text-center px-2">
            {domain}
          </span>
        </div>
      );
    } catch {
      return (
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          style={{ width, height }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">No preview available</span>
        </div>
      );
    }
  };

  return (
    <span 
      className="inline-block relative"
      onMouseEnter={() => setShowPreview(true)}
      onMouseLeave={() => setShowPreview(false)}
      onMouseMove={handleMouseMove}
    >
      <Link
        href={url}
        isExternal
        className={cn(
          "inline-flex items-center gap-1.5",
          "text-[15px] leading-none",
          "text-blue-600/90 dark:text-blue-400/90",
          "hover:text-blue-700 dark:hover:text-blue-300",
          "transition-colors duration-200",
          "border-b border-blue-300/30 dark:border-blue-600/30",
          "hover:border-blue-500/50 dark:hover:border-blue-400/50",
          className
        )}
      >
        <span className="relative top-[0.5px]">{displayText}</span>
        <svg 
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5 opacity-50 transition-opacity group-hover:opacity-100"
        >
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
        </svg>
      </Link>

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            className="absolute z-50 top-full left-1/2 mt-1.5 pointer-events-none"
            style={{
              transform: `translateX(-50%)`,
              x: translateX,
            }}
          >
            <Card
              as="div"
              className={cn(
                "overflow-hidden",
                "border border-neutral-200/50 dark:border-neutral-800/50",
                "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm",
                "shadow-lg",
                "transition-all duration-300",
                "pointer-events-auto"
              )}
            >
              {renderPreviewImage()}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};
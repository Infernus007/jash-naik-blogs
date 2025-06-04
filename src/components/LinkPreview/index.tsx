import React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Card, Link } from "@nextui-org/react";
import { cn } from "../../utils/cn";
import { encode } from "qss";

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
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const displayText = title || children;

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const translateX = useSpring(x, springConfig);

  React.useEffect(() => {
    if (!imageSrc && !image && !previewImage && !isLoading) {
      setIsLoading(true);
      // Use a link preview service to get the image
      const previewUrl = `https://api.microlink.io/?${encode({
        url,
        screenshot: true,
        meta: false,
        embed: "screenshot.url",
      })}`;

      fetch(previewUrl)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && data.data.screenshot?.url) {
            setPreviewImage(data.data.screenshot.url);
          }
        })
        .catch((error) => {
          console.error("Error fetching link preview:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [url, imageSrc, image, previewImage, isLoading]);

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
        />
      );
    }
    if (previewImage) {
      return (
        <img
          src={previewImage}
          alt={displayText?.toString() || "Link preview"}
          width={width}
          height={height}
          className="w-full h-full object-cover"
        />
      );
    }
    if (isLoading) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
          style={{ width, height }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100" />
        </div>
      );
    }
    return (
      <div 
        className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        style={{ width, height }}
      >
        <span className="text-sm text-gray-500 dark:text-gray-400">No preview available</span>
      </div>
    );
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

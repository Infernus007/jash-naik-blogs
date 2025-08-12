import { Image, Card, CardBody, Skeleton } from "@nextui-org/react";
import { useState } from "react";

type AssetType = "image" | "video" | "audio";
type AssetProps = {
  src: string;
  alt?: string;
  type: AssetType;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
};

export const AssetsWrapper: React.FC<AssetProps> = ({
  src = "",
  alt = "",
  type,
  caption,
  width,
  height,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const isRemote = src ? src.startsWith("http") : false;

  const renderContent = () => {
    if (!src) return null;

    switch (type) {
      case "image":
        return (
          <div className="relative w-full">
            {isRemote ? (
              <>
                <div className="w-full rounded-lg" style={{ height: height || 300 }}>
                  <Skeleton className="w-full h-full rounded-lg" />
                </div>
                <Image
                  src={src}
                  alt={alt}
                  width={width || 800}
                  height={height || 600}
                  className={`rounded-lg ${className}`}
                  onLoad={() => setIsLoading(false)}
                  classNames={{
                    wrapper: "w-full",
                    img: "w-full h-auto",
                  }}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <div className="w-full rounded-lg" style={{ height: height || 300 }}>
                      <Skeleton className="w-full h-full rounded-lg" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`rounded-lg w-full h-auto ${className}`}
              />
            )}
          </div>
        );

      case "video":
        return (
          <Card className="w-full">
            <CardBody className="p-0">
              <video
                src={src}
                controls
                className="w-full rounded-lg"
                onLoadedData={() => setIsLoading(false)}
              >
                <track kind="captions" src="" label="English captions" />
              </video>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full rounded-lg" style={{ height: height || 300 }}>
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );

      case "audio":
        return (
          <Card className="w-full">
            <CardBody className="p-4">
              <audio
                src={src}
                controls
                className="w-full"
                onLoadedData={() => setIsLoading(false)}
              >
                <track kind="captions" src="" label="English captions" />
              </audio>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full rounded-lg" style={{ height: 60 }}>
                    <Skeleton className="w-full h-full rounded-lg" />
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-4">
      {renderContent()}
      {caption && (
        <p className="mt-2 text-sm text-foreground/70 text-center">{caption}</p>
      )}
    </div>
  );
};
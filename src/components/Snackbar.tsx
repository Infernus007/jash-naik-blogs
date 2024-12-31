import { useEffect, useState } from 'react';
import { Kbd } from '@nextui-org/react';

interface SnackbarProps {
  message: string;
  showKbd?: boolean;
  id: string;
  persistent?: boolean;
}

declare global {
  interface Window {
    [key: string]: any;
  }
}

export const Snackbar = ({ message, showKbd = false, id, persistent = false }: SnackbarProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showFn = () => {
      setIsVisible(true);
      if (!persistent) {
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    const hideFn = () => {
      setIsVisible(false);
    };

    // Add functions to window object with unique names
    const showKey = `show_${id}`;
    const hideKey = `hide_${id}`;
    window[showKey] = showFn;
    window[hideKey] = hideFn;

    return () => {
      delete window[showKey];
      delete window[hideKey];
    };
  }, [id, persistent]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-md border border-foreground/10 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
      {message}
      {showKbd && <Kbd keys={["escape"]}>ESC</Kbd>}
    </div>
  );
};
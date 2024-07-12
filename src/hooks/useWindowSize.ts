import { WindowSize } from "@/types/windowSize";
import { useEffect, useState } from "react";
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
});

  useEffect(() => {
    if (windowSize.width == 0) {
        setWindowSize({width: window.outerWidth, height: window.outerHeight});  
    }
    
    const windowSizeHandler = () => {
      setWindowSize({width: window.outerWidth, height: window.outerHeight});
    };
    window.addEventListener("resize", windowSizeHandler);

    return () => {
      window.removeEventListener("resize", windowSizeHandler);
    };
  }, [windowSize.width]);

  return windowSize;
};
import { WindowSize } from "@/types/windowSize";
import { MOBILE_WIDTH_BREAKPOINT } from "@/constants";
import { useEffect, useState } from "react";
export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
    orientation: undefined,
    isMobile: false,
    angle: 0
  });

  const windowSizeJson = JSON.stringify(windowSize);

  useEffect(() => {
    const windowSizeHandler = () => {
      if (!window || !window.screen || !window.screen.orientation) {
        return;
      }
      const currentOrientation = window.screen.orientation.type.toString();
      const isLandscape = currentOrientation?.toLowerCase().includes('landscape');
      const currentAngle = Math.abs(window.screen.orientation.angle);
      let windowWidth = window.outerWidth;
      let windowHeight = window.outerHeight;
      if (isLandscape && currentAngle > 0) {
        if (windowHeight >= windowWidth) {
          let temp = windowWidth;
          windowWidth = windowHeight;
          windowHeight = temp;
        }        
      } else if (currentAngle == 0)  {
        if (windowWidth >= windowHeight) {
          let temp = windowWidth;
          windowWidth = windowHeight;
          windowHeight = temp;
        }        
      }
      const isMobileWidth = (windowWidth < MOBILE_WIDTH_BREAKPOINT);
      setWindowSize({width: windowWidth, height: windowHeight, orientation: currentOrientation, isMobile: isMobileWidth, angle: currentAngle});  
    };
    screen.orientation.addEventListener("change", windowSizeHandler);
    window.addEventListener("resize", windowSizeHandler);
    if (!windowSize.orientation || windowSize.width == 0) {
      windowSizeHandler();
    }    
    return () => {
      window.removeEventListener("resize", windowSizeHandler);
      screen.orientation.removeEventListener('change', windowSizeHandler);
    };
  }, [windowSize, windowSizeJson]);

  return windowSize;
};
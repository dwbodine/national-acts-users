import { useState, useEffect } from 'react';

const useScreenOrientation = () => {
  const [orientation, setOrientation] = useState<string | undefined>(undefined);  

  useEffect(() => {
    const updateOrientation = () => {
      const currentOrientation = (window && window.screen && window.screen.orientation) ? window.screen.orientation.type.toString() : '';
      setOrientation(currentOrientation);
    };
    screen.orientation.addEventListener("change", updateOrientation);
    if (!orientation) {
      updateOrientation();
    }
    return () => {
      screen.orientation.removeEventListener('change', updateOrientation);
    };
  }, [orientation]);
  return orientation;
};

export default useScreenOrientation;
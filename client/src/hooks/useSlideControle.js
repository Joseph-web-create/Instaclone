import { useState, useCallback } from "react";

export default function useSlideControle(ArrayPhotos) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handlePrevious = useCallback(() => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + ArrayPhotos.length) % ArrayPhotos.length
    );
  }, [ArrayPhotos?.length]);

  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % ArrayPhotos?.length);
  }, [ArrayPhotos?.length]);

  return {
    currentImageIndex,
    setCurrentImageIndex,
    handlePrevious,
    handleNext,
  };
}

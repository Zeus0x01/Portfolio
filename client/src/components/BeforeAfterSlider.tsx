import { useState, useRef, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
  className?: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  alt,
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      setSliderPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
      setSliderPosition(percentage);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(percentage);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-ew-resize select-none ${className}`}
      style={{ height: '16rem' }}
      onClick={handleClick}
    >
      {/* Before image (background) */}
      <img
        src={beforeImage}
        alt={`${alt} - Before`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      
      {/* After image (clipped) */}
      <img
        src={afterImage}
        alt={`${alt} - After`}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        draggable={false}
      />
      
      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%` }}
      />
      
      {/* Slider handle */}
      <div
        className="absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-ew-resize z-20 transform -translate-y-1/2"
        style={{ left: `${sliderPosition}%`, marginLeft: '-16px' }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <ArrowLeftRight className="w-4 h-4 text-slate-600" />
      </div>
      
      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-semibold">
        Before
      </div>
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm font-semibold">
        After
      </div>
    </div>
  );
}

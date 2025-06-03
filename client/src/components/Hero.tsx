import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Star } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = [
    "Creative Designer",
    "Visual Artist", 
    "Brand Expert",
    "Digital Creator"
  ];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
        
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
        
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="w-6 h-6 text-primary/30" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Star className="w-8 h-8 text-primary/20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-4 h-4 text-primary/40" />
        </div>
        <div className="absolute top-60 right-10 animate-float" style={{ animationDelay: '0.5s' }}>
          <Star className="w-5 h-5 text-primary/25" />
        </div>
      </div>

      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="space-y-8">
          <div className="animate-bounce-in">
            <h1 className="text-6xl md:text-8xl font-bold leading-tight">
              <span className="text-foreground">Hi, I'm</span>
              <span className="block text-foreground font-extrabold mb-4">[Your Name]</span>
              <span className="block text-gradient-animated relative min-h-[1.2em] text-5xl md:text-6xl">
                {currentText}
                <span className="cursor ml-1">|</span>
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            Transforming ideas into stunning visual experiences. From brand identity to digital masterpieces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              size="lg"
              onClick={() => scrollToSection('#portfolio')}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 animate-glow"
            >
              <span>View Portfolio</span>
              <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('#courses')}
              className="group border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Browse Courses</span>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

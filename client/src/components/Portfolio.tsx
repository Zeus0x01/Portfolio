import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import PortfolioModal from "@/components/PortfolioModal";
import { Eye, Camera, Palette, Megaphone, User } from "lucide-react";
import type { PortfolioItem } from "@shared/schema";

const categories = [
  { id: 'all', label: 'All Work', icon: Palette },
  { id: 'ads', label: 'Advertisement', icon: Megaphone },
  { id: 'portraits', label: 'Portraits', icon: User },
  { id: 'products', label: 'Products', icon: Camera },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'retouching', label: 'Photo Retouching', icon: Camera },
];

const categoryColors = {
  ads: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  portraits: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
  products: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  branding: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  retouching: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
};

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const { data: portfolioItems = [], isLoading } = useQuery({
    queryKey: ['/api/portfolio', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/portfolio?category=${selectedCategory}`);
      if (!response.ok) throw new Error('Failed to fetch portfolio items');
      return response.json();
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">My Portfolio</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A collection of my best work showcasing creativity, technical skill, and attention to detail.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">My Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A collection of my best work showcasing creativity, technical skill, and attention to detail.
          </p>
        </div>

        {/* Portfolio Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className="px-6 py-3 font-semibold"
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No portfolio items found for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item: PortfolioItem, index: number) => (
              <Card
                key={item.id}
                className="group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative overflow-hidden">
                  {item.category === 'retouching' && item.isBeforeAfter && item.beforeImage && item.afterImage ? (
                    <BeforeAfterSlider
                      beforeImage={item.beforeImage}
                      afterImage={item.afterImage}
                      alt={item.title}
                    />
                  ) : (
                    <img
                      src={item.mainImage}
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
                      {item.category}
                    </Badge>
                    
                    {item.isBeforeAfter ? (
                      <div className="flex items-center text-sm text-primary">
                        <Eye className="w-4 h-4 mr-2" />
                        <span>Before/After</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Camera className="w-4 h-4 mr-2" />
                        <span>View Details</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio Modal */}
      {selectedItem && (
        <PortfolioModal
          item={selectedItem}
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}

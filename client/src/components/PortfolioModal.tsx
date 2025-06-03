import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import type { PortfolioItem } from "@shared/schema";

interface PortfolioModalProps {
  item: PortfolioItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function PortfolioModal({ item, isOpen, onClose }: PortfolioModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{item.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image display */}
          <div className="w-full">
            {item.isBeforeAfter && item.beforeImage && item.afterImage ? (
              <BeforeAfterSlider
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                alt={item.title}
                className="w-full rounded-lg"
              />
            ) : (
              <img
                src={item.mainImage}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Project details */}
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg leading-relaxed">
              {item.description}
            </p>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Project Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> 
                  <Badge className="ml-2" variant="secondary">
                    {item.category}
                  </Badge>
                </div>
                <div>
                  <strong>Type:</strong> {item.isBeforeAfter ? "Before/After Comparison" : "Standard Portfolio"}
                </div>
                {item.tools && (
                  <div className="md:col-span-2">
                    <strong>Tools Used:</strong> {item.tools}
                  </div>
                )}
                <div>
                  <strong>Featured:</strong> {item.featured ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(item.createdAt!).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

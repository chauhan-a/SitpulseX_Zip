import { Building2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className="bg-primary border-b border-border h-16 flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="text-primary-foreground hover:bg-primary-hover md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary-foreground" />
            <div className="flex flex-col">
              <span className="text-primary-foreground font-bold text-lg leading-tight">SitePulseX</span>
              <span className="text-primary-foreground/80 text-xs leading-tight">Powered by HCLTech</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-primary-foreground/90 text-sm">
          <span className="font-medium">Industrial Knowledge Management</span>
        </div>
      </div>
    </header>
  );
};
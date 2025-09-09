import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Bot, 
  Calendar,
  Bell,
  BarChart3,
  Settings,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Knowledge Base", href: "/knowledge", icon: BookOpen },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
  { name: "Scheduling", href: "/scheduling", icon: Calendar },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border z-50 transform transition-transform duration-200 ease-in-out",
        "md:relative md:top-0 md:h-[calc(100vh-4rem)] md:transform-none",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="font-semibold text-foreground">Navigation</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="px-4 py-2">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};
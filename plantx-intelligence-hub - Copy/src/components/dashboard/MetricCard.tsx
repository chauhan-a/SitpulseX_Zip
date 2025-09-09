import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "default" | "success" | "warning" | "destructive";
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  color = "default" 
}: MetricCardProps) => {
  const colorClasses = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning", 
    destructive: "text-destructive"
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {trend && (
                <span className={`text-xs font-medium ${
                  trend.isPositive ? "text-success" : "text-destructive"
                }`}>
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={`rounded-full p-3 bg-muted ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  className?: string;
}

export const StatCard = ({ label, value, className }: StatCardProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};

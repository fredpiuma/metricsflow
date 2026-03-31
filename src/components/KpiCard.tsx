import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

const KpiCard = ({ label, value, icon, className }: KpiCardProps) => {
  return (
    <Card className={cn("overflow-hidden border-none shadow-sm bg-white dark:bg-slate-900", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {label}
            </p>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {value}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KpiCard;
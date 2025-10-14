// import { LucideIcon } from "lucide-react";
// import { Card } from "../../components/ui/card";
// import { cn } from "../../lib/utils";

// interface KPICardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   trend?: {
//     value: string;
//     positive: boolean;
//   };
//   variant?: "default" | "success" | "warning" | "danger";
// }

// export function KPICard({ title, value, icon: Icon, trend, variant = "default" }: KPICardProps) {
//   const variantStyles = {
//     default: "border-l-primary",
//     success: "border-l-success",
//     warning: "border-l-warning",
//     danger: "border-l-danger",
//   };

//   return (
//     <Card className={cn(
//       "p-6 border-l-4 shadow-card hover:shadow-card-hover transition-smooth",
//       variantStyles[variant]
//     )}>
//       <div className="flex items-start justify-between">
//         <div className="flex-1">
//           <p className="text-sm font-medium text-muted-foreground mb-1">
//             {title}
//           </p>
//           <p className="text-3xl font-bold text-foreground">
//             {value}
//           </p>
//           {trend && (
//             <p className={cn(
//               "text-sm mt-2",
//               trend.positive ? "text-success" : "text-danger"
//             )}>
//               {trend.positive ? "↑" : "↓"} {trend.value}
//             </p>
//           )}
//         </div>
//         <div className="p-3 rounded-lg bg-primary/10">
//           <Icon className="h-6 w-6 text-primary" />
//         </div>
//       </div>
//     </Card>
//   );
// }


import React from "react";
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: "default" | "success" | "warning";
  className?: string;
  iconPosition?: "left" | "right"; // ✅ NEW
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
  iconPosition = "left", // default left
}) => {
  const colorMap = {
    default: "text-blue-600",
    success: "text-green-600",
    warning: "text-amber-600",
  };

  return (
    <Card
      className={cn(
        "flex items-center p-5 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
        className
      )}
    >
      {iconPosition === "left" && (
        <div
          className={cn(
            "p-3 rounded-full bg-white/70 shadow-inner mr-4 flex-shrink-0",
            colorMap[variant]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}

      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p
            className={cn(
              "text-xs mt-1",
              trend.positive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.value}
          </p>
        )}
      </div>

      {iconPosition === "right" && (
        <div
          className={cn(
            "p-3 rounded-full bg-white/70 shadow-inner ml-4 flex-shrink-0",
            colorMap[variant]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </Card>
  );
};


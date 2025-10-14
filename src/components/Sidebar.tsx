import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookTemplate, Network, Package, FileText, User } from "lucide-react";
import { cn } from "../lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Template", href: "/template", icon: BookTemplate },
  { name: "Capabilities", href: "/capabilities", icon: Network },
  { name: "Applications", href: "/applications", icon: Package },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Profile", href: "/profile", icon: User },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          CapabilityHub
        </h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">
          Enterprise Product Management
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

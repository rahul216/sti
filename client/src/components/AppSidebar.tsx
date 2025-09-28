import { Database, Dna, Network, Search, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Data Explorer",
    url: "/",
    icon: Search,
    description: "Search and filter datasets"
  },
  {
    title: "Resistance Predictor",
    url: "/resistance",
    icon: Dna,
    description: "AI-powered resistance analysis"
  },
  {
    title: "Interaction Visualizer", 
    url: "/interactions",
    icon: Network,
    description: "Network visualization"
  },
  {
    title: "Dataset Manager",
    url: "/datasets",
    icon: Database,
    description: "Upload and organize data"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Platform configuration"
  }
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary">
            STI Pathogen Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <div>
                          <span className="font-medium">{item.title}</span>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
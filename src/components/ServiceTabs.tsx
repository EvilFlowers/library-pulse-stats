import { cn } from "@/lib/utils";
import { useState } from "react";

const tabs = [
  { id: "online", label: "在线服务" },
  { id: "borrow", label: "借还管理" },
  { id: "search", label: "图书查询" },
  { id: "rating", label: "图书评价" },
];

export const ServiceTabs = () => {
  const [activeTab, setActiveTab] = useState("borrow");

  return (
    <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto bg-card">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-colors",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:bg-gradient-to-r after:from-primary after:to-accent after:rounded-full after:-mb-3"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

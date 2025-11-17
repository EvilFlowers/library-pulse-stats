import { Home, MoreHorizontal } from "lucide-react";

export const LibraryHeader = () => {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Home className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-lg font-semibold text-foreground">图书馆统计</h1>
        <MoreHorizontal className="h-6 w-6 text-muted-foreground" />
      </div>
    </header>
  );
};

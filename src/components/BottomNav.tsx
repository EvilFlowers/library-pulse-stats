import { Link, useSearchParams } from "react-router-dom";
import { Home, BookOpen, BarChart3, User } from "lucide-react";

export const BottomNav = () => {
  const [params] = useSearchParams();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";
  const token = params.get("token");
  const q = `?role=${role}${token ? `&token=${token}` : ""}`;
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16">
        <Link to={`/${q}`} className="flex flex-col items-center gap-1 text-primary">
          <Home className="h-5 w-5" />
          <span className="text-xs">首页</span>
        </Link>
        <Link to={`/search${q}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
          <BookOpen className="h-5 w-5" />
          <span className="text-xs">图书</span>
        </Link>
        <Link to={`/statistics${q}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">统计</span>
        </Link>
        <Link to={`/borrow${q}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
          <User className="h-5 w-5" />
          <span className="text-xs">我的</span>
        </Link>
      </div>
    </nav>
  );
};

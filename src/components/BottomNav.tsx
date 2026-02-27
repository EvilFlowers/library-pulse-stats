import { Link, useSearchParams, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart3, User } from "lucide-react";

export const BottomNav = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";
  const token = params.get("token");
  const q = `?role=${role}${token ? `&token=${token}` : ""}`;
  const isActive = (target: string) => (target === "/" ? location.pathname === "/" : location.pathname.startsWith(target));
  const linkClass = (target: string) =>
    `flex flex-col items-center gap-1 ${isActive(target) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`;
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16">
        <Link to={`/${q}`} className={linkClass("/")}>
          <Home className="h-5 w-5" />
          <span className="text-xs">首页</span>
        </Link>
        <Link to={`/search${q}`} className={linkClass("/search")}>
          <BookOpen className="h-5 w-5" />
          <span className="text-xs">图书</span>
        </Link>
        <Link to={`/statistics${q}`} className={linkClass("/statistics")}>
          <BarChart3 className="h-5 w-5" />
          <span className="text-xs">统计</span>
        </Link>
        <Link to={`/borrow${q}`} className={linkClass("/borrow")}>
          <User className="h-5 w-5" />
          <span className="text-xs">我的</span>
        </Link>
      </div>
    </nav>
  );
};

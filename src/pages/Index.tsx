import { Link, useSearchParams } from "react-router-dom";
import { LibraryHeader } from "@/components/LibraryHeader";
import { ServiceTabs } from "@/components/ServiceTabs";
import { StatCard } from "@/components/StatCard";
import { CircularProgress } from "@/components/CircularProgress";
import { Card } from "@/components/ui/card";
import { BookOpen, Home, BarChart3, User } from "lucide-react";
import { useEffect, useState } from "react";
import { getCounters, getPurchaseRequests, getBorrowedBooks } from "@/lib/localdb";

const Index = () => {
  const [params] = useSearchParams();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";
  const [todaySearch, setTodaySearch] = useState(0);
  const [totalSearch, setTotalSearch] = useState(0);
  const [todayBorrow, setTodayBorrow] = useState(0);
  const [todayReturn, setTodayReturn] = useState(0);
  const [todayRenewal, setTodayRenewal] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [borrowedCount, setBorrowedCount] = useState(0);

  useEffect(() => {
    const c = getCounters();
    setTodaySearch(c.todaySearchCount);
    setTotalSearch(c.totalSearchCount);
    setTodayBorrow(c.todayBorrowCount);
    setTodayReturn(c.todayReturnCount);
    setTodayRenewal(c.todayRenewalCount);
    setPurchaseCount(getPurchaseRequests().length);
    setBorrowedCount(getBorrowedBooks().length);
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <LibraryHeader />
      <ServiceTabs />

      <main className="px-4 py-6 space-y-6 pb-20">
        {/* Key Metrics Section */}
        <section>
          <h2 className="text-base font-semibold mb-4 text-foreground">后勤数据</h2>
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <StatCard label="累计服务人次" value={(10000 + totalSearch).toLocaleString()} />
              <StatCard label="服务好评率" value="94.8%" />
              <StatCard label="当前借阅图书" value={borrowedCount.toString()} />
              <StatCard label="图书流通率" value="87.3%" />
            </div>
          </Card>
        </section>

        {/* Library Services Section */}
        <section>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary rounded-xl">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">图书馆服务</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <StatCard label="今日查询次数" value={todaySearch.toString()} />
              <StatCard label="累计查询次数" value={totalSearch.toString()} />
              <StatCard label="图书借出数" value={todayBorrow.toString()} />
              <StatCard label="图书归还数" value={todayReturn.toString()} />
              <StatCard label="续借次数" value={todayRenewal.toString()} />
              <StatCard label="采购需求" value={purchaseCount.toString()} />
            </div>
          </Card>
        </section>

        {/* Administrative Section */}
        <section>
          <Card className="p-6">
            <h3 className="text-base font-semibold mb-6 text-foreground">
              {role === "teacher" ? "教学服务数据" : role === "student" ? "学员服务数据" : "行政服务数据"}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <StatCard label="在线咨询次数" value="89" />
              <StatCard label="处理工单数" value="156" />
              <StatCard label="待办事项" value="12" />
              <StatCard label="完成率" value="92.5%" />
            </div>
          </Card>
        </section>

        {/* Rating Section */}
        <section>
          <h2 className="text-base font-semibold mb-4 text-foreground">服务评价</h2>
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-8">
              <CircularProgress 
                percentage={96} 
                label="整体评价好评率" 
              />
              <CircularProgress 
                percentage={98} 
                label="服务好评率" 
              />
            </div>
          </Card>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex justify-around items-center h-16">
          <Link to={`/?role=${role}`} className="flex flex-col items-center gap-1 text-primary">
            <Home className="h-5 w-5" />
            <span className="text-xs">首页</span>
          </Link>
          <Link to={`/search?role=${role}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">图书</span>
          </Link>
          <Link to={`/statistics?role=${role}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">统计</span>
          </Link>
          <Link to={`/borrow?role=${role}`} className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground">
            <User className="h-5 w-5" />
            <span className="text-xs">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Index;

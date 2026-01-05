import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { getBorrowedBooks, getCounters, getRatings } from "@/lib/localdb";
import { useSearchParams } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { BottomNav } from "@/components/BottomNav";

const Statistics = () => {
  const [params] = useSearchParams();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [todayBorrow, setTodayBorrow] = useState(0);
  const [monthlyData, setMonthlyData] = useState<Array<{ day: string; borrow: number }>>([]);
  useEffect(() => {
    setTotalBorrowed(getBorrowedBooks().length);
    const rs = getRatings();
    setAvgRating(rs.length ? +(rs.reduce((a, b) => a + b.rating, 0) / rs.length).toFixed(1) : 0);
    setTodayBorrow(getCounters().todayBorrowCount);
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const base = 40;
    const series = days.map((d) => {
      const v = Math.max(0, Math.round(base + 10 * Math.sin(d / 4) + 8 * Math.cos(d / 5) + (d % 7)));
      return { day: d.toString().padStart(2, "0"), borrow: v };
    });
    series[series.length - 1].borrow = Math.max(series[series.length - 1].borrow, todayBorrow);
    setMonthlyData(series);
  }, []);
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">
          统计分析（{role === "teacher" ? "教学服务" : role === "student" ? "学员服务" : "行政服务"}）
        </h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">当前借阅量</p>
            <p className="text-2xl font-bold text-foreground">{totalBorrowed}</p>
            <p className="text-xs text-primary mt-1">+0%</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">活跃用户</p>
            <p className="text-2xl font-bold text-foreground">3,247</p>
            <p className="text-xs text-primary mt-1">+8%</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">平均评分</p>
            <p className="text-2xl font-bold text-foreground">{avgRating}</p>
            <p className="text-xs text-primary mt-1">+0.2</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">日均借阅</p>
            <p className="text-2xl font-bold text-foreground">{todayBorrow}</p>
            <p className="text-xs text-primary mt-1">+15%</p>
          </Card>
        </div>

        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">日统计</TabsTrigger>
            <TabsTrigger value="monthly">月统计</TabsTrigger>
            <TabsTrigger value="yearly">年统计</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">本月借阅趋势</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="borrow" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">热门图书排行</h3>
              <div className="space-y-3">
                {[
                  { rank: 1, title: "深度学习", count: 156 },
                  { rank: 2, title: "算法导论", count: 142 },
                  { rank: 3, title: "Python编程", count: 128 },
                ].map((book) => (
                  <div key={book.rank} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{book.rank}</span>
                      </div>
                      <span className="text-sm text-foreground">{book.title}</span>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      {book.count} 次
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4">
                <CircularProgress
                  percentage={92}
                  label="在线服务占比"
                  size={120}
                />
              </Card>
              <Card className="p-4">
                <CircularProgress
                  percentage={78}
                  label="续借成功率"
                  size={120}
                />
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">今日数据</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">借出</p>
                  <p className="text-2xl font-bold text-foreground">45</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">归还</p>
                  <p className="text-2xl font-bold text-foreground">38</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">续借</p>
                  <p className="text-2xl font-bold text-foreground">12</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">新增用户</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-3">年度数据汇总</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">总借阅量</span>
                  <span className="font-semibold text-foreground">12,458</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">新增图书</span>
                  <span className="font-semibold text-foreground">856</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">活跃用户</span>
                  <span className="font-semibold text-foreground">3,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">采购需求</span>
                  <span className="font-semibold text-foreground">124</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default Statistics;

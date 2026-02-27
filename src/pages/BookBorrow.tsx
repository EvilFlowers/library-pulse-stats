import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Book, PackageSearch, FileCheck, Send, AlertCircle, Star } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBorrowedBooks, BorrowRecord, refreshDataFromRemote } from "@/lib/localdb";
import { ServerCog } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

const BookBorrow = () => {
  const [params] = useSearchParams();
  const role = useMemo(() => {
    const r = params.get("role");
    if (r === "admin" || r === "teacher" || r === "student") return r;
    return "student";
  }, [params]);
  const token = params.get("token");
  const q = `?role=${role}${token ? `&token=${token}` : ""}`;
  const [borrowed, setBorrowed] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    (async () => {
      await refreshDataFromRemote();
      setBorrowed(getBorrowedBooks());
    })();
  }, []);

  const roleLabel = role === "admin" ? "管理员" : role === "teacher" ? "教师" : "学员";

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">我的</h1>
          <Badge variant="secondary">{roleLabel}</Badge>
        </div>
      </header>

      <div className="p-4 space-y-4">
        <>
          <section>
            <h2 className="text-base font-semibold mb-3 text-foreground">快捷功能</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link to={`/renewal${q}`}>
                <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">期限与续借</h3>
                      <p className="text-sm text-muted-foreground">查看借阅期限并办理续借</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/purchase?role=${role}`}>
                <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">采购需求提交</h3>
                      <p className="text-sm text-muted-foreground">提交图书采购建议</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/rating${q}`}>
                <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">图书评价</h3>
                      <p className="text-sm text-muted-foreground">为已读图书评分与评论</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </section>
          <section>
            <h2 className="text-base font-semibold mb-3 text-foreground">我的借阅</h2>
            <Card className="p-4 bg-primary/5 border-primary/20 mb-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">当前借阅</p>
                  <p className="text-2xl font-bold text-foreground">{borrowed.length} 本</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">借阅额度</p>
                  <p className="text-2xl font-bold text-foreground">10 本</p>
                </div>
              </div>
            </Card>
            <div className="space-y-3">
              {borrowed.map((book) => (
                <Card key={book.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-primary/10 rounded flex items-center justify-center">
                      <Book className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{book.title}</h3>
                      <p className="text-sm text-muted-foreground">{book.author}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">借出: {book.borrowDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">到期: {book.dueDate}</span>
                        </div>
                      </div>
                      <Badge 
                        variant={book.status === "即将到期" ? "destructive" : "default"} 
                        className="mt-2"
                      >
                        {book.status === "即将到期" && <AlertCircle className="h-3 w-3 mr-1 inline" />}
                        {book.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/renewal?role=${role}`}>续借</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link to={`/return?role=${role}`}>归还</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
          {role === "admin" && (
            <section>
              <h2 className="text-base font-semibold mb-3 text-foreground">管理功能</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link to={`/inventory?role=${role}`}>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <PackageSearch className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">盘点管理</h3>
                        <p className="text-sm text-muted-foreground">自动化图书盘点与统计</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                <Link to={`/review${q}`}>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">采购审核</h3>
                        <p className="text-sm text-muted-foreground">审核图书采购需求</p>
                      </div>
                    </div>
                  </Card>
                </Link>
                <Link to={`/remote${q}`}>
                  <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <ServerCog className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">远程管理</h3>
                        <p className="text-sm text-muted-foreground">系统设置、公告与数据维护</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </section>
          )}
        </>
      </div>
      <BottomNav />
    </div>
  );
};

export default BookBorrow;

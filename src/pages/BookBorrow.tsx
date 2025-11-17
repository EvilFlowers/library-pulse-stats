import { useState } from "react";
import { Calendar, Clock, Book, RotateCcw, PackageSearch, FileCheck, Send, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockBorrowedBooks = [
  { id: 1, title: "深度学习", author: "Ian Goodfellow", borrowDate: "2024-01-15", dueDate: "2024-02-15", status: "借阅中" },
  { id: 2, title: "算法导论", author: "Thomas H. Cormen", borrowDate: "2024-01-20", dueDate: "2024-02-20", status: "借阅中" },
  { id: 3, title: "Python编程", author: "Eric Matthes", borrowDate: "2024-01-10", dueDate: "2024-02-10", status: "即将到期" },
];

const BookBorrow = () => {
  const [role, setRole] = useState<"reader" | "staff">("reader");

  const toggleRole = () => {
    setRole(prev => prev === "reader" ? "staff" : "reader");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">我的</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleRole}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            切换到{role === "reader" ? "员工" : "读者"}
          </Button>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {role === "reader" ? (
          <>
            {/* 读者菜单 */}
            <section>
              <h2 className="text-base font-semibold mb-3 text-foreground">快捷功能</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/renewal">
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
                <Link to="/purchase">
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
              </div>
            </section>

            {/* 我的借阅 */}
            <section>
              <h2 className="text-base font-semibold mb-3 text-foreground">我的借阅</h2>
              <Card className="p-4 bg-primary/5 border-primary/20 mb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">当前借阅</p>
                    <p className="text-2xl font-bold text-foreground">3 本</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">借阅额度</p>
                    <p className="text-2xl font-bold text-foreground">10 本</p>
                  </div>
                </div>
              </Card>
              <div className="space-y-3">
                {mockBorrowedBooks.map((book) => (
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
                          <Link to="/renewal">续借</Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link to="/return">归还</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            {/* 员工菜单 */}
            <section>
              <h2 className="text-base font-semibold mb-3 text-foreground">管理功能</h2>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/inventory">
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
                <Link to="/review">
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
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default BookBorrow;

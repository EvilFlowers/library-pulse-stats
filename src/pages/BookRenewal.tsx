import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getBorrowedBooks, renewBook, BorrowRecord, refreshDataFromRemote } from "@/lib/localdb";
import { useSearchParams } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const BookRenewal = () => {
  const [books, setBooks] = useState<BorrowRecord[]>([]);
  const [params] = useSearchParams();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";

  useEffect(() => {
    (async () => {
      await refreshDataFromRemote();
      setBooks(getBorrowedBooks());
    })();
  }, []);

  const canRenew = (b: BorrowRecord) => b.renewalCount < b.maxRenewal;

  const handleRenewal = (bookId: number, bookTitle: string) => {
    const ok = renewBook(bookId);
    if (ok) {
      toast({ title: "续借成功", description: `《${bookTitle}》已成功续借30天` });
      setBooks(getBorrowedBooks());
    } else {
      toast({ title: "不可续借", description: "已达到续借上限", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">期限与续借（{role === "teacher" ? "教师" : role === "student" ? "学员" : "管理员"}）</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4 bg-accent/50">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-foreground">续借规则</p>
              <p className="text-sm text-muted-foreground mt-1">
                每本图书最多可续借3次，每次续借期限为30天。到期前7天可申请续借。
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          {books.map((book) => {
            const daysUntilDue = Math.ceil((new Date(book.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 7 && daysUntilDue >= 0;

            return (
              <Card key={book.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground">{book.title}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          到期日期: {book.dueDate}
                        </span>
                      </div>
                    </div>
                    {canRenew(book) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant={isOverdue ? "destructive" : isDueSoon ? "outline" : "secondary"}>
                        {isOverdue ? "已逾期" : isDueSoon ? `${daysUntilDue}天后到期` : "借阅中"}
                      </Badge>
                      <Badge variant="outline">
                        已续借 {book.renewalCount}/{book.maxRenewal}
                      </Badge>
                    </div>
                    <Button size="sm" disabled={!canRenew(book)} onClick={() => handleRenewal(book.bookId, book.title)}>
                      {canRenew(book) ? "续借" : "不可续借"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BookRenewal;

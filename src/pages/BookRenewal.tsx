import { Calendar, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const mockRenewalBooks = [
  { id: 1, title: "深度学习", dueDate: "2024-02-15", renewalCount: 1, maxRenewal: 3, canRenew: true },
  { id: 2, title: "算法导论", dueDate: "2024-02-20", renewalCount: 2, maxRenewal: 3, canRenew: true },
  { id: 3, title: "Python编程", dueDate: "2024-02-10", renewalCount: 3, maxRenewal: 3, canRenew: false },
];

const BookRenewal = () => {
  const handleRenewal = (bookTitle: string) => {
    toast({
      title: "续借成功",
      description: `《${bookTitle}》已成功续借30天`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">期限与续借</h1>
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
          {mockRenewalBooks.map((book) => {
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
                    {book.canRenew ? (
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
                    <Button 
                      size="sm" 
                      disabled={!book.canRenew}
                      onClick={() => handleRenewal(book.title)}
                    >
                      {book.canRenew ? "续借" : "不可续借"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BookRenewal;

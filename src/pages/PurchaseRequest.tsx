import { useEffect, useState } from "react";
import { Send, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getPurchaseRequests, submitPurchaseRequest, PurchaseRequest as PR, refreshDataFromRemote } from "@/lib/localdb";
import { useSearchParams } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const PurchaseRequest = () => {
  const [formData, setFormData] = useState({
    bookTitle: "",
    author: "",
    isbn: "",
    reason: "",
  });
  const [requests, setRequests] = useState<PR[]>([]);
  const [params] = useSearchParams();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";

  const refreshLocal = () => setRequests(getPurchaseRequests());
  useEffect(() => {
    (async () => {
      await refreshDataFromRemote();
      refreshLocal();
    })();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPurchaseRequest(formData);
    toast({ title: "提交成功", description: "您的采购需求已提交，我们会尽快处理" });
    refreshLocal();
    setFormData({ bookTitle: "", author: "", isbn: "", reason: "" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">采购需求提交（{role === "teacher" ? "教师" : role === "student" ? "学员" : "管理员"}）</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookTitle">书名 *</Label>
              <Input
                id="bookTitle"
                placeholder="请输入书名"
                value={formData.bookTitle}
                onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                placeholder="请输入作者"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                placeholder="请输入ISBN号"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">需求理由 *</Label>
              <Textarea
                id="reason"
                placeholder="请说明您需要这本书的理由..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                required
                className="min-h-24"
              />
            </div>

            <Button type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              提交需求
            </Button>
          </form>
        </Card>

        <div>
          <h3 className="font-semibold text-foreground mb-3">我的采购需求</h3>
          <div className="space-y-3">
            {requests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{request.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      提交时间: {request.submittedDate}
                    </p>
                    <Badge 
                      variant={
                        request.status === "已采购" ? "default" : 
                        request.status === "已批准" ? "secondary" : 
                        "outline"
                      }
                      className="mt-2"
                    >
                      {request.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default PurchaseRequest;

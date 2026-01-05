import { FileCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { getPurchaseRequests } from "@/lib/localdb";
import { useSearchParams } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const ResourceReview = () => {
  const [pendingReviews, setPendingReviews] = useState<Array<{ id: number; title: string; submitter: string; submittedDate: string; type: string }>>([]);
  const [reviewedItems, setReviewedItems] = useState<Array<{ id: number; title: string; reviewer: string; reviewDate: string; status: string }>>([]);
  const [params] = useSearchParams();
  const role = params.get("role") === "admin" || params.get("role") === "teacher" || params.get("role") === "student" ? params.get("role")! : "student";

  const refresh = () => {
    const reqs = getPurchaseRequests();
    const pending = reqs.filter(r => r.status === "审核中").map(r => ({
      id: r.id,
      title: r.title,
      submitter: "用户",
      submittedDate: r.submittedDate,
      type: "采购需求",
    }));
    const reviewed = reqs.filter(r => r.status !== "审核中").map(r => ({
      id: r.id,
      title: r.title,
      reviewer: "管理员",
      reviewDate: r.submittedDate,
      status: r.status === "已批准" ? "已通过" : "已拒绝",
    }));
    setPendingReviews(pending);
    setReviewedItems(reviewed);
  };

  useEffect(() => {
    refresh();
  }, []);
  const handleApprove = (title: string) => {
    toast({
      title: "审核通过",
      description: `《${title}》已通过审核`,
    });
  };

  const handleReject = (title: string) => {
    toast({
      title: "审核拒绝",
      description: `《${title}》已被拒绝`,
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">资源审核（{role === "teacher" ? "教师" : role === "student" ? "学员" : "管理员"}）</h1>
      </header>

      <div className="p-4">
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">待审核</TabsTrigger>
            <TabsTrigger value="reviewed">已审核</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-3">
            <Card className="p-4 bg-accent/50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <p className="text-sm text-foreground">
                  当前有 <span className="font-bold">{pendingReviews.length}</span> 项待审核
                </p>
              </div>
            </Card>

            {pendingReviews.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FileCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          提交人: {item.submitter}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          提交时间: {item.submittedDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => handleApprove(item.title)}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      通过
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleReject(item.title)}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      拒绝
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="reviewed" className="space-y-3">
            {reviewedItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        审核人: {item.reviewer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        审核时间: {item.reviewDate}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.status === "已通过" ? "default" : "destructive"}>
                    {item.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </div>
  );
};

export default ResourceReview;

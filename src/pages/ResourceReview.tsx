import { FileCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const pendingReviews = [
  { id: 1, title: "人工智能导论", submitter: "张三", submittedDate: "2024-01-20", type: "新书推荐" },
  { id: 2, title: "数据结构与算法", submitter: "李四", submittedDate: "2024-01-19", type: "采购需求" },
  { id: 3, title: "计算机网络", submitter: "王五", submittedDate: "2024-01-18", type: "新书推荐" },
];

const reviewedItems = [
  { id: 1, title: "深度学习实战", reviewer: "管理员", reviewDate: "2024-01-15", status: "已通过" },
  { id: 2, title: "机器学习算法", reviewer: "管理员", reviewDate: "2024-01-14", status: "已拒绝" },
];

const ResourceReview = () => {
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
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">资源审核</h1>
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
    </div>
  );
};

export default ResourceReview;

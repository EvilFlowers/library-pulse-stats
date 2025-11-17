import { Package, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const inventoryTasks = [
  { id: 1, area: "A区-3楼", total: 1500, completed: 1500, missing: 0, status: "已完成" },
  { id: 2, area: "A区-2楼", total: 1800, completed: 1650, missing: 3, status: "进行中" },
  { id: 3, area: "B区-1楼", total: 2000, completed: 0, missing: 0, status: "待开始" },
];

const missingBooks = [
  { id: 1, title: "深度学习", location: "A区-301", lastSeen: "2024-01-10" },
  { id: 2, title: "算法导论", location: "A区-205", lastSeen: "2024-01-08" },
  { id: 3, title: "机器学习实战", location: "A区-308", lastSeen: "2024-01-12" },
];

const AutoInventory = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">自动化盘点</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">总藏书</p>
              <p className="text-2xl font-bold text-foreground">5,300</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已盘点</p>
              <p className="text-2xl font-bold text-primary">3,150</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">异常</p>
              <p className="text-2xl font-bold text-destructive">3</p>
            </div>
          </div>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-foreground">盘点任务</h3>
            <Button size="sm">开始新任务</Button>
          </div>
          <div className="space-y-3">
            {inventoryTasks.map((task) => {
              const progress = (task.completed / task.total) * 100;
              return (
                <Card key={task.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{task.area}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.completed}/{task.total} 本
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          task.status === "已完成" ? "default" :
                          task.status === "进行中" ? "secondary" :
                          "outline"
                        }
                      >
                        {task.status === "已完成" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {task.status === "进行中" && <Clock className="h-3 w-3 mr-1" />}
                        {task.status}
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                    {task.missing > 0 && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <span>发现 {task.missing} 本异常图书</span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            异常图书列表
          </h3>
          <div className="space-y-3">
            {missingBooks.map((book) => (
              <Card key={book.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground">{book.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      位置: {book.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      最后记录: {book.lastSeen}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">处理</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoInventory;

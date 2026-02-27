import { Package, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { getInventoryTasks, getMissingBooks, InventoryTask, MissingBook, refreshDataFromRemote, startNextInventoryTask, resolveMissingBook, createInventoryTask } from "@/lib/localdb";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const AutoInventory = () => {
  const queryClient = useQueryClient();
  const { data: tasks = [] } = useQuery({
    queryKey: ["inventoryTasks"],
    queryFn: async () => {
      await refreshDataFromRemote();
      return getInventoryTasks();
    },
    initialData: getInventoryTasks(),
  });
  const { data: abnormal = [] } = useQuery({
    queryKey: ["missingBooks"],
    queryFn: async () => {
      await refreshDataFromRemote();
      return getMissingBooks();
    },
    initialData: getMissingBooks(),
  });
  const [confirmStartOpen, setConfirmStartOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const [resolveTarget, setResolveTarget] = useState<MissingBook | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [zone, setZone] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [total, setTotal] = useState<string>("");

  useEffect(() => {
    (async () => {
      await refreshDataFromRemote();
      queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
      queryClient.setQueryData(["missingBooks"], [...getMissingBooks()]);
    })();
  }, [queryClient]);

  const totalSum = tasks.reduce((s, t) => s + t.total, 0);
  const completedSum = tasks.reduce((s, t) => s + t.completed, 0);
  const abnormalCount = abnormal.length;

  const startTaskMutation = useMutation({
    mutationFn: async () => {
      const ok = await startNextInventoryTask();
      if (!ok) throw new Error("start task failed");
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["inventoryTasks"] });
      await queryClient.cancelQueries({ queryKey: ["missingBooks"] });
      const prevTasks = queryClient.getQueryData<InventoryTask[]>(["inventoryTasks"]);
      const prevMissing = queryClient.getQueryData<MissingBook[]>(["missingBooks"]);
      queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
      queryClient.setQueryData(["missingBooks"], [...getMissingBooks()]);
      return { prevTasks, prevMissing };
    },
    onError: (_, __, ctx) => {
      if (ctx?.prevTasks) queryClient.setQueryData(["inventoryTasks"], ctx.prevTasks);
      if (ctx?.prevMissing) queryClient.setQueryData(["missingBooks"], ctx.prevMissing);
    },
    onSuccess: async () => {
      toast({ title: "已启动新的盘点任务" });
      await refreshDataFromRemote();
      queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
      queryClient.setQueryData(["missingBooks"], [...getMissingBooks()]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["inventoryTasks"] });
      queryClient.invalidateQueries({ queryKey: ["missingBooks"] });
    },
  });
  const handleStartConfirm = async () => {
    startTaskMutation.mutate();
    setConfirmStartOpen(false);
  };

  const handleResolve = async (id: number) => {
    const ok = await resolveMissingBook(id);
    if (!ok) return;
    const currentAbnormal = queryClient.getQueryData<MissingBook[]>(["missingBooks"]) || [];
    queryClient.setQueryData(["missingBooks"], currentAbnormal.filter(b => b.id !== id));
    queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
    toast({ title: "异常图书已处理" });
    const refreshed = await refreshDataFromRemote();
    if (refreshed) {
      queryClient.setQueryData(["missingBooks"], [...getMissingBooks()]);
      queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
    }
  };
  const handleResolveConfirm = async () => {
    if (!resolveTarget) return;
    await handleResolve(resolveTarget.id);
    setResolveOpen(false);
    setResolveTarget(null);
  };

  const handleCreateTask = async () => {
    const z = zone.trim();
    const f = Number(floor);
    const t = Number(total);
    if (!z || isNaN(f) || f <= 0 || isNaN(t) || t <= 0) {
      toast({ title: "请填写完整且有效的信息", variant: "destructive" });
      return;
    }
    const id = await createInventoryTask(z, f, t);
    if (!id) {
      toast({ title: "创建失败，请稍后重试", variant: "destructive" });
      return;
    }
    toast({ title: "盘点任务已创建" });
    setZone("");
    setFloor("");
    setTotal("");
    setCreateOpen(false);
    queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
    (async () => {
      await refreshDataFromRemote();
      queryClient.setQueryData(["inventoryTasks"], [...getInventoryTasks()]);
    })();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">自动化盘点</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">总藏书</p>
              <p className="text-2xl font-bold text-foreground">{totalSum.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已盘点</p>
              <p className="text-2xl font-bold text-primary">{completedSum.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">异常</p>
              <p className="text-2xl font-bold text-destructive">{abnormalCount}</p>
            </div>
          </div>
        </Card>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-foreground">盘点任务</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setConfirmStartOpen(true)}>开始新任务</Button>
              <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>新建任务</Button>
            </div>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => {
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
            {abnormal.map((book) => (
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setResolveTarget(book);
                      setResolveOpen(true);
                    }}
                  >
                    处理
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
      <AlertDialog open={confirmStartOpen} onOpenChange={setConfirmStartOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>开始新任务</AlertDialogTitle>
            <AlertDialogDescription>将启动首个“待开始”的盘点任务，是否继续？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartConfirm}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={resolveOpen} onOpenChange={setResolveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>处理异常图书</AlertDialogTitle>
            <AlertDialogDescription>
              {resolveTarget ? `确认处理「${resolveTarget.title}」并移除异常记录？` : "确认处理该异常图书？"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleResolveConfirm}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新建盘点任务</DialogTitle>
            <DialogDescription>填写库区、楼层与总量以创建新任务</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">库区</Label>
              <div className="col-span-3">
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择库区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A区</SelectItem>
                    <SelectItem value="B">B区</SelectItem>
                    <SelectItem value="C">C区</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">楼层</Label>
              <Input
                className="col-span-3"
                type="number"
                min={1}
                placeholder="例如：3"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">总量</Label>
              <Input
                className="col-span-3"
                type="number"
                min={1}
                placeholder="例如：1500"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>取消</Button>
            <Button onClick={handleCreateTask}>创建</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutoInventory;

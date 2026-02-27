import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { getRemoteSettings, updateRemoteSettings, getAnnouncements, addAnnouncement, exportAllData, importAllData, clearAllData, bootstrapLocalData, refreshDataFromRemote } from "@/lib/localdb";
import { useSearchParams } from "react-router-dom";

const RemoteManagement = () => {
  const [params] = useSearchParams();
  const role = useMemo(() => {
    const r = params.get("role");
    if (r === "admin" || r === "teacher" || r === "student") return r;
    return "admin";
  }, [params]);
  const [settings, setSettings] = useState(getRemoteSettings());
  const [announcements, setAnnouncements] = useState(getAnnouncements());
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      await refreshDataFromRemote();
      setSettings(getRemoteSettings());
      setAnnouncements(getAnnouncements());
    })();
  }, []);

  const handleToggle = (key: "maintenanceMode" | "allowRemoteBorrow", value: boolean) => {
    const next = updateRemoteSettings({ [key]: value });
    setSettings(next);
    toast({ title: "设置已更新" });
  };

  const handleAddAnnouncement = () => {
    if (!title.trim()) {
      toast({ title: "请输入标题", variant: "destructive" });
      return;
    }
    addAnnouncement(title.trim(), content.trim());
    setAnnouncements(getAnnouncements());
    setTitle("");
    setContent("");
    toast({ title: "公告已发布" });
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "library_pulse_export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "数据已导出" });
  };

  const handleImport = async (file?: File) => {
    try {
      const f = file || fileInputRef.current?.files?.[0];
      if (!f) {
        toast({ title: "请选择文件", variant: "destructive" });
        return;
      }
      const text = await f.text();
      const payload = JSON.parse(text);
      importAllData(payload);
      setSettings(getRemoteSettings());
      setAnnouncements(getAnnouncements());
      toast({ title: "数据已导入" });
    } catch {
      toast({ title: "导入失败", variant: "destructive" });
    }
  };

  const handleClear = () => {
    clearAllData();
    bootstrapLocalData();
    setSettings(getRemoteSettings());
    setAnnouncements(getAnnouncements());
    toast({ title: "数据已重置" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">远程管理（{role === "admin" ? "管理员" : role === "teacher" ? "教师" : "学员"}）</h1>
      </header>

      <div className="p-4">
        <Tabs defaultValue="settings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">系统设置</TabsTrigger>
            <TabsTrigger value="announcements">公告管理</TabsTrigger>
            <TabsTrigger value="data">数据维护</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">维护模式</p>
                  <p className="text-sm text-muted-foreground">开启后系统进入维护状态</p>
                </div>
                <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => handleToggle("maintenanceMode", v)} />
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">允许远程借阅</p>
                  <p className="text-sm text-muted-foreground">允许通过在线服务进行借阅操作</p>
                </div>
                <Switch checked={settings.allowRemoteBorrow} onCheckedChange={(v) => handleToggle("allowRemoteBorrow", v)} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-4">
            <Card className="p-4 space-y-3">
              <Input placeholder="公告标题" value={title} onChange={(e) => setTitle(e.target.value)} />
              <Textarea placeholder="公告内容" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-24" />
              <Button onClick={handleAddAnnouncement} className="w-full">发布公告</Button>
            </Card>
            <div className="space-y-3">
              {announcements.map(a => (
                <Card key={a.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{a.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{a.content}</p>
                    </div>
                    <Badge variant="outline">{a.date}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={handleExport}>导出全部数据</Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>导入数据</Button>
                <input ref={fileInputRef} type="file" className="hidden" accept="application/json" onChange={(e) => handleImport(e.target.files?.[0])} />
                <Button variant="destructive" onClick={handleClear}>清空并重置数据</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* 远程管理页不显示底部导航，保持纯管理视图；如需显示可引入 BottomNav */}
    </div>
  );
};

export default RemoteManagement;

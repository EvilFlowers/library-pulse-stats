import { QrCode, MapPin, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const returnLocations = [
  { id: 1, name: "图书馆一楼总服务台", status: "正常开放", hours: "8:00-22:00" },
  { id: 2, name: "图书馆三楼自助还书机", status: "正常开放", hours: "24小时" },
  { id: 3, name: "东区宿舍还书点", status: "正常开放", hours: "9:00-18:00" },
];

const BookReturn = () => {
  const handleReturn = () => {
    toast({
      title: "归还成功",
      description: "图书已成功归还，感谢您的使用",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">图书归还</h1>
      </header>

      <div className="p-4 space-y-4">
        <Card className="p-6 text-center">
          <div className="w-48 h-48 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <QrCode className="h-32 w-32 text-primary" />
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">扫码归还</h3>
          <p className="text-sm text-muted-foreground mb-4">
            请在还书点扫描此二维码完成归还
          </p>
          <Button onClick={handleReturn} className="w-full">确认归还</Button>
        </Card>

        <div>
          <h3 className="font-semibold text-foreground mb-3">归还地点</h3>
          <div className="space-y-3">
            {returnLocations.map((location) => (
              <Card key={location.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{location.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">开放时间: {location.hours}</p>
                    <Badge variant="default" className="mt-2">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {location.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReturn;

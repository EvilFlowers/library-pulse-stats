import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Book, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchBooks, borrowBook, Book as BookType } from "@/lib/localdb";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [books, setBooks] = useState<BookType[]>([]);
  const [params] = useSearchParams();
  const role = useMemo(() => {
    const r = params.get("role");
    if (r === "admin" || r === "teacher" || r === "student") return r;
    return "student";
  }, [params]);

  useEffect(() => {
    setBooks(searchBooks(searchTerm, category));
  }, [searchTerm, category]);

  const handleBorrow = (id: number, title: string) => {
    const ok = borrowBook(id);
    if (ok) {
      toast({ title: "借阅成功", description: `《${title}》已加入我的借阅` });
      setBooks(searchBooks(searchTerm, category));
    } else {
      toast({ title: "无法借阅", description: "当前状态不可借阅", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">在线检索（{role === "teacher" ? "教师" : role === "student" ? "学员" : "管理员"}）</h1>
      </header>

      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索书名、作者、ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部分类</SelectItem>
              <SelectItem value="计算机科学">计算机科学</SelectItem>
              <SelectItem value="科技">科技</SelectItem>
              <SelectItem value="文学">文学</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {books.map((book) => (
            <Card key={book.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-16 h-20 bg-primary/10 rounded flex items-center justify-center">
                  <Book className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{book.category}</Badge>
                    <Badge variant={book.status === "可借" ? "default" : "outline"}>
                      {book.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      <span className="text-foreground">{book.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">位置: {book.location}</p>
                </div>
                <Button size="sm" disabled={book.status !== "可借"} onClick={() => handleBorrow(book.id, book.title)}>借阅</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default BookSearch;
 

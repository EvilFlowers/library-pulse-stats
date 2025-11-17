import { useState } from "react";
import { Search, Filter, Book, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockBooks = [
  { id: 1, title: "深度学习", author: "Ian Goodfellow", category: "计算机科学", status: "可借", rating: 4.8, location: "A区-301" },
  { id: 2, title: "人工智能简史", author: "尼克", category: "科技", status: "已借出", rating: 4.5, location: "A区-205" },
  { id: 3, title: "算法导论", author: "Thomas H. Cormen", category: "计算机科学", status: "可借", rating: 4.9, location: "A区-310" },
  { id: 4, title: "机器学习实战", author: "Peter Harrington", category: "计算机科学", status: "可借", rating: 4.6, location: "A区-308" },
];

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">在线检索</h1>
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
              <SelectItem value="cs">计算机科学</SelectItem>
              <SelectItem value="tech">科技</SelectItem>
              <SelectItem value="literature">文学</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {mockBooks.map((book) => (
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
                <Button size="sm" disabled={book.status !== "可借"}>借阅</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSearch;

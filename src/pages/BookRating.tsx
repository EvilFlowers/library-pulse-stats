import { useState } from "react";
import { Star, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockReadBooks = [
  { id: 1, title: "深度学习", author: "Ian Goodfellow", rated: false },
  { id: 2, title: "算法导论", author: "Thomas H. Cormen", rated: true, rating: 5 },
  { id: 3, title: "Python编程", author: "Eric Matthes", rated: false },
];

const BookRating = () => {
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        title: "请选择评分",
        description: "请先为图书打分",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "评价成功",
      description: "感谢您的评价！",
    });
    setSelectedBook(null);
    setRating(0);
    setReview("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <h1 className="text-2xl font-bold text-foreground">图书评价</h1>
      </header>

      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold text-foreground mb-3">待评价图书</h3>
          <div className="space-y-3">
            {mockReadBooks.map((book) => (
              <Card 
                key={book.id} 
                className={cn(
                  "p-4 cursor-pointer transition-colors",
                  selectedBook === book.id && "border-primary"
                )}
                onClick={() => !book.rated && setSelectedBook(book.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-foreground">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    {book.rated && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < (book.rating || 0) ? "fill-primary text-primary" : "text-muted"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <Badge variant={book.rated ? "secondary" : "default"}>
                    {book.rated ? "已评价" : "待评价"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedBook && (
          <Card className="p-4 space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-2">您的评分</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 cursor-pointer transition-colors",
                        (hoveredRating >= star || rating >= star)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-2">评价内容（可选）</h4>
              <Textarea
                placeholder="分享您的阅读感受..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-24"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              提交评价
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BookRating;

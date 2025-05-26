import Link from "next/link"
import { Search, Bookmark, Home, User, TrendingUp, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">밈 저장소</h1>
          <Link href="/bookmarks">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">북마크</span>
            </Button>
          </Link>
        </div>
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="밈 검색하기..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto py-2 mt-2">
          <Badge variant="outline" className="cursor-pointer">
            인기 밈
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            리액션
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            유행어
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            드라마
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            영화
          </Badge>
          <Badge variant="outline" className="cursor-pointer">
            애니메이션
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Tabs defaultValue="trending">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="trending">인기</TabsTrigger>
            <TabsTrigger value="recent">최신</TabsTrigger>
            <TabsTrigger value="categories">카테고리</TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-4">
            {/* Meme Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Link href={`/meme/${item}`} key={item}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0 relative">
                      <img
                        src={`/placeholder.svg?height=200&width=200&text=밈${item}`}
                        alt={`밈 ${item}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate">인기 밈 #{item}</span>
                          <span className="text-xs flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {item * 123}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-[10px] h-4">
                            리액션
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] h-4">
                            유행어
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-2 gap-4">
              {[7, 8, 9, 10, 11, 12].map((item) => (
                <Link href={`/meme/${item}`} key={item}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0 relative">
                      <img
                        src={`/placeholder.svg?height=200&width=200&text=최신밈${item}`}
                        alt={`밈 ${item}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate">최신 밈 #{item}</span>
                          <span className="text-xs flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {item * 45}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-[10px] h-4">
                            드라마
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] h-4">
                            영화
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-2 gap-4">
              {["리액션", "유행어", "드라마", "영화", "애니메이션", "게임"].map((category) => (
                <Link href={`/category/${category}`} key={category}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0 relative">
                      <div className="h-24 bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center">
                        <Tag className="h-10 w-10 text-white" />
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          밈 {Math.floor(Math.random() * 100) + 20}개
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t bg-background p-2">
        <div className="flex justify-around">
          <Button variant="ghost" className="flex flex-col h-auto py-2">
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">홈</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto py-2">
            <Search className="h-5 w-5" />
            <span className="text-xs mt-1">검색</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto py-2">
            <Bookmark className="h-5 w-5" />
            <span className="text-xs mt-1">북마크</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto py-2">
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">프로필</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}

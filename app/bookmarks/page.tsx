import Link from "next/link"
import { ArrowLeft, Bookmark, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookmarksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">뒤로가기</span>
            </Button>
          </Link>
          <h1 className="text-lg font-medium">내 북마크</h1>
          <div className="w-9"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="collections">컬렉션</TabsTrigger>
            <TabsTrigger value="recent">최근 저장</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <Link href={`/meme/${item}`} key={item}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0 relative">
                      <img
                        src={`/placeholder.svg?height=200&width=200&text=북마크${item}`}
                        alt={`밈 ${item}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Bookmark className="h-5 w-5 fill-white stroke-white" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-xs truncate">북마크 밈 #{item}</span>
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

          <TabsContent value="collections">
            <div className="space-y-4">
              <Card>
                <CardContent className="p-3">
                  <h3 className="font-medium mb-2">리액션 모음</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=80&width=80&text=리액션${item}`}
                          alt={`리액션 ${item}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">밈 8개</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3">
                  <h3 className="font-medium mb-2">드라마 밈</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={`/placeholder.svg?height=80&width=80&text=드라마${item}`}
                          alt={`드라마 ${item}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">밈 6개</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <Link href={`/meme/${item}`} key={item}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className="w-20 h-20">
                          <img
                            src={`/placeholder.svg?height=80&width=80&text=최근${item}`}
                            alt={`밈 ${item}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1">
                          <h3 className="font-medium">최근 저장 밈 #{item}</h3>
                          <div className="flex gap-1 mt-1">
                            <Badge variant="outline" className="text-[10px] h-4">
                              리액션
                            </Badge>
                            <Badge variant="outline" className="text-[10px] h-4">
                              유행어
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleDateString()} 저장됨</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

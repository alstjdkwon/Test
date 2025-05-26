import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { Search, Bookmark, Home, User, TrendingUp, Tag, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Meme {
  id: number
  title: string
  imageUrl: string
  tags: string[]
  popularity: number
  description: string
  createdAt: string
}

async function getTags() {
  try {
    const supabase = createServerComponentClient({ cookies })
    const { data, error } = await supabase.from("tags").select("name").order("name")

    if (error) {
      console.error("Error fetching tags:", error)
      return []
    }

    return data?.map((tag) => tag.name) || []
  } catch (error) {
    console.error("Error in getTags:", error)
    return []
  }
}

async function getMemes(sort: "trending" | "recent" = "trending") {
  try {
    const supabase = createServerComponentClient({ cookies })

    // 먼저 밈 데이터를 가져옵니다
    const query = supabase.from("memes").select(`
        id,
        title,
        image_url,
        description,
        popularity,
        created_at
      `)

    if (sort === "recent") {
      query.order("created_at", { ascending: false })
    } else {
      query.order("popularity", { ascending: false })
    }

    const { data: memes, error } = await query.limit(12)

    if (error) {
      console.error("Error fetching memes:", error)
      return []
    }

    if (!memes || memes.length === 0) {
      console.log("No memes found in database")
      return []
    }

    // 각 밈에 대한 태그를 별도로 가져옵니다
    const memesWithTags = await Promise.all(
      memes.map(async (meme) => {
        try {
          const { data: memeTags } = await supabase
            .from("meme_tags")
            .select(`
              tag_id,
              tags (
                name
              )
            `)
            .eq("meme_id", meme.id)

          const tags = memeTags?.map((mt) => mt.tags?.name).filter(Boolean) || []

          return {
            id: meme.id,
            title: meme.title,
            imageUrl: meme.image_url,
            description: meme.description,
            popularity: meme.popularity,
            createdAt: meme.created_at,
            tags,
          }
        } catch (tagError) {
          console.error(`Error fetching tags for meme ${meme.id}:`, tagError)
          return {
            id: meme.id,
            title: meme.title,
            imageUrl: meme.image_url,
            description: meme.description,
            popularity: meme.popularity,
            createdAt: meme.created_at,
            tags: [],
          }
        }
      }),
    )

    console.log(`Successfully loaded ${memesWithTags.length} memes`)
    return memesWithTags
  } catch (error) {
    console.error("Error in getMemes:", error)
    return []
  }
}

export default async function HomePage() {
  const tags = await getTags()
  const trendingMemes = await getMemes("trending")
  const recentMemes = await getMemes("recent")

  // 디버깅 정보 출력
  console.log("Tags count:", tags.length)
  console.log("Trending memes count:", trendingMemes.length)
  console.log("Recent memes count:", recentMemes.length)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">밈 저장소</h1>
          <div className="flex gap-2">
            <Link href="/upload">
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
                <span className="sr-only">업로드</span>
              </Button>
            </Link>
            <Link href="/bookmarks">
              <Button variant="ghost" size="icon">
                <Bookmark className="h-5 w-5" />
                <span className="sr-only">북마크</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-2 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="밈 검색하기..." className="pl-8 w-full" />
        </div>
        <div className="flex gap-2 overflow-x-auto py-2 mt-2">
          {tags.slice(0, 10).map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer">
              {tag}
            </Badge>
          ))}
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
            {/* 데이터 로딩 상태 표시 */}
            {trendingMemes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">밈을 불러오는 중이거나 데이터가 없습니다...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  개발자 도구(F12)의 Console 탭에서 오류를 확인해보세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {trendingMemes.map((meme) => (
                  <Link href={`/meme/${meme.id}`} key={meme.id}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img
                          src={meme.imageUrl || `/placeholder.svg?height=200&width=200&text=${meme.title}`}
                          alt={meme.title}
                          className="w-full aspect-square object-cover"
                          onError={(e) => {
                            console.error(`Failed to load image for meme ${meme.id}:`, meme.imageUrl)
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                          <div className="flex items-center justify-between">
                            <span className="text-xs truncate">{meme.title}</span>
                            <span className="text-xs flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {meme.popularity}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {meme.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px] h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {recentMemes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">최신 밈을 불러오는 중이거나 데이터가 없습니다...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {recentMemes.map((meme) => (
                  <Link href={`/meme/${meme.id}`} key={meme.id}>
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 relative">
                        <img
                          src={meme.imageUrl || `/placeholder.svg?height=200&width=200&text=${meme.title}`}
                          alt={meme.title}
                          className="w-full aspect-square object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                          <div className="flex items-center justify-between">
                            <span className="text-xs truncate">{meme.title}</span>
                            <span className="text-xs flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {meme.popularity}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-1">
                            {meme.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px] h-4">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-2 gap-4">
              {tags.map((category) => (
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
          <Link href="/upload">
            <Button variant="ghost" className="flex flex-col h-auto py-2">
              <Plus className="h-5 w-5" />
              <span className="text-xs mt-1">업로드</span>
            </Button>
          </Link>
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

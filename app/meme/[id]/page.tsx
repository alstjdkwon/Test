"use client";

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { ArrowLeft, Share2, TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import BookmarkButton from "@/components/bookmark-button"

interface MemePageProps {
  params: { id: string }
}

async function getMeme(id: string) {
  const supabase = createServerComponentClient({ cookies })

  // 밈 데이터 가져오기
  const { data: meme, error } = await supabase
    .from("memes")
    .select(`
      id,
      title,
      image_url,
      description,
      popularity,
      created_at
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching meme:", error)
    return null
  }

  // 밈의 태그 가져오기
  const { data: memeTags } = await supabase
    .from("meme_tags")
    .select(`
      tag_id,
      tags (
        name
      )
    `)
    .eq("meme_id", meme.id)

  const tags = memeTags?.map((mt) => mt.tags?.name) || []

  return {
    id: meme.id,
    title: meme.title,
    imageUrl: meme.image_url,
    description: meme.description,
    popularity: meme.popularity,
    createdAt: meme.created_at,
    tags,
  }
}

async function getSimilarMemes(id: string, tags: string[]) {
  const supabase = createServerComponentClient({ cookies })

  const { data: memes, error } = await supabase
    .from("memes")
    .select(`
      id,
      title,
      image_url
    `)
    .neq("id", id)
    .limit(6)

  if (error) {
    console.error("Error fetching similar memes:", error)
    return []
  }

  // 각 밈에 대한 태그를 별도로 가져옵니다
  const memesWithTags = await Promise.all(
    memes.map(async (meme) => {
      const { data: memeTags } = await supabase
        .from("meme_tags")
        .select(`
          tag_id,
          tags (
            name
          )
        `)
        .eq("meme_id", meme.id)

      const tags = memeTags?.map((mt) => mt.tags?.name) || []

      return {
        id: meme.id,
        title: meme.title,
        imageUrl: meme.image_url,
        tags,
      }
    }),
  )

  return memesWithTags
}

export default async function MemePage({ params }: MemePageProps) {
  const meme = await getMeme(params.id)

  if (!meme) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">밈을 찾을 수 없습니다</h1>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  const similarMemes = await getSimilarMemes(params.id, meme.tags)

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
          <h1 className="text-lg font-medium">밈 상세</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">공유하기</span>
            </Button>
            <BookmarkButton memeId={meme.id} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card className="overflow-hidden mb-6">
          <CardContent className="p-0">
            <img
              src={meme.imageUrl || `/placeholder.svg?height=400&width=400&text=${meme.title}`}
              alt={meme.title}
              className="w-full aspect-square object-cover"
            />
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">{meme.title}</h2>
            <span className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1" />
              {meme.popularity} 저장
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {meme.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-4">{meme.description || "이 밈에 대한 설명이 없습니다."}</p>

          <Button className="w-full">
            <Download className="h-4 w-4 mr-2" />밈 저장하기
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">비슷한 밈</h3>
          <div className="grid grid-cols-3 gap-3">
            {similarMemes.map((similarMeme) => (
              <Link href={`/meme/${similarMeme.id}`} key={similarMeme.id}>
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={similarMeme.imageUrl || `/placeholder.svg?height=150&width=150&text=${similarMeme.title}`}
                    alt={similarMeme.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

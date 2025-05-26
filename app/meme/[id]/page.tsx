"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, Share2, TrendingUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function MemePage({ params }: { params: { id: string } }) {
  const [isBookmarked, setIsBookmarked] = useState(false)

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
            <Button variant="ghost" size="icon" onClick={() => setIsBookmarked(!isBookmarked)}>
              <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
              <span className="sr-only">북마크</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <Card className="overflow-hidden mb-6">
          <CardContent className="p-0">
            <img
              src={`/placeholder.svg?height=400&width=400&text=밈${params.id}`}
              alt={`밈 ${params.id}`}
              className="w-full aspect-square object-cover"
            />
          </CardContent>
        </Card>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold">인기 밈 #{params.id}</h2>
            <span className="flex items-center text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 mr-1" />
              {Number.parseInt(params.id) * 123} 저장
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>리액션</Badge>
            <Badge>유행어</Badge>
            <Badge>드라마</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            이 밈은 2023년 인기 드라마에서 유래되었으며, 놀라움을 표현할 때 주로 사용됩니다. 소셜 미디어에서 빠르게
            확산되어 현재 가장 인기있는 리액션 밈 중 하나입니다.
          </p>

          <Button className="w-full">
            <Download className="h-4 w-4 mr-2" />밈 저장하기
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">비슷한 밈</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Link href={`/meme/${item}`} key={item}>
                <div className="aspect-square overflow-hidden rounded-md">
                  <img
                    src={`/placeholder.svg?height=150&width=150&text=밈${item}`}
                    alt={`밈 ${item}`}
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

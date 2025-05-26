"use client"

import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createSupabaseClient } from "@/lib/supabase-client"

interface BookmarkButtonProps {
  memeId: number
}

export default function BookmarkButton({ memeId }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      const supabase = createSupabaseClient()

      // 현재 로그인한 사용자 정보 가져오기
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      // 북마크 상태 확인
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", user.id)
        .eq("meme_id", memeId)
        .single()

      setIsBookmarked(!!data)
      setIsLoading(false)
    }

    checkBookmarkStatus()
  }, [memeId])

  const toggleBookmark = async () => {
    setIsLoading(true)

    const supabase = createSupabaseClient()

    // 현재 로그인한 사용자 정보 가져오기
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // 로그인 페이지로 리다이렉트 또는 로그인 모달 표시
      alert("북마크를 추가하려면 로그인이 필요합니다.")
      setIsLoading(false)
      return
    }

    try {
      if (isBookmarked) {
        // 북마크 삭제
        await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("meme_id", memeId)
      } else {
        // 북마크 추가
        await supabase.from("bookmarks").insert({
          user_id: user.id,
          meme_id: memeId,
        })

        // 인기도 증가
        await supabase
          .from("memes")
          .update({ popularity: supabase.rpc("increment", { x: 1 }) })
          .eq("id", memeId)
      }

      setIsBookmarked(!isBookmarked)
    } catch (error) {
      console.error("Error toggling bookmark:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleBookmark} disabled={isLoading}>
      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
      <span className="sr-only">북마크</span>
    </Button>
  )
}

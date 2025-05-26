import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const memeData = [
  {
    title: "제리 감사합니다",
    imageUrl: "/placeholder.svg?height=400&width=400&text=제리감사합니다",
    tags: ["리액션", "감사", "동물"],
    description: "제리가 정장을 입고 감사함을 표하는 밈으로, 감사 반응을 표현할 때 사용됩니다.",
    popularity: 1234,
  },
  {
    title: "눈물 흘리는 고양이",
    imageUrl: "/placeholder.svg?height=400&width=400&text=눈물고양이",
    tags: ["리액션", "슬픔", "동물"],
    description: "눈물을 흘리는 고양이 밈으로, 감동적이거나 슬픈 상황에 대한 반응을 표현할 때 사용됩니다.",
    popularity: 2345,
  },
  {
    title: "혼란스러운 수학 여성",
    imageUrl: "/placeholder.svg?height=400&width=400&text=혼란수학여성",
    tags: ["리액션", "혼란", "드라마"],
    description: "복잡한 수식을 보며 혼란스러워하는 여성의 밈으로, 이해하기 어려운 상황을 표현할 때 사용됩니다.",
    popularity: 3456,
  },
  {
    title: "두 버튼 고민하는 남자",
    imageUrl: "/placeholder.svg?height=400&width=400&text=두버튼고민",
    tags: ["선택", "고민", "만화"],
    description: "두 개의 버튼 중 어떤 것을 누를지 고민하는 남자 밈으로, 어려운 선택의 상황을 표현할 때 사용됩니다.",
    popularity: 4567,
  },
  {
    title: "아이 옆 화재",
    imageUrl: "/placeholder.svg?height=400&width=400&text=아이옆화재",
    tags: ["장난", "재난", "아이"],
    description:
      "화재 현장 앞에서 미소짓는 어린 소녀의 밈으로, 장난을 치거나 혼란을 즐기는 상황을 표현할 때 사용됩니다.",
    popularity: 5678,
  },
  {
    title: "스폰지밥 상상력",
    imageUrl: "/placeholder.svg?height=400&width=400&text=스폰지밥상상력",
    tags: ["애니메이션", "상상", "유머"],
    description: "무지개를 그리며 '상상력'을 표현하는 스폰지밥 밈으로, 비현실적인 기대나 상상을 표현할 때 사용됩니다.",
    popularity: 6789,
  },
]

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // 각 밈 데이터 추가
    for (const meme of memeData) {
      // 1. 밈 데이터 저장
      const { data: memeRecord, error: memeError } = await supabase
        .from("memes")
        .insert({
          title: meme.title,
          image_url: meme.imageUrl,
          description: meme.description,
          popularity: meme.popularity,
        })
        .select()

      if (memeError) {
        console.error("Error inserting meme:", memeError)
        continue
      }

      const memeId = memeRecord[0].id

      // 2. 태그 처리
      for (const tagName of meme.tags) {
        // 태그가 존재하는지 확인하고 없으면 생성
        const { data: existingTag, error: tagError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .maybeSingle()

        if (tagError) {
          console.error("Error checking tag:", tagError)
          continue
        }

        let tagId

        if (!existingTag) {
          const { data: newTag, error: newTagError } = await supabase.from("tags").insert({ name: tagName }).select()

          if (newTagError) {
            console.error("Error creating tag:", newTagError)
            continue
          }

          tagId = newTag?.[0]?.id
        } else {
          tagId = existingTag.id
        }

        // 밈과 태그 연결
        if (tagId) {
          const { error: linkError } = await supabase.from("meme_tags").insert({ meme_id: memeId, tag_id: tagId })

          if (linkError) {
            console.error("Error linking tag to meme:", linkError)
          }
        }
      }
    }

    return NextResponse.json({ message: "밈 데이터가 성공적으로 추가되었습니다." })
  } catch (error) {
    console.error("Error seeding memes:", error)
    return NextResponse.json({ error: "밈 데이터 추가 중 오류가 발생했습니다." }, { status: 500 })
  }
}

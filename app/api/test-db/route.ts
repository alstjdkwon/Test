import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    // 간단한 데이터베이스 연결 테스트
    const { data, error } = await supabase.from("memes").select("id, title").limit(3)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          details: "Database query failed",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: data,
      count: data?.length || 0,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Connection failed",
      },
      { status: 500 },
    )
  }
}

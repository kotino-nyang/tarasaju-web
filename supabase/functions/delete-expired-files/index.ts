import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Supabase 클라이언트 생성
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 30일 이상 지난 파일 조회
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: expiredOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_number, result_file_url, file_uploaded_at')
      .not('result_file_url', 'is', null)
      .not('file_uploaded_at', 'is', null)
      .lt('file_uploaded_at', thirtyDaysAgo.toISOString())

    if (fetchError) {
      throw fetchError
    }

    const deletedFiles: string[] = []
    const errors: string[] = []

    // 각 만료된 파일 삭제
    for (const order of expiredOrders || []) {
      try {
        // Storage URL에서 파일 경로 추출
        const url = new URL(order.result_file_url)
        const pathParts = url.pathname.split('/storage/v1/object/public/order-results/')
        if (pathParts.length < 2) continue

        const filePath = pathParts[1]

        // Storage에서 파일 삭제
        const { error: deleteError } = await supabase.storage
          .from('order-results')
          .remove([filePath])

        if (deleteError) {
          errors.push(`Order ${order.order_number}: ${deleteError.message}`)
          continue
        }

        // orders 테이블에서 파일 정보 제거
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            result_file_url: null,
            file_uploaded_at: null,
          })
          .eq('id', order.id)

        if (updateError) {
          errors.push(`Order ${order.order_number} DB update: ${updateError.message}`)
        } else {
          deletedFiles.push(order.order_number)
        }
      } catch (err) {
        errors.push(`Order ${order.order_number}: ${err.message}`)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `만료된 파일 삭제 완료`,
        deletedCount: deletedFiles.length,
        deletedFiles,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

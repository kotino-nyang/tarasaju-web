-- ============================================
-- Migration 007: 결과 파일 업로드 기능 추가
-- ============================================

-- 1단계: 기존 Storage 정책 삭제 (중복 방지)
DROP POLICY IF EXISTS "Admins can upload result files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update result files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete result files" ON storage.objects;
DROP POLICY IF EXISTS "Users can download their order result files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all result files" ON storage.objects;

-- 2단계: orders 테이블에 결과 파일 URL 컬럼 추가
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS result_file_url TEXT;

-- 3단계: Storage 버킷 생성 및 public으로 설정 (한글 파일명 지원)
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-results', 'order-results', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4단계: Storage RLS 정책 생성

-- 관리자만 파일 업로드 가능
CREATE POLICY "Admins can upload result files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-results' AND
  auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
);

-- 관리자만 파일 업데이트 가능
CREATE POLICY "Admins can update result files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'order-results' AND
  auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
);

-- 관리자만 파일 삭제 가능
CREATE POLICY "Admins can delete result files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-results' AND
  auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
);

-- 해당 주문의 사용자만 자신의 파일 다운로드 가능
CREATE POLICY "Users can download their order result files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-results' AND
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.user_id = auth.uid()
    AND orders.result_file_url LIKE '%' || storage.objects.name || '%'
  )
);

-- 관리자는 모든 파일 조회 가능
CREATE POLICY "Admins can view all result files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'order-results' AND
  auth.jwt() ->> 'email' = 'binzzz010101@gmail.com'
);

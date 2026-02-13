-- orders 테이블에 파일 업로드 시간 컬럼 추가
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS file_uploaded_at TIMESTAMP WITH TIME ZONE;

-- 파일 만료 확인을 위한 함수 (30일)
CREATE OR REPLACE FUNCTION is_file_expired(uploaded_at TIMESTAMP WITH TIME ZONE)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN uploaded_at IS NOT NULL AND uploaded_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

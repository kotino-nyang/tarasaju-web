// Google Analytics 이벤트 추적 함수

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
      page_path: url,
    });
  }
};

// 커스텀 이벤트 추적
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// 주요 이벤트 추적 함수들
export const trackEvent = {
  // 회원가입
  signup: (method: string) => {
    event({
      action: "sign_up",
      category: "engagement",
      label: method,
    });
  },

  // 로그인
  login: (method: string) => {
    event({
      action: "login",
      category: "engagement",
      label: method,
    });
  },

  // 장바구니 추가
  addToCart: (itemName: string, price: number) => {
    event({
      action: "add_to_cart",
      category: "ecommerce",
      label: itemName,
      value: price,
    });
  },

  // 결제 시작
  beginCheckout: (totalPrice: number) => {
    event({
      action: "begin_checkout",
      category: "ecommerce",
      value: totalPrice,
    });
  },

  // 구매 완료
  purchase: (orderNumber: string, revenue: number) => {
    event({
      action: "purchase",
      category: "ecommerce",
      label: orderNumber,
      value: revenue,
    });
  },

  // 파일 다운로드
  downloadFile: (fileName: string) => {
    event({
      action: "file_download",
      category: "engagement",
      label: fileName,
    });
  },

  // 주문 취소
  cancelOrder: (orderNumber: string) => {
    event({
      action: "cancel_order",
      category: "ecommerce",
      label: orderNumber,
    });
  },
};

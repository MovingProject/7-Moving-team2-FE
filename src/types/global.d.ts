// 전역 window 객체에 Kakao 타입 선언
interface KakaoLinkButton {
  title: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoLinkContent {
  title: string;
  description: string;
  imageUrl: string;
  link: {
    mobileWebUrl: string;
    webUrl: string;
  };
}

interface KakaoLinkParams {
  objectType: "feed";
  content: KakaoLinkContent;
  buttons: KakaoLinkButton[];
}

interface Kakao {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Link: {
    sendDefault: (params: KakaoLinkParams) => void;
  };
}

interface Window {
  Kakao: Kakao;
}

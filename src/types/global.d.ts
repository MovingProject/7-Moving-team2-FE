// 전역 window 객체에 Kakao 타입 선언
interface Kakao {
  init: (key: string) => void;
  isInitialized: () => boolean;
  Link: {
    sendDefault: (params: any) => void;
  };
}

interface Window {
  Kakao: Kakao;
}

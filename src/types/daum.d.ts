interface PostcodeOptions {
  oncomplete: (data: PostcodeData) => void;
}

interface PostcodeData {
  zonecode: string; // 우편번호 (5자리)
  address: string; // 기본 주소
  addressType: string; // 주소 타입 (R: 도로명, J: 지번)
  bname: string; // 법정동/법정리 이름
}

interface DaumGlobal {
  Postcode: new (options?: PostcodeOptions) => {
    open: (type?: "LAYER" | "POPUP") => void;
  };
}

declare global {
  interface Window {
    daum: DaumGlobal;
  }
}

export {};

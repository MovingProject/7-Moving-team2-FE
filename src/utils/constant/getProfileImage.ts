export const profileImageNames = [
  "avatartion1.jpg",
  "avatartion2.jpg",
  "avatartion3.jpg",
  "avatartion4.jpg",
  "avatartion5.jpg",
];

export const getRandomProfileImage = () => {
  const randomIndex = Math.floor(Math.random() * profileImageNames.length);
  return `/images/avatars/${profileImageNames[randomIndex]}`;
};

export const getProfileImageByNumber = (number: number): string => {
  if (number >= 1 && number <= profileImageNames.length) {
    const index = number - 1;
    return `/images/avatars/${profileImageNames[index]}`;
  }
  // 유효하지 않은 번호일 경우, 기본 이미지 경로 반환
  return "/images/avatars/avatartion1.jpg";
};

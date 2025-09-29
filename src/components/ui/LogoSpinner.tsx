import Image from "next/image";

export default function LogoSpinner() {
  return (
    <Image
      src="/icon/Logo.svg"
      alt="Loading Logo"
      className="animate-bounce"
      width={160}
      height={64}
    />
  );
}

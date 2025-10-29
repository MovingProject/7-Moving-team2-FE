"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import sunny from "@/assets/lottie/sunny.json";
import cloudy from "@/assets/lottie/cloudy.json";
import rainy from "@/assets/lottie/rainy.json";
import snow from "@/assets/lottie/snow.json";
import night from "@/assets/lottie/night.json";
import { getWeather } from "@/utils/hook/landing/landing";

export default function LandingWeatherLottie() {
  const [weather, setWeather] = useState("맑음");
  const [city, setCity] = useState("Seoul");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    (async () => {
      const data = await getWeather(city);
      if (data) setWeather(data.condition);
    })();

    const updatePosition = () => {
      const hour = new Date().getHours();
      const t = (hour / 24) * Math.PI;
      const radius = window.innerWidth * 0.4;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight * 0.65;

      const x = centerX + radius * Math.cos(Math.PI - t);
      const y = centerY - radius * Math.sin(Math.PI - t);
      setPosition({ x, y });
    };

    updatePosition();
    const interval = setInterval(updatePosition, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, [city]);
  const animationMap = {
    맑음: sunny,
    흐림: cloudy,
    구름많음: cloudy,
    비: rainy,
    눈: snow,
    기본: night,
  };

  const selectedLottie = animationMap[weather as keyof typeof animationMap] || animationMap["기본"];

  return (
    <>
      {/* 도시 선택 드롭다운 */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="absolute top-4 right-4 z-[101] rounded-md bg-white px-3 py-1 shadow"
      >
        <option value="Seoul">서울</option>
        <option value="Busan">부산</option>
        <option value="Incheon">인천</option>
        <option value="Daegu">대구</option>
        <option value="Gwangju">광주</option>
      </select>

      {/* 날씨 애니메이션 */}
      <div
        className="pointer-events-none fixed z-[100]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -50%)",
          transition: "left 2s ease-in-out, top 2s ease-in-out",
        }}
      >
        <Lottie animationData={selectedLottie} loop autoplay style={{ width: 160, height: 160 }} />
      </div>
    </>
  );
}

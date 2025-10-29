"use client";
import { useEffect, useState } from "react";
import { getWeeklyWeather } from "@/utils/hook/landing/landing";

export default function WeeklyForecastPanel({ city }: { city: string }) {
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getWeeklyWeather(city);
      setForecast(data);
      setLoading(false);
    })();
  }, [city]);

  if (loading) return <p className="p-4 text-sm text-gray-500">불러오는 중...</p>;

  return (
    <div className="animate-slideDown grid grid-cols-5 gap-3 rounded-b-xl border-t border-gray-200 bg-[#F9FAFB] p-4">
      {forecast.map((day) => (
        <div
          key={day.date}
          className="flex flex-col items-center rounded-lg bg-white p-2 shadow-sm"
        >
          <p className="text-xs text-gray-500">{day.date.slice(5)}</p>
          <img src={`https:${day.icon}`} alt={day.condition} width={40} height={40} />
          <p className="text-xs">{day.condition}</p>
          <p className="text-xs text-gray-600">
            {Math.round(day.mintemp_c)}° / {Math.round(day.maxtemp_c)}°
          </p>
        </div>
      ))}
    </div>
  );
}

import axios from "axios";
import apiClient from "@/lib/apiClient";

export interface WeeklyWeather {
  date: string;
  condition: string;
  icon: string;
  maxtemp_c: number;
  mintemp_c: number;
}

export async function getWeather(city: string) {
  try {
    const response = await apiClient.get(`/weather/current`, {
      params: { city },
    });
    return response.data.data;
  } catch (err) {
    console.error("날씨 정보를 불러오지 못했습니다:", err);
    return null;
  }
}
export async function getWeeklyWeather(city: string) {
  try {
    const response = await apiClient.get(`/weather/forecast`, {
      params: { city, days: 10 },
      withCredentials: true,
    });
    return response.data.data.forecastDays;
  } catch (err) {
    console.error("주간 날씨 정보를 불러오지 못했습니다:", err);
    return null;
  }
}

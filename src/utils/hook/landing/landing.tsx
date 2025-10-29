import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function getWeather(city: string) {
  try {
    const response = await axios.get(`${API_BASE}/weather/current`, {
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
    const response = await axios.get(`${API_BASE}/weather/forecast`, {
      params: { city, days: 10 },
      withCredentials: true,
    });
    return response.data.data.forecastDays;
  } catch (err) {
    console.error("주간 날씨 정보를 불러오지 못했습니다:", err);
    return null;
  }
}

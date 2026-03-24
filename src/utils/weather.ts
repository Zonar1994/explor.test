/**
 * Weather utility using Open-Meteo API (Free, no key required)
 */

export type WeatherData = {
  temp: number;
  condition: string;
  icon?: string;
};

// Interpretation codes from WMO
const weatherCodes: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear', icon: 'Sun' },
  1: { condition: 'Mainly Clear', icon: 'Sun' },
  2: { condition: 'Partly Cloudy', icon: 'CloudSun' },
  3: { condition: 'Overcast', icon: 'Clouds' },
  45: { condition: 'Foggy', icon: 'CloudFog' },
  48: { condition: 'Foggy', icon: 'CloudFog' },
  51: { condition: 'Drizzle', icon: 'CloudDrizzle' },
  53: { condition: 'Drizzle', icon: 'CloudDrizzle' },
  55: { condition: 'Drizzle', icon: 'CloudDrizzle' },
  61: { condition: 'Rain', icon: 'CloudRain' },
  63: { condition: 'Rain', icon: 'CloudRain' },
  65: { condition: 'Rain', icon: 'CloudRain' },
  71: { condition: 'Snow', icon: 'CloudSnow' },
  73: { condition: 'Snow', icon: 'CloudSnow' },
  75: { condition: 'Snow', icon: 'CloudSnow' },
  80: { condition: 'Rain Showers', icon: 'CloudRain' },
  81: { condition: 'Rain Showers', icon: 'CloudRain' },
  82: { condition: 'Rain Showers', icon: 'CloudRain' },
  95: { condition: 'Thunderstorm', icon: 'CloudLightning' },
};

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
    );
    const data = await response.json();
    
    if (data && data.current_weather) {
      const code = data.current_weather.weathercode;
      const interpretation = weatherCodes[code] || { condition: 'Cloudy', icon: 'Cloud' };
      
      return {
        temp: Math.round(data.current_weather.temperature),
        condition: interpretation.condition,
        icon: interpretation.icon
      };
    }
    
    return { temp: 15, condition: 'Clear' };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return { temp: 15, condition: 'Clear' };
  }
}

export type ForecastPoint = {
  time: string;
  temp: number;
  condition: string;
  icon: string;
};

export async function fetchForecast(lat: number, lng: number): Promise<ForecastPoint[]> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weathercode&forecast_days=1`
    );
    const data = await response.json();
    
    if (data && data.hourly) {
      const times = data.hourly.time;
      const temps = data.hourly.temperature_2m;
      const codes = data.hourly.weathercode;
      
      return times.slice(0, 24).map((time: string, i: number) => {
        const hour = new Date(time).getHours();
        const interpretation = weatherCodes[codes[i]] || { condition: 'Cloudy', icon: 'Cloud' };
        return {
          time: `${hour}:00`,
          temp: Math.round(temps[i]),
          condition: interpretation.condition,
          icon: interpretation.icon
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return [];
  }
}

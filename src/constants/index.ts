import { API_KEY } from "@env";

export const apiKey = API_KEY;

export const getImageSource = (status: string) => {
    switch (status.trim()) {
        case 'Partly Cloudy':
        case 'Partly cloudy':
            return require('../assets/images/cloud_1.png');
        case 'Light drizzle':
            return require('../assets/images/drizzle.png');
        case 'Overcast':
            return require('../assets/images/cloud_2.png');
        case 'Sunny':
            return require('../assets/images/sun.png');
        case 'Mist':
            return require('../assets/images/mist.png');
        case 'Clear':
            return require('../assets/images/partlycloudy.png');
        case "Patchy rain nearby":
            return require('../assets/images/moderaterain.png');
        case "Cloudy":
            return require('../assets/images/cloud_1.png');
        case "Fogppp":
            return require('../assets/images/fog.png');
        case "Light rain":
            return require('../assets/images/rain.png');
        case "Heavy rain":
            return require('../assets/images/heavyrain.png');
        case "Heavy rain at times":
            return require('../assets/images/heavyrain.png');
        case "Moderate rain":
            return require('../assets/images/moderaterain.png');
        case "Light rain shower":
            return require('../assets/images/rain.png');
        case "Patchy rain possible":
            return require('../assets/images/moderaterain.png');
        case "Moderate rain at times":
            return require('../assets/images/moderaterain.png');
        case "Moderate or heavy freezing rain":
            return require('../assets/images/heavyrain.png');
        case "Moderate or heavy rain shower":
            return require('../assets/images/heavyrain.png');
        case "Moderate or heavy rain with thunder":
            return require('../assets/images/heavyrain.png');
        case "default":
            return require('../assets/images/app_icon.png');
        default:
            console.log(`case image: ${status}`);
            return require('../assets/images/app_icon.png');
    }
};

export const convertENtoVi = (status: string) => {
    switch (status.trim()) {
        case 'Partly Cloudy':
        case 'Partly cloudy':
            return "Có mây rải rác";
        case 'Light drizzle':
            return "Mưa phùn nhẹ";
        case 'Overcast':
            return "U ám";
        case 'Sunny':
            return "Nắng";
        case 'Mist':
            return "Sương mù";
        case 'Clear':
            return "Thông thoáng";
        case "Patchy rain nearby":
            return "Mưa rải rác gần đây";
        case "Cloudy":
            return "Nhiều mây";
        case "Fog":
            return "Sương mù";
        case "Light rain":
            return "Mưa nhỏ";
        case "Heavy rain":
            return "Mưa nặng hạt";
        case "Heavy rain at times":
            return "Có lúc mưa to";
        case "Light rain shower":
            return "Mưa rào nhẹ";
        case "Patchy rain possible":
            return "Có thể có mưa rải rác";
        case "Moderate rain":
            return "Mưa vừa";
        case "Moderate rain at times":
            return "Có lúc mưa vừa";
        case "Moderate or heavy freezing rain":
            return "Mưa vừa hoặc mưa to";
        case "Moderate or heavy rain shower":
            return "Mưa vừa hoặc mưa to";
        case "Moderate or heavy rain with thunder":
            return "Mưa vừa hoặc mưa to kèm sấm sét";
        case "":
            return status
        default:
            console.log(`case string: ${status}`);
            return "";
    }
};

export const formatTemperature = (degree: number | string): string => {
    if (typeof degree === 'number')
        return `${Math.round(degree)}°`;
    else
        return ``;
}

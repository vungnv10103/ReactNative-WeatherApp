
const getImageSource = (status: string) => {
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

const convertENtoVi = (status: string) => {
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

const formatTemperature = (degree: number | string): string => {
    if (typeof degree === 'number')
        return `${Math.round(degree)}°`;
    else
        return ``;
}

const removeVietnameseAccent = (str: string): string => {
    const mapAccents: Record<string, string> = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd',
        'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
        'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
        'Đ': 'D'
    };

    let newStr = "";
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        newStr += mapAccents[char] || char;
    }
    return newStr;
}

export {
    getImageSource,
    convertENtoVi,
    formatTemperature,
    removeVietnameseAccent
}
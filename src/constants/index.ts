import { API_KEY } from "@env";

export const apiKey = API_KEY;

export const getImageSource = (status: string) => {
    switch (status.trim()) {
        case 'Partly Cloudy':
            return require('../assets/images/cloud_1.png');
        case 'Overcast':
            return require('../assets/images/cloud_2.png');
        case "Patchy rain nearby":
            return require('../assets/images/moderaterain.png');
        case "Cloudy":
            return require('../assets/images/cloud_1.png');
        default:
            console.log(`case: ${status}`);
            return require('../assets/images/avatar.png');
    }
};


// export const weatherImages: any = {
//     'Moderate rain': require('../assets/images/moderaterain.png'),
//     'Patchy rain possible': require('../assets/images/moderaterain.png'),
//     'Sunny': require('../assets/images/sun.png'),
//     'Clear': require('../assets/images/sun.png'),
//     'Light rain': require('../assets/images/moderaterain.png'),
//     'Moderate rain at times': require('../assets/images/moderaterain.png'),
//     'Heavy rain': require('../assets/images/heavyrain.png'),
//     'Heavy rain at times': require('../assets/images/heavyrain.png'),
//     'Moderate or heavy freezing rain': require('../assets/images/heavyrain.png'),
//     'Moderate or heavy rain shower': require('../assets/images/heavyrain.png'),
//     'Moderate or heavy rain with thunder': require('../assets/images/heavyrain.png'),
//     'Mist': require('../assets/images/mist.png'),
//     'other': require('../assets/images/avatar.png')
// }
export const environment = {
  production: true,
  weather: {
    api: {
      url: 'https://api.openweathermap.org/data/2.5',
      appid: '5a4b2d457ecbef9eb2a71e480b947604',
    },
    icon: {
      url: 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/',
    },
  },
  cache: {
    maxAge: 2 * 60 * 60 * 1000,
  },
};

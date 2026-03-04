/**
 * translations.ts
 * Complete translation dictionary for Agrisaarthi.
 *
 * Supports 4 languages: English (en), Hindi (hi), Tamil (ta), Telugu (te).
 * Placeholders like {name}, {current}, {total}, {crop} are replaced at runtime
 * by the useTranslation hook's t() function.
 */

// ── Supported language codes ────────────────────────────────────────
export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te';

// ── All available translation keys ──────────────────────────────────
export type TranslationKey =
    // ── Core app ──
    | 'appName'
    | 'tagline'
    | 'greeting'
    | 'madeForFarmers'
    | 'weather'
    | 'aiAdvice'
    | 'cropCare'
    | 'welcome'
    | 'welcomeDesc'
    | 'next'
    | 'back'
    | 'save'
    | 'step'
    | 'personalInfo'
    | 'farmInfo'
    | 'confirmation'
    | 'name'
    | 'location'
    | 'language'
    | 'crop'
    | 'soilType'
    | 'farmSize'
    | 'irrigationType'
    | 'startButton'
    | 'loading'
    // ── Weather & Crop Intelligence ──
    | 'weatherTitle'
    | 'cropStressIndex'
    | 'todayAlerts'
    | 'forecast'
    | 'humidity'
    | 'wind'
    | 'rainfall'
    | 'feelsLike'
    | 'goodConditions'
    | 'moderateStress'
    | 'highStress'
    | 'skipIrrigation'
    | 'heatAlert'
    | 'coldAlert'
    | 'fungalRisk'
    | 'windAlert'
    | 'optimalConditions'
    // ── Alert titles ──
    | 'alertHeatStress'
    | 'alertColdStress'
    | 'alertOptimalConditions'
    | 'alertSkipIrrigation'
    | 'alertFungalRisk'
    | 'alertLowHumidity'
    | 'alertHighWind'
    | 'alertAllClear'
    | 'alertSuboptimalTemp'
    | 'alertLowRainfall'
    | 'alertCropTip'
    // ── Alert descriptions ──
    | 'descHeatStress'
    | 'descColdStress'
    | 'descOptimalConditions'
    | 'descSkipIrrigation'
    | 'descFungalRisk'
    | 'descLowHumidity'
    | 'descHighWind'
    | 'descAllClear'
    | 'descSuboptimalTemp'
    | 'descLowRainfall'
    // ── Crop-specific tips ──
    | 'descWheatHighTemp'
    | 'descRiceLowHumidity'
    | 'descTomatoHighTemp'
    | 'descCottonHighHumidity'
    | 'descOnionColdTemp'
    // ── Stress descriptions ──
    | 'stressGoodDesc'
    | 'stressModerateDesc'
    | 'stressHighDesc'
    // ── Day names ──
    | 'daySun'
    | 'dayMon'
    | 'dayTue'
    | 'dayWed'
    | 'dayThu'
    | 'dayFri'
    | 'daySat'
    // ── Weather condition descriptions ──
    | 'weatherClearSky'
    | 'weatherFewClouds'
    | 'weatherScatteredClouds'
    | 'weatherBrokenClouds'
    | 'weatherShowerRain'
    | 'weatherRain'
    | 'weatherLightRain'
    | 'weatherThunderstorm'
    | 'weatherSnow'
    | 'weatherMist'
    | 'weatherPartlyCloudy'
    | 'weatherOvercastClouds'
    | 'weatherModerateRain'
    | 'weatherHeavyRain'
    | 'weatherHaze'
    // ── Settings screen ──
    | 'settings'
    | 'saveSettings'
    | 'settingsSaved'
    | 'personalSettings'
    | 'farmSettings'
    | 'appInfo'
    | 'appVersion'
    | 'changeLanguage'
    | 'changeLocation'
    | 'changeCrop'
    | 'changeSoilType'
    | 'changeFarmSize'
    | 'changeIrrigation'
    | 'madeForIndianFarmers'
    // ── AI Advisory ──
    | 'aiAdvisor'
    | 'typeQuestion'
    | 'send'
    | 'thinking'
    | 'quickQuestions'
    | 'welcomeMessage'
    // ── Quick question buttons ──
    | 'shouldIIrrigate'
    | 'anyPestRisk'
    | 'whatFertilizer'
    | 'isWeatherGood'
    | 'whatTodoToday'
    // ── Error ──
    | 'weatherLoadError';

// ── Type for a single language's translations ───────────────────────
export type TranslationMap = Record<TranslationKey, string>;

/**
 * Maps the display-name stored in AsyncStorage (e.g. "Hindi")
 * to its language code (e.g. "hi").
 */
export const LANGUAGE_MAP: Record<string, SupportedLanguage> = {
    English: 'en',
    Hindi: 'hi',
    Tamil: 'ta',
    Telugu: 'te',
};

/**
 * Reverse map: language code → display name.
 */
export const LANGUAGE_DISPLAY: Record<SupportedLanguage, string> = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
};

// ── Translation dictionaries ────────────────────────────────────────

const en: TranslationMap = {
    // Core app
    appName: 'Agrisaarthi',
    tagline: 'Your Smart Farming Companion',
    greeting: 'Namaste, {name}!',
    madeForFarmers: 'Made for Indian farmers',
    weather: 'Weather',
    aiAdvice: 'AI Advice',
    cropCare: 'Crop Care',
    welcome: 'Welcome to Agrisaarthi',
    welcomeDesc:
        'Empowering Indian farmers with smart tools for weather forecasting, crop management, and AI-driven insights',
    next: 'Next',
    back: 'Back',
    save: 'Save',
    step: 'Step {current} of {total}',
    personalInfo: 'Personal Information',
    farmInfo: 'Farm Information',
    confirmation: 'Confirmation',
    name: 'Full Name',
    location: 'Village / District',
    language: 'Preferred Language',
    crop: 'Primary Crop',
    soilType: 'Soil Type',
    farmSize: 'Farm Size (acres)',
    irrigationType: 'Irrigation Type',
    startButton: 'Start Farming with Agrisaarthi',
    loading: 'Loading...',
    // Weather & Crop Intelligence
    weatherTitle: 'Weather',
    cropStressIndex: 'Crop Stress Index',
    todayAlerts: "Today's Alerts",
    forecast: '5-Day Forecast',
    humidity: 'Humidity',
    wind: 'Wind',
    rainfall: 'Rainfall',
    feelsLike: 'Feels Like',
    goodConditions: 'Good Conditions',
    moderateStress: 'Moderate Stress',
    highStress: 'High Stress',
    skipIrrigation: 'Skip Irrigation',
    heatAlert: 'Heat Alert',
    coldAlert: 'Cold Alert',
    fungalRisk: 'Fungal Risk',
    windAlert: 'Wind Alert',
    optimalConditions: 'Optimal Conditions',
    // Alert titles
    alertHeatStress: 'Heat Stress Alert',
    alertColdStress: 'Cold Stress Alert',
    alertOptimalConditions: 'Optimal Conditions',
    alertSkipIrrigation: 'Skip Irrigation',
    alertFungalRisk: 'Fungal Disease Risk',
    alertLowHumidity: 'Low Humidity Alert',
    alertHighWind: 'High Wind Alert',
    alertAllClear: 'All Clear',
    alertSuboptimalTemp: 'Suboptimal Temperature',
    alertLowRainfall: 'Low Rainfall Alert',
    alertCropTip: 'Crop-Specific Tip',
    // Alert descriptions
    descHeatStress: 'Temperature above {maxTemp}°C. Recommend mulching and extra irrigation for {crop}.',
    descColdStress: 'Temperature below {minTemp}°C. Protect {crop} crops from frost.',
    descOptimalConditions: 'Good growing conditions today for {crop}.',
    descSkipIrrigation: 'Rain probability above 70%. Skip irrigation today, rain expected.',
    descFungalRisk: 'Humidity above {maxHumidity}% for {crop}. High fungal disease risk, inspect crops carefully.',
    descLowHumidity: 'Humidity below {minHumidity}% for {crop}. Increase irrigation to prevent crop dehydration.',
    descHighWind: 'Wind speed above {maxWind} km/h. Avoid spraying pesticides for {crop} today.',
    descAllClear: 'No weather concerns today. Good conditions for {crop}.',
    descSuboptimalTemp: 'Temperature is outside the ideal {minTemp}–{maxTemp}°C range for {crop}. Monitor closely.',
    descLowRainfall: 'Rain probability below {minRainfall}% needed for {crop}. Consider irrigation.',
    // Crop-specific tips
    descWheatHighTemp: 'High temperature for Wheat. Consider extra irrigation to cool soil.',
    descRiceLowHumidity: 'Rice needs high humidity. Check irrigation system.',
    descTomatoHighTemp: 'Heat stress for Tomato. Recommend shade nets and mulching.',
    descCottonHighHumidity: 'High humidity risk for Cotton. Watch for bollworm and fungal issues.',
    descOnionColdTemp: 'Too cold for Onion growth. Consider protective covering.',
    // Stress descriptions
    stressGoodDesc: 'Great conditions for {crop} today!',
    stressModerateDesc: 'Some stress factors — monitor {crop} closely.',
    stressHighDesc: 'High stress detected — take protective action for {crop}.',
    // Day names
    daySun: 'Sun',
    dayMon: 'Mon',
    dayTue: 'Tue',
    dayWed: 'Wed',
    dayThu: 'Thu',
    dayFri: 'Fri',
    daySat: 'Sat',
    // Weather conditions
    weatherClearSky: 'Clear Sky',
    weatherFewClouds: 'Few Clouds',
    weatherScatteredClouds: 'Scattered Clouds',
    weatherBrokenClouds: 'Broken Clouds',
    weatherShowerRain: 'Shower Rain',
    weatherRain: 'Rain',
    weatherLightRain: 'Light Rain',
    weatherThunderstorm: 'Thunderstorm',
    weatherSnow: 'Snow',
    weatherMist: 'Mist',
    weatherPartlyCloudy: 'Partly Cloudy',
    weatherOvercastClouds: 'Overcast Clouds',
    weatherModerateRain: 'Moderate Rain',
    weatherHeavyRain: 'Heavy Rain',
    weatherHaze: 'Haze',
    // Settings
    settings: 'Settings',
    saveSettings: 'Save Settings',
    settingsSaved: 'Settings saved!',
    personalSettings: 'Personal Settings',
    farmSettings: 'Farm Settings',
    appInfo: 'App Info',
    appVersion: 'App Version',
    changeLanguage: 'Change Language',
    changeLocation: 'Change City / Location',
    changeCrop: 'Change Primary Crop',
    changeSoilType: 'Change Soil Type',
    changeFarmSize: 'Change Farm Size (acres)',
    changeIrrigation: 'Change Irrigation Type',
    madeForIndianFarmers: 'Made for Indian Farmers 🇮🇳',
    // AI Advisory
    aiAdvisor: 'AI Crop Advisor',
    typeQuestion: 'Type your farming question...',
    send: 'Send',
    thinking: 'Thinking...',
    quickQuestions: 'Quick Questions',
    welcomeMessage: 'Namaste {name}! 🙏 I\'m your Agrisaarthi assistant. I know you\'re growing {crop} in {location}. How can I help you today?',
    // Quick question buttons
    shouldIIrrigate: 'Should I irrigate today? 💧',
    anyPestRisk: 'Any pest risk this week? 🐛',
    whatFertilizer: 'What fertilizer should I use? 🌱',
    isWeatherGood: 'Is this weather good for my crop? 🌤️',
    whatTodoToday: 'What should I do today on my farm? 📋',
    // Error
    weatherLoadError: 'Failed to load weather data. Please try again.',
};

const hi: TranslationMap = {
    // Core app
    appName: 'Agrisaarthi',
    tagline: 'आपका स्मार्ट खेती साथी',
    greeting: 'नमस्ते, {name}!',
    madeForFarmers: 'भारतीय किसानों के लिए बनाया गया',
    weather: 'मौसम',
    aiAdvice: 'AI सलाह',
    cropCare: 'फसल देखभाल',
    welcome: 'Agrisaarthi में आपका स्वागत है',
    welcomeDesc:
        'मौसम पूर्वानुमान, फसल प्रबंधन और AI-संचालित जानकारी के लिए स्मार्ट टूल्स के साथ भारतीय किसानों को सशक्त बनाना',
    next: 'अगला',
    back: 'पीछे',
    save: 'सहेजें',
    step: 'चरण {current} / {total}',
    personalInfo: 'व्यक्तिगत जानकारी',
    farmInfo: 'खेत की जानकारी',
    confirmation: 'पुष्टि',
    name: 'पूरा नाम',
    location: 'गाँव / जिला',
    language: 'पसंदीदा भाषा',
    crop: 'मुख्य फसल',
    soilType: 'मिट्टी का प्रकार',
    farmSize: 'खेत का आकार (एकड़)',
    irrigationType: 'सिंचाई प्रकार',
    startButton: 'Agrisaarthi के साथ खेती शुरू करें',
    loading: 'लोड हो रहा है...',
    // Weather & Crop Intelligence
    weatherTitle: 'मौसम',
    cropStressIndex: 'फसल तनाव सूचकांक',
    todayAlerts: 'आज की चेतावनियाँ',
    forecast: '5-दिन का पूर्वानुमान',
    humidity: 'नमी',
    wind: 'हवा',
    rainfall: 'वर्षा',
    feelsLike: 'महसूस होता है',
    goodConditions: 'अच्छी स्थिति',
    moderateStress: 'मध्यम तनाव',
    highStress: 'उच्च तनाव',
    skipIrrigation: 'सिंचाई छोड़ें',
    heatAlert: 'गर्मी चेतावनी',
    coldAlert: 'ठंड चेतावनी',
    fungalRisk: 'फफूंद जोखिम',
    windAlert: 'हवा चेतावनी',
    optimalConditions: 'अनुकूल स्थिति',
    // Alert titles
    alertHeatStress: 'गर्मी तनाव चेतावनी',
    alertColdStress: 'ठंड तनाव चेतावनी',
    alertOptimalConditions: 'अनुकूल स्थिति',
    alertSkipIrrigation: 'सिंचाई छोड़ें',
    alertFungalRisk: 'फफूंद रोग का खतरा',
    alertLowHumidity: 'कम नमी चेतावनी',
    alertHighWind: 'तेज हवा चेतावनी',
    alertAllClear: 'सब ठीक है',
    alertSuboptimalTemp: 'असामान्य तापमान',
    alertLowRainfall: 'कम वर्षा चेतावनी',
    alertCropTip: 'फसल विशेष सुझाव',
    // Alert descriptions
    descHeatStress: 'तापमान {maxTemp}°C से ऊपर। {crop} के लिए मल्चिंग और अतिरिक्त सिंचाई की सिफारिश।',
    descColdStress: 'तापमान {minTemp}°C से नीचे। {crop} की फसलों को पाले से बचाएं।',
    descOptimalConditions: 'आज {crop} के लिए अच्छी उगाने की स्थिति।',
    descSkipIrrigation: 'बारिश की संभावना 70% से अधिक। आज सिंचाई छोड़ें, बारिश की उम्मीद है।',
    descFungalRisk: '{crop} के लिए नमी {maxHumidity}% से अधिक। फफूंद रोग का उच्च जोखिम, फसलों का ध्यान से निरीक्षण करें।',
    descLowHumidity: '{crop} के लिए नमी {minHumidity}% से कम। फसल निर्जलीकरण रोकने के लिए सिंचाई बढ़ाएं।',
    descHighWind: 'हवा की गति {maxWind} km/h से अधिक। आज {crop} के लिए कीटनाशक छिड़काव से बचें।',
    descAllClear: 'आज कोई मौसम संबंधी चिंता नहीं। {crop} के लिए अच्छी स्थिति।',
    descSuboptimalTemp: 'तापमान {crop} के लिए आदर्श {minTemp}–{maxTemp}°C सीमा से बाहर है। ध्यान दें।',
    descLowRainfall: '{crop} के लिए बारिश की संभावना {minRainfall}% से कम है। सिंचाई पर विचार करें।',
    // Crop-specific tips
    descWheatHighTemp: 'गेहूं के लिए उच्च तापमान। मिट्टी को ठंडा करने के लिए अतिरिक्त सिंचाई पर विचार करें।',
    descRiceLowHumidity: 'चावल को उच्च नमी चाहिए। सिंचाई प्रणाली जांचें।',
    descTomatoHighTemp: 'टमाटर के लिए गर्मी तनाव। शेड नेट और मल्चिंग की सिफारिश।',
    descCottonHighHumidity: 'कपास के लिए उच्च नमी जोखिम। बॉलवर्म और फफूंद समस्याओं पर नजर रखें।',
    descOnionColdTemp: 'प्याज की वृद्धि के लिए बहुत ठंडा। सुरक्षात्मक आवरण पर विचार करें।',
    // Stress descriptions
    stressGoodDesc: 'आज {crop} के लिए बढ़िया स्थिति!',
    stressModerateDesc: 'कुछ तनाव कारक — {crop} पर ध्यान दें।',
    stressHighDesc: 'उच्च तनाव का पता चला — {crop} के लिए सुरक्षात्मक कार्रवाई करें।',
    // Day names
    daySun: 'रवि',
    dayMon: 'सोम',
    dayTue: 'मंगल',
    dayWed: 'बुध',
    dayThu: 'गुरु',
    dayFri: 'शुक्र',
    daySat: 'शनि',
    // Weather conditions
    weatherClearSky: 'साफ आसमान',
    weatherFewClouds: 'कुछ बादल',
    weatherScatteredClouds: 'बिखरे बादल',
    weatherBrokenClouds: 'टूटे बादल',
    weatherShowerRain: 'बौछार',
    weatherRain: 'बारिश',
    weatherLightRain: 'हल्की बारिश',
    weatherThunderstorm: 'गरज के साथ तूफान',
    weatherSnow: 'बर्फबारी',
    weatherMist: 'धुंध',
    weatherPartlyCloudy: 'आंशिक बादल',
    weatherOvercastClouds: 'घने बादल',
    weatherModerateRain: 'मध्यम बारिश',
    weatherHeavyRain: 'भारी बारिश',
    weatherHaze: 'धुंधलापन',
    // Settings
    settings: 'सेटिंग्स',
    saveSettings: 'सेटिंग्स सहेजें',
    settingsSaved: 'सेटिंग्स सहेज ली गईं!',
    personalSettings: 'व्यक्तिगत सेटिंग्स',
    farmSettings: 'खेत सेटिंग्स',
    appInfo: 'ऐप जानकारी',
    appVersion: 'ऐप संस्करण',
    changeLanguage: 'भाषा बदलें',
    changeLocation: 'शहर / स्थान बदलें',
    changeCrop: 'मुख्य फसल बदलें',
    changeSoilType: 'मिट्टी का प्रकार बदलें',
    changeFarmSize: 'खेत का आकार बदलें (एकड़)',
    changeIrrigation: 'सिंचाई प्रकार बदलें',
    madeForIndianFarmers: 'भारतीय किसानों के लिए बनाया गया 🇮🇳',
    // AI Advisory
    aiAdvisor: 'AI फसल सलाहकार',
    typeQuestion: 'अपना खेती सम्बंधित प्रश्न टाइप करें...',
    send: 'भेजें',
    thinking: 'सोच रहा हूँ...',
    quickQuestions: 'त्वरित प्रश्न',
    welcomeMessage: 'नमस्ते {name}! 🙏 मैं आपका Agrisaarthi सहायक हूँ। मुझे पता है आप {location} में {crop} उगा रहे हैं। मैं आज आपकी कैसे मदद कर सकता हूँ?',
    // Quick question buttons
    shouldIIrrigate: 'क्या मुझे आज सिंचाई करनी चाहिए? 💧',
    anyPestRisk: 'इस हफ्ते कोई कीट का खतरा? 🐛',
    whatFertilizer: 'मुझे कौन सा उर्वरक इस्तेमाल करना चाहिए? 🌱',
    isWeatherGood: 'क्या यह मौसम मेरी फसल के लिए अच्छा है? 🌤️',
    whatTodoToday: 'आज मुझे अपने खेत में क्या करना चाहिए? 📋',
    // Error
    weatherLoadError: 'मौसम डेटा लोड करने में विफल। कृपया पुनः प्रयास करें।',
};

const ta: TranslationMap = {
    // Core app
    appName: 'Agrisaarthi',
    tagline: 'உங்கள் ஸ்மார்ட் விவசாய துணை',
    greeting: 'வணக்கம், {name}!',
    madeForFarmers: 'இந்திய விவசாயிகளுக்காக உருவாக்கப்பட்டது',
    weather: 'வானிலை',
    aiAdvice: 'AI ஆலோசனை',
    cropCare: 'பயிர் பராமரிப்பு',
    welcome: 'Agrisaarthi-க்கு வரவேற்கிறோம்',
    welcomeDesc:
        'வானிலை முன்னறிவிப்பு, பயிர் மேலாண்மை மற்றும் AI-இயக்கப்படும் நுண்ணறிவுகளுக்கான ஸ்மார்ட் கருவிகளுடன் இந்திய விவசாயிகளை மேம்படுத்துதல்',
    next: 'அடுத்து',
    back: 'பின்',
    save: 'சேமி',
    step: 'படி {current} / {total}',
    personalInfo: 'தனிப்பட்ட தகவல்',
    farmInfo: 'பண்ணை தகவல்',
    confirmation: 'உறுதிப்படுத்தல்',
    name: 'முழுப் பெயர்',
    location: 'கிராமம் / மாவட்டம்',
    language: 'விரும்பும் மொழி',
    crop: 'முதன்மை பயிர்',
    soilType: 'மண் வகை',
    farmSize: 'பண்ணை அளவு (ஏக்கர்)',
    irrigationType: 'நீர்ப்பாசன வகை',
    startButton: 'Agrisaarthi-உடன் விவசாயத்தை தொடங்குங்கள்',
    loading: 'ஏற்றுகிறது...',
    // Weather & Crop Intelligence
    weatherTitle: 'வானிலை',
    cropStressIndex: 'பயிர் அழுத்த குறியீடு',
    todayAlerts: 'இன்றைய எச்சரிக்கைகள்',
    forecast: '5-நாள் முன்னறிவிப்பு',
    humidity: 'ஈரப்பதம்',
    wind: 'காற்று',
    rainfall: 'மழைப்பொழிவு',
    feelsLike: 'உணர்வு',
    goodConditions: 'நல்ல நிலைமை',
    moderateStress: 'மிதமான அழுத்தம்',
    highStress: 'அதிக அழுத்தம்',
    skipIrrigation: 'நீர்ப்பாசனம் தவிர்க்கவும்',
    heatAlert: 'வெப்ப எச்சரிக்கை',
    coldAlert: 'குளிர் எச்சரிக்கை',
    fungalRisk: 'பூஞ்சை ஆபத்து',
    windAlert: 'காற்று எச்சரிக்கை',
    optimalConditions: 'உகந்த நிலைமை',
    // Alert titles
    alertHeatStress: 'வெப்ப அழுத்த எச்சரிக்கை',
    alertColdStress: 'குளிர் அழுத்த எச்சரிக்கை',
    alertOptimalConditions: 'உகந்த நிலைமை',
    alertSkipIrrigation: 'நீர்ப்பாசனம் தவிர்க்கவும்',
    alertFungalRisk: 'பூஞ்சை நோய் ஆபத்து',
    alertLowHumidity: 'குறைந்த ஈரப்பத எச்சரிக்கை',
    alertHighWind: 'அதிக காற்று எச்சரிக்கை',
    alertAllClear: 'எல்லாம் நல்லது',
    alertSuboptimalTemp: 'சரிவற்ற வெப்பநிலை',
    alertLowRainfall: 'குறைந்த மழைப்பொழிவு எச்சரிக்கை',
    alertCropTip: 'பயிர் சிறப்பு குறிப்பு',
    // Alert descriptions
    descHeatStress: 'வெப்பநிலை {maxTemp}°C-க்கு மேல். {crop}-க்கு மல்ச்சிங் மற்றும் கூடுதல் நீர்ப்பாசனம் பரிந்துரைக்கப்படுகிறது.',
    descColdStress: 'வெப்பநிலை {minTemp}°C-க்கு கீழே. {crop} பயிர்களை பனியிலிருந்து பாதுகாக்கவும்.',
    descOptimalConditions: 'இன்று {crop}-க்கு நல்ல வளர்ச்சி நிலைமை.',
    descSkipIrrigation: 'மழை நிகழ்தகவு 70%-க்கு மேல். இன்று நீர்ப்பாசனம் தவிர்க்கவும், மழை எதிர்பார்க்கப்படுகிறது.',
    descFungalRisk: '{crop}-க்கு ஈரப்பதம் {maxHumidity}%-க்கு மேல். பூஞ்சை நோய் அதிக ஆபத்து, பயிர்களை கவனமாக ஆய்வு செய்யவும்.',
    descLowHumidity: '{crop}-க்கு ஈரப்பதம் {minHumidity}%-க்கு கீழே. பயிர் நீரிழப்பை தடுக்க நீர்ப்பாசனம் அதிகரிக்கவும்.',
    descHighWind: 'காற்று வேகம் {maxWind} km/h-க்கு மேல். இன்று {crop}-க்கு பூச்சிக்கொல்லி தெளிப்பதை தவிர்க்கவும்.',
    descAllClear: 'இன்று வானிலை கவலைகள் இல்லை. {crop}-க்கு நல்ல நிலைமை.',
    descSuboptimalTemp: '{crop}-க்கு வெப்பநிலை {minTemp}–{maxTemp}°C இலக்கு வரம்பிற்கு வெளியே. கவனமாக கண்காணிக்கவும்.',
    descLowRainfall: '{crop}-க்கு தேவையான {minRainfall}% மழை நிகழ்தகவை விட குறைவு. நீர்ப்பாசனம் பரிசீலிக்கவும்.',
    // Crop-specific tips
    descWheatHighTemp: 'கோதுமைக்கு அதிக வெப்பநிலை. மண்ணை குளிர்விக்க கூடுதல் நீர்ப்பாசனம் பரிசீலிக்கவும்.',
    descRiceLowHumidity: 'நெல்லுக்கு அதிக ஈரப்பதம் தேவை. நீர்ப்பாசன அமைப்பை சரிபார்க்கவும்.',
    descTomatoHighTemp: 'தக்காளிக்கு வெப்ப அழுத்தம். நிழல் வலை மற்றும் மல்ச்சிங் பரிந்துரைக்கப்படுகிறது.',
    descCottonHighHumidity: 'பருத்திக்கு அதிக ஈரப்பத ஆபத்து. காய்ப்புழு மற்றும் பூஞ்சை பிரச்சனைகளை கவனிக்கவும்.',
    descOnionColdTemp: 'வெங்காய வளர்ச்சிக்கு மிகவும் குளிர். பாதுகாப்பு உறை பரிசீலிக்கவும்.',
    // Stress descriptions
    stressGoodDesc: 'இன்று {crop}-க்கு சிறந்த நிலைமை!',
    stressModerateDesc: 'சில அழுத்த காரணிகள் — {crop}-ஐ கவனமாக கண்காணிக்கவும்.',
    stressHighDesc: 'அதிக அழுத்தம் கண்டறியப்பட்டது — {crop}-க்கு பாதுகாப்பு நடவடிக்கை எடுக்கவும்.',
    // Day names
    daySun: 'ஞாயிறு',
    dayMon: 'திங்கள்',
    dayTue: 'செவ்வாய்',
    dayWed: 'புதன்',
    dayThu: 'வியாழன்',
    dayFri: 'வெள்ளி',
    daySat: 'சனி',
    // Weather conditions
    weatherClearSky: 'தெளிவான வானம்',
    weatherFewClouds: 'சில மேகங்கள்',
    weatherScatteredClouds: 'சிதறிய மேகங்கள்',
    weatherBrokenClouds: 'உடைந்த மேகங்கள்',
    weatherShowerRain: 'மழைத் தூறல்',
    weatherRain: 'மழை',
    weatherLightRain: 'லேசான மழை',
    weatherThunderstorm: 'இடியுடன் புயல்',
    weatherSnow: 'பனிப்பொழிவு',
    weatherMist: 'மூடுபனி',
    weatherPartlyCloudy: 'பகுதி மேகமூட்டம்',
    weatherOvercastClouds: 'அடர்ந்த மேகங்கள்',
    weatherModerateRain: 'மிதமான மழை',
    weatherHeavyRain: 'கனமழை',
    weatherHaze: 'புகை மூட்டம்',
    // Settings
    settings: 'அமைப்புகள்',
    saveSettings: 'அமைப்புகளை சேமி',
    settingsSaved: 'அமைப்புகள் சேமிக்கப்பட்டன!',
    personalSettings: 'தனிப்பட்ட அமைப்புகள்',
    farmSettings: 'பண்ணை அமைப்புகள்',
    appInfo: 'ஆப் தகவல்',
    appVersion: 'ஆப் பதிப்பு',
    changeLanguage: 'மொழியை மாற்று',
    changeLocation: 'நகரம் / இடத்தை மாற்று',
    changeCrop: 'முதன்மை பயிரை மாற்று',
    changeSoilType: 'மண் வகையை மாற்று',
    changeFarmSize: 'பண்ணை அளவை மாற்று (ஏக்கர்)',
    changeIrrigation: 'நீர்ப்பாசன வகையை மாற்று',
    madeForIndianFarmers: 'இந்திய விவசாயிகளுக்காக உருவாக்கப்பட்டது 🇮🇳',
    // AI Advisory
    aiAdvisor: 'AI பயிர் ஆலோசகர்',
    typeQuestion: 'உங்கள் விவசாய கேள்வியை தட்டச்சு செய்க...',
    send: 'அனுப்பு',
    thinking: 'யோசிக்கிறது...',
    quickQuestions: 'விரைவு கேள்விகள்',
    welcomeMessage: 'வணக்கம் {name}! 🙏 நான் உங்கள் Agrisaarthi உதவியாளர். நீங்கள் {location} இல் {crop} வளர்க்கிறீர்கள் என்று எனக்குத் தெரியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    // Quick question buttons
    shouldIIrrigate: 'இன்று நீர்ப்பாசனம் செய்ய வேண்டுமா? 💧',
    anyPestRisk: 'இந்த வாரம் ஏதேனும் பூச்சி ஆபத்து? 🐛',
    whatFertilizer: 'நான் எந்த உரத்தை பயன்படுத்த வேண்டும்? 🌱',
    isWeatherGood: 'இந்த வானிலை என் பயிருக்கு நல்லதா? 🌤️',
    whatTodoToday: 'இன்று என் பண்ணையில் நான் என்ன செய்ய வேண்டும்? 📋',
    // Error
    weatherLoadError: 'வானிலை தரவை ஏற்றுவதில் தோல்வி. மீண்டும் முயற்சிக்கவும்.',
};

const te: TranslationMap = {
    // Core app
    appName: 'Agrisaarthi',
    tagline: 'మీ స్మార్ట్ వ్యవసాయ సహచరుడు',
    greeting: 'నమస్తే, {name}!',
    madeForFarmers: 'భారతీయ రైతుల కోసం తయారు చేయబడింది',
    weather: 'వాతావరణం',
    aiAdvice: 'AI సలహా',
    cropCare: 'పంట సంరక్షణ',
    welcome: 'Agrisaarthiకి స్వాగతం',
    welcomeDesc:
        'వాతావరణ అంచనా, పంట నిర్వహణ మరియు AI-ఆధారిత అంతర్దృష్టుల కోసం స్మార్ట్ సాధనాలతో భారతీయ రైతులను సాధికారత చేయడం',
    next: 'తదుపరి',
    back: 'వెనుకకు',
    save: 'సేవ్',
    step: 'దశ {current} / {total}',
    personalInfo: 'వ్యక్తిగత సమాచారం',
    farmInfo: 'పొలం సమాచారం',
    confirmation: 'నిర్ధారణ',
    name: 'పూర్తి పేరు',
    location: 'గ్రామం / జిల్లా',
    language: 'ఇష్టమైన భాష',
    crop: 'ప్రాథమిక పంట',
    soilType: 'నేల రకం',
    farmSize: 'పొలం పరిమాణం (ఎకరాలు)',
    irrigationType: 'నీటిపారుదల రకం',
    startButton: 'Agrisaarthiతో వ్యవసాయం ప్రారంభించండి',
    loading: 'లోడ్ అవుతోంది...',
    // Weather & Crop Intelligence
    weatherTitle: 'వాతావరణం',
    cropStressIndex: 'పంట ఒత్తిడి సూచిక',
    todayAlerts: 'నేటి హెచ్చరికలు',
    forecast: '5-రోజుల అంచనా',
    humidity: 'తేమ',
    wind: 'గాలి',
    rainfall: 'వర్షపాతం',
    feelsLike: 'అనిపిస్తుంది',
    goodConditions: 'మంచి పరిస్థితులు',
    moderateStress: 'మోస్తరు ఒత్తిడి',
    highStress: 'అధిక ఒత్తిడి',
    skipIrrigation: 'నీటిపారుదల వదిలివేయండి',
    heatAlert: 'వేడి హెచ్చరిక',
    coldAlert: 'చలి హెచ్చరిక',
    fungalRisk: 'శిలీంధ్ర ప్రమాదం',
    windAlert: 'గాలి హెచ్చరిక',
    optimalConditions: 'అనుకూల పరిస్థితులు',
    // Alert titles
    alertHeatStress: 'వేడి ఒత్తిడి హెచ్చరిక',
    alertColdStress: 'చలి ఒత్తిడి హెచ్చరిక',
    alertOptimalConditions: 'అనుకూల పరిస్థితులు',
    alertSkipIrrigation: 'నీటిపారుదల వదిలివేయండి',
    alertFungalRisk: 'శిలీంధ్ర వ్యాధి ప్రమాదం',
    alertLowHumidity: 'తక్కువ తేమ హెచ్చరిక',
    alertHighWind: 'అధిక గాలి హెచ్చరిక',
    alertAllClear: 'అంతా బాగుంది',
    alertSuboptimalTemp: 'అసాధారణ ఉష్ణోగ్రత',
    alertLowRainfall: 'తక్కువ వర్షపాతం హెచ్చరిక',
    alertCropTip: 'పంట ప్రత్యేక సూచన',
    // Alert descriptions
    descHeatStress: 'ఉష్ణోగ్రత {maxTemp}°C పైన. {crop} కోసం మల్చింగ్ మరియు అదనపు నీటిపారుదల సిఫార్సు.',
    descColdStress: 'ఉష్ణోగ్రత {minTemp}°C కంటే తక్కువ. {crop} పంటలను మంచు నుండి రక్షించండి.',
    descOptimalConditions: 'ఈ రోజు {crop} కోసం మంచి పెరుగుదల పరిస్థితులు.',
    descSkipIrrigation: 'వర్షం సంభావ్యత 70% పైన. ఈ రోజు నీటిపారుదల వదిలివేయండి, వర్షం ఊహించబడుతోంది.',
    descFungalRisk: '{crop} కోసం తేమ {maxHumidity}% పైన. శిలీంధ్ర వ్యాధి అధిక ప్రమాదం, పంటలను జాగ్రత్తగా తనిఖీ చేయండి.',
    descLowHumidity: '{crop} కోసం తేమ {minHumidity}% కంటే తక్కువ. పంట నిర్జలీకరణను నిరోధించడానికి నీటిపారుదల పెంచండి.',
    descHighWind: 'గాలి వేగం {maxWind} km/h పైన. ఈ రోజు {crop} కోసం పురుగుమందు చల్లడం మానుకోండి.',
    descAllClear: 'ఈ రోజు వాతావరణ ఆందోళనలు లేవు. {crop} కోసం మంచి పరిస్థితులు.',
    descSuboptimalTemp: '{crop} కోసం ఉష్ణోగ్రత {minTemp}–{maxTemp}°C ఆదర్శ పరిధికి బయట. జాగ్రత్తగా పర్యవేక్షించండి.',
    descLowRainfall: '{crop} కోసం అవసరమైన {minRainfall}% వర్షం కంటే తక్కువ. నీటిపారుదల పరిగణించండి.',
    // Crop-specific tips
    descWheatHighTemp: 'గోధుమకు అధిక ఉష్ణోగ్రత. నేలను చల్లబరచడానికి అదనపు నీటిపారుదల పరిగణించండి.',
    descRiceLowHumidity: 'వరికి అధిక తేమ అవసరం. నీటిపారుదల వ్యవస్థను తనిఖీ చేయండి.',
    descTomatoHighTemp: 'టమాటోకు వేడి ఒత్తిడి. నీడ వలలు మరియు మల్చింగ్ సిఫార్సు.',
    descCottonHighHumidity: 'పత్తికి అధిక తేమ ప్రమాదం. గుజ్జు పురుగు మరియు శిలీంధ్ర సమస్యలను గమనించండి.',
    descOnionColdTemp: 'ఉల్లి పెరుగుదలకు చాలా చల్లగా. రక్షణ కప్పు పరిగణించండి.',
    // Stress descriptions
    stressGoodDesc: 'ఈ రోజు {crop} కోసం అద్భుతమైన పరిస్థితులు!',
    stressModerateDesc: 'కొన్ని ఒత్తిడి కారకాలు — {crop}ను జాగ్రత్తగా పర్యవేక్షించండి.',
    stressHighDesc: 'అధిక ఒత్తిడి గుర్తించబడింది — {crop} కోసం రక్షణ చర్యలు తీసుకోండి.',
    // Day names
    daySun: 'ఆది',
    dayMon: 'సోమ',
    dayTue: 'మంగళ',
    dayWed: 'బుధ',
    dayThu: 'గురు',
    dayFri: 'శుక్ర',
    daySat: 'శని',
    // Weather conditions
    weatherClearSky: 'స్వచ్ఛమైన ఆకాశం',
    weatherFewClouds: 'కొన్ని మేఘాలు',
    weatherScatteredClouds: 'చెదురుమదురు మేఘాలు',
    weatherBrokenClouds: 'విరిగిన మేఘాలు',
    weatherShowerRain: 'జల్లు వర్షం',
    weatherRain: 'వర్షం',
    weatherLightRain: 'తేలికపాటి వర్షం',
    weatherThunderstorm: 'ఉరుములతో తుఫాను',
    weatherSnow: 'మంచు కురిసింది',
    weatherMist: 'పొగమంచు',
    weatherPartlyCloudy: 'పాక్షిక మేఘావృతం',
    weatherOvercastClouds: 'దట్టమైన మేఘాలు',
    weatherModerateRain: 'మోస్తరు వర్షం',
    weatherHeavyRain: 'భారీ వర్షం',
    weatherHaze: 'మసక',
    // Settings
    settings: 'సెట్టింగ్‌లు',
    saveSettings: 'సెట్టింగ్‌లు సేవ్ చేయండి',
    settingsSaved: 'సెట్టింగ్‌లు సేవ్ చేయబడ్డాయి!',
    personalSettings: 'వ్యక్తిగత సెట్టింగ్‌లు',
    farmSettings: 'పొలం సెట్టింగ్‌లు',
    appInfo: 'యాప్ సమాచారం',
    appVersion: 'యాప్ వెర్షన్',
    changeLanguage: 'భాషను మార్చండి',
    changeLocation: 'నగరం / ప్రదేశం మార్చండి',
    changeCrop: 'ప్రాథమిక పంటను మార్చండి',
    changeSoilType: 'నేల రకాన్ని మార్చండి',
    changeFarmSize: 'పొలం పరిమాణం మార్చండి (ఎకరాలు)',
    changeIrrigation: 'నీటిపారుదల రకాన్ని మార్చండి',
    madeForIndianFarmers: 'భారతీయ రైతుల కోసం తయారు చేయబడింది 🇮🇳',
    // AI Advisory
    aiAdvisor: 'AI పంట సలహాదారు',
    typeQuestion: 'మీ వ్యవసాయ ప్రశ్నను టైప్ చేయండి...',
    send: 'పంపు',
    thinking: 'ఆలోచిస్తోంది...',
    quickQuestions: 'శీఘ్ర ప్రశ్నలు',
    welcomeMessage: 'నమస్తే {name}! 🙏 నేను మీ Agrisaarthi సహాయకుడిని. మీరు {location} లో {crop} పండిస్తున్నారని నాకు తెలుసు. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?',
    // Quick question buttons
    shouldIIrrigate: 'నేను ఈ రోజు నీటిపారుదల చేయాలా? 💧',
    anyPestRisk: 'ఈ వారం ఏదైనా పురుగు ప్రమాదం ఉందా? 🐛',
    whatFertilizer: 'నేను ఏ ఎరువు వాడాలి? 🌱',
    isWeatherGood: 'ఈ వాతావరణం నా పంటకు మంచిదా? 🌤️',
    whatTodoToday: 'ఈ రోజు నా పొలంలో నేను ఏమి చేయాలి? 📋',
    // Error
    weatherLoadError: 'వాతావరణ డేటా లోడ్ చేయడంలో విఫలం. దయచేసి మళ్లీ ప్రయత్నించండి.',
};

// ── Master translations object ──────────────────────────────────────
export const translations: Record<SupportedLanguage, TranslationMap> = {
    en,
    hi,
    ta,
    te,
};

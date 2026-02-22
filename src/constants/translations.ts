/**
 * translations.ts
 * Complete translation dictionary for Agrisaarthi.
 *
 * Supports 4 languages: English (en), Hindi (hi), Tamil (ta), Telugu (te).
 * Placeholders like {name}, {current}, {total} are replaced at runtime
 * by the useTranslation hook's t() function.
 */

// ── Supported language codes ────────────────────────────────────────
export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te';

// ── All available translation keys ──────────────────────────────────
export type TranslationKey =
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
    | 'loading';

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

// ── Translation dictionaries ────────────────────────────────────────

const en: TranslationMap = {
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
};

const hi: TranslationMap = {
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
};

const ta: TranslationMap = {
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
};

const te: TranslationMap = {
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
};

// ── Master translations object ──────────────────────────────────────
export const translations: Record<SupportedLanguage, TranslationMap> = {
    en,
    hi,
    ta,
    te,
};

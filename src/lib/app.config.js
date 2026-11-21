// UGC Ads — a vertical "creator talks to camera" ad for your product, with the creator speaking your script.
// Two steps (the page runs them one after another):
//   1) nano-banana-2-1-edit builds the start frame: a creator holding YOUR product (the real packaging stays),
//   2) Veo 3.1 Lite / Fast (image → video) animates that frame with sound and the spoken line.
// Mode "ready photo": your own photo of a person with the product goes straight to step 2.

export const FRAME_MODEL = "nano-banana-2-1-edit";
export const VIDEO_MODELS = { lite: "veo31-lite-i2v", fast: "veo31-fast-i2v" };
export const SETTINGS = [
  { id: "home", label: { en: "Cozy home", ru: "Уютный дом" }, prompt: "a cozy, softly lit living room at home" },
  { id: "bathroom", label: { en: "Bathroom", ru: "Ванная" }, prompt: "a clean bright bathroom with a mirror" },
  { id: "kitchen", label: { en: "Kitchen", ru: "Кухня" }, prompt: "a modern home kitchen in morning light" },
  { id: "car", label: { en: "In the car", ru: "В машине" }, prompt: "the driver's seat of a parked car, daylight through the windows" },
  { id: "street", label: { en: "Street", ru: "Улица" }, prompt: "a city street, golden-hour light" },
  { id: "gym", label: { en: "Gym", ru: "Спортзал" }, prompt: "a bright gym" },
  { id: "office", label: { en: "Desk / office", ru: "Рабочий стол" }, prompt: "a home office desk with a laptop" },
];
export const STYLES = [
  { id: "testimonial", label: { en: "Honest review", ru: "Честный отзыв" }, prompt: "An honest testimonial, talking to the camera like to a friend" },
  { id: "unboxing", label: { en: "Unboxing", ru: "Распаковка" }, prompt: "An excited unboxing, showing the product to the camera" },
  { id: "demo", label: { en: "How I use it", ru: "Как пользуюсь" }, prompt: "A quick demo of using the product" },
  { id: "problem", label: { en: "Problem → solution", ru: "Проблема → решение" }, prompt: "A relatable problem first, then the product as the fix" },
];
export const QUALITY = [
  { id: "lite", label: { en: "Standard", ru: "Стандарт" } },
  { id: "fast", label: { en: "Higher quality", ru: "Качество выше" } },
];

export const APP = {
  id: "ugc-ads",
  name: "UGC Ads",
  theme: "sunset",
  chain: true,
  tagline: { en: "Product photo → creator ad", ru: "Фото товара → реклама от блогера" },
  kicker: { en: "AI UGC video ads", ru: "ИИ-реклама в стиле UGC" },
  headline: { en: "A creator-style video ad for your product — from one photo", ru: "Реклама вашего товара в стиле блогера — из одного фото" },
  description: {
    en: "Add a photo of the product and write what the creator should say. AI places a creator with YOUR product in a real-life setting and turns it into an 8-second vertical video with voice — ready for Reels, TikTok and Shorts.",
    ru: "Добавьте фото товара и напишите, что должен сказать блогер. ИИ поставит в кадр человека с ВАШИМ товаром в жизненной обстановке и сделает вертикальное видео на 8 секунд с голосом — для Reels, TikTok и Shorts.",
  },
  cta: { en: "Create ad", ru: "Создать рекламу" },
  emptyText: { en: "Add the product photo and the script, then press “Create ad”. It takes 2–5 minutes.", ru: "Добавьте фото товара и текст, затем нажмите «Создать рекламу». Это займёт 2–5 минут." },
  needText: { en: "Add the photo and the line the creator says.", ru: "Добавьте фото и фразу, которую скажет блогер." },
  models: [FRAME_MODEL, ...Object.values(VIDEO_MODELS)],
  upload: { types: ["image/jpeg", "image/png", "image/webp"], maxBytes: 20 * 1024 * 1024 },
  modes: [
    { id: "product", label: { en: "Product photo → AI creator", ru: "Фото товара → ИИ-блогер" },
      desc: { en: "AI creates the creator holding your product, then animates it.", ru: "ИИ создаст кадр с человеком и вашим товаром, затем оживит его." } },
    { id: "ready", label: { en: "My photo of a person with the product", ru: "Моё фото человека с товаром" },
      desc: { en: "Your photo is animated directly — one step.", ru: "Ваше фото сразу оживает — один шаг." } },
  ],
  slots: [
    { key: "product", kind: "image", min: 1, max: 1, modes: ["product"],
      label: { en: "Product photo", ru: "Фото товара" },
      hint: { en: "The packaging or item clearly visible, plain background is best.", ru: "Упаковка или вещь хорошо видна, лучше на однотонном фоне." } },
    { key: "creator", kind: "image", min: 0, max: 1, modes: ["product"],
      label: { en: "Creator photo (optional)", ru: "Фото блогера (необязательно)" },
      hint: { en: "Only with the person's consent. Without it AI creates a new person from your description.", ru: "Только с согласия человека. Без фото ИИ создаст нового человека по описанию." } },
    { key: "photo", kind: "image", min: 1, max: 1, modes: ["ready"],
      label: { en: "Photo of a person with the product", ru: "Фото человека с товаром" },
      hint: { en: "Vertical photo works best.", ru: "Лучше вертикальное фото." } },
  ],
  compare: false,
  initialState: () => ({ mode: "product", script: "", persona: "", setting: "home", style: "testimonial", quality: "lite" }),
  ready: (s) => s.script.trim().length >= 3 && s.script.length <= 300,
  priceModel: (s) => VIDEO_MODELS[s.quality] || VIDEO_MODELS.lite,
  priceText: (s, prices) => {
    const v = prices?.[VIDEO_MODELS[s.quality] || VIDEO_MODELS.lite]?.cents;
    const f = prices?.[FRAME_MODEL]?.cents;
    if (v == null) return null;
    if (s.mode === "ready" || f == null) return `$${(v / 100).toFixed(2)}`;
    return `$${(f / 100).toFixed(2)} + $${(v / 100).toFixed(2)} = $${((f + v) / 100).toFixed(2)}`;
  },
  label: (s) => s.script.slice(0, 60),
};

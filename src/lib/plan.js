import "server-only";
import { FRAME_MODEL, VIDEO_MODELS, SETTINGS, STYLES } from "@/lib/app.config";
import { PlanError, urls, text } from "@/lib/plan-helpers";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function videoJob(body, image) {
  const script = text(body.script, 300);
  const style = STYLES.find((x) => x.id === body.style) || STYLES[0];
  const prompt =
    `Vertical 9:16 user-generated-content style ad, shot on a phone held by the creator (selfie framing, natural handheld ` +
    `micro-movements). ${style.prompt}. The person in the frame looks into the camera and says, with natural lip sync and ` +
    `an authentic, upbeat but believable tone: "${script.replace(/"/g, "'")}". Keep the product exactly as it is in the ` +
    `frame — same packaging, label and colors, the label facing the camera. Real skin texture, natural light, ambient room ` +
    `sound, no music, no on-screen text, no subtitles.`;
  return {
    model: VIDEO_MODELS[body.quality] || VIDEO_MODELS.lite,
    prompt,
    params: { aspect_ratio: "9:16", resolution: "720p" },
    inputs: { image_urls: [image] },
  };
}

// Step 1 → start frame, step 2 (body.chain.from = id of the finished frame) → video.
export function plan(body) {
  const script = text(body.script, 300);
  if (script.length < 3) throw new PlanError("Write what the creator says", "missing_input");

  if (body.chain && UUID.test(String(body.chain.from || ""))) {
    // The API accepts the id of one of the key owner's finished generations as an input file.
    return [videoJob(body, String(body.chain.from))];
  }
  if (body.mode === "ready") {
    const [photo] = urls(body.inputs, "photo", { name: "photo of a person with the product" });
    return [videoJob(body, photo)];
  }
  const [product] = urls(body.inputs, "product", { name: "product photo" });
  const creator = urls(body.inputs, "creator", { min: 0, max: 1 });
  const setting = SETTINGS.find((x) => x.id === body.setting) || SETTINGS[0];
  const persona = text(body.persona, 200);
  const who = creator.length
    ? "the same person as in the second reference photo (keep the exact face, hair and skin tone)"
    : `a friendly, natural-looking content creator${persona ? `: ${persona}` : " in their late twenties"}`;
  const prompt =
    `Photorealistic vertical smartphone selfie photo, 9:16: ${who} in ${setting.prompt}, holding the product from the ` +
    `first reference photo next to their face, label facing the camera, mid-sentence expression as if recording a story ` +
    `for followers. The product must be an exact copy of the reference: same shape, packaging, label text, logo and colors, ` +
    `realistic size in the hand. Natural light, real skin texture, slight phone-camera look, uncluttered background, no text overlays.`;
  return [{
    model: FRAME_MODEL,
    prompt,
    params: { aspect_ratio: "9:16", resolution: "1k" },
    inputs: { image_urls: [product, ...creator] },
  }];
}

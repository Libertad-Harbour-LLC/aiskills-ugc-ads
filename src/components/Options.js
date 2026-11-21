"use client";

import { SETTINGS, STYLES, QUALITY } from "@/lib/app.config";
import { useLang } from "@/lib/i18n";

export default function Options({ state, set, Chips, Field }) {
  const { lang, tx } = useLang();
  const ru = lang === "ru";
  const words = state.script.trim() ? state.script.trim().split(/\s+/).length : 0;
  const lab = (list) => (id) => tx(list.find((x) => x.id === id).label);
  return (
    <>
      <Field label={ru ? "Что говорит блогер" : "What the creator says"} required rows={3} max={300} value={state.script} onChange={(v) => set({ script: v })}
        hint={ru ? `8 секунд — это примерно 15–22 слова. Сейчас: ${words}.` : `8 seconds is about 15–22 words. Now: ${words}.`}
        placeholder={ru ? "Честно, этот крем изменил мои утра — кожа выглядит отдохнувшей за пять минут." : "Honestly, this serum changed my mornings — my skin looks awake in five minutes."} />
      {words > 24 && <p className="text-xs text-secondary-500">{ru ? "Длинный текст может не поместиться в 8 секунд." : "A long line may not fit into 8 seconds."}</p>}
      {state.mode === "product" && (
        <>
          <Field label={ru ? "Кто в кадре (если нет фото)" : "Who is in the frame (if no photo)"} value={state.persona} onChange={(v) => set({ persona: v })}
            placeholder={ru ? "Девушка 25 лет, тёмные кудрявые волосы, худи" : "Woman, 25, dark curly hair, hoodie"} />
          <Chips label={ru ? "Обстановка" : "Setting"} options={SETTINGS.map((x) => x.id)} value={state.setting} onChange={(v) => set({ setting: v })} render={lab(SETTINGS)} />
        </>
      )}
      <Chips label={ru ? "Подача" : "Ad style"} options={STYLES.map((x) => x.id)} value={state.style} onChange={(v) => set({ style: v })} render={lab(STYLES)} />
      <Chips label={ru ? "Качество видео" : "Video quality"} options={QUALITY.map((x) => x.id)} value={state.quality} onChange={(v) => set({ quality: v })} render={lab(QUALITY)} />
      <p className="text-xs text-secondary-text">
        {ru ? "Видео: 8 секунд, 9:16, со звуком. Речь можно писать на любом языке; лучше всего модель говорит по-английски."
          : "Video: 8 seconds, 9:16, with sound. The line can be in any language; English sounds best."}
      </p>
    </>
  );
}

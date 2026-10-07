"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

type DailyCounterProps = {
  action: (formData: FormData) => void | Promise<void>;
  day: string;
  fieldName: "milliliters" | "count";
  icon: StaticImageData;
  iconAlt: string;
  step: number;
  suffix?: string;
};

export function DailyCounter({ action, day, fieldName, icon, iconAlt, step, suffix }: DailyCounterProps) {
  const [amount, setAmount] = useState(0);
  const decrease = () => setAmount((current) => Math.max(0, current - step));
  const increase = () => setAmount((current) => current + step);

  return <form action={action} className="counter-form">
    <input type="hidden" name="date" value={day}/>
    <input type="hidden" name={fieldName} value={amount}/>
    <Image className="tracker-icon" src={icon} alt={iconAlt} width={50} height={50}/>
    <div className="counter-controls" aria-label={`Quantidade: ${amount}${suffix ? ` ${suffix}` : ""}`}>
      <button className="counter-button counter-minus" type="button" onClick={decrease} aria-label="Diminuir">▬</button>
      <output aria-live="polite">{amount}{suffix && <span> {suffix}</span>}</output>
      <button className="counter-button" type="button" onClick={increase} aria-label="Aumentar">✚</button>
    </div>
    <button className="button counter-register" type="submit" disabled={amount === 0}>Registrar</button>
  </form>;
}

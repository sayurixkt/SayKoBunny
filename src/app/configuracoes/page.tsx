import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { localDate } from "@/lib/dates";
import { deleteBasalRate, saveBasalRate, saveGoals } from "./actions";

export default async function Settings() {
  await requireAuth();
  const [goals, basalRates] = await Promise.all([prisma.dailyGoals.findUnique({ where: { id: "default" } }), prisma.basalRate.findMany({ orderBy: { effectiveDate: "desc" } })]);
  const values = goals ?? { calories: 1265, protein: 132, carbs: 120, fat: 31, waterMl: 3100 };
  const dateFormat = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" });
  return <main className="shell"><nav className="nav"><Link className="return-link" href="/">⤶ voltar</Link><span>Configurações</span></nav><p className="eyebrow">✦ seu ritmo, suas regras</p><h1>Metas & basal</h1>
    <section className="settings-grid"><section className="card"><h2>Metas diárias</h2><p>Usadas para acompanhar o Diário.</p><form action={saveGoals} className="food-form"><label className="field">Calorias (kcal)<input name="calories" type="number" min="0" step="1" defaultValue={String(values.calories)} required/></label><label className="field">Proteínas (g)<input name="protein" type="number" min="0" step="0.1" defaultValue={String(values.protein)} required/></label><label className="field">Carboidratos (g)<input name="carbs" type="number" min="0" step="0.1" defaultValue={String(values.carbs)} required/></label><label className="field">Gorduras (g)<input name="fat" type="number" min="0" step="0.1" defaultValue={String(values.fat)} required/></label><label className="field wide">Água (ml)<input name="waterMl" type="number" min="1" step="1" defaultValue={String(values.waterMl)} required/></label><div className="form-actions"><button className="button">Salvar metas</button></div></form></section>
      <section className="card"><h2>Taxa metabólica basal</h2><p>Registre um valor padrão a partir de uma data. O Diário considera o registro mais recente até o dia consultado.</p><form action={saveBasalRate} className="compact-form"><input name="effectiveDate" type="date" defaultValue={localDate()} required/><input name="calories" type="number" min="0" step="1" placeholder="kcal/dia" required/><button className="button">Salvar</button></form><div className="entries">{basalRates.length ? basalRates.map((rate) => <div key={rate.id}><span>{dateFormat.format(rate.effectiveDate)} · {Number(rate.calories).toLocaleString("pt-BR")} kcal/dia</span><form action={deleteBasalRate}><input name="id" type="hidden" value={rate.id}/><button className="text-button">Remover</button></form></div>) : <p>Ainda não há taxa basal cadastrada.</p>}</div></section></section>
  </main>;
}

import Link from "next/link";
import { archiveMeal, createMeal, duplicateMeal } from "./actions";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { sumNutrition } from "@/lib/nutrition";

const format = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
export default async function MealsPage() {
  await requireAuth();
  const meals = await prisma.meal.findMany({ include: { items: { include: { food: true } } }, orderBy: [{ archived: "asc" }, { updatedAt: "desc" }] });
  const activeMeals = meals.filter((meal) => !meal.archived);
  const archivedMeals = meals.filter((meal) => meal.archived);
  const mealCard = (meal: (typeof meals)[number]) => { const total = sumNutrition(meal.items); return <article className="card food" key={meal.id}><div className="food-head"><div><h2>{meal.name}</h2><span>{meal.archived ? "Arquivada" : `${meal.items.length} ingrediente${meal.items.length === 1 ? "" : "s"}`}</span></div><Link className="ghost" href={`/marmitas/${meal.id}`}>Abrir</Link></div><p>{meal.description || "Sem descrição"}</p><dl><div><dt>kcal totais</dt><dd>{format.format(total.calories)}</dd></div><div><dt>proteínas</dt><dd>{format.format(total.protein)} g</dd></div></dl><div className="inline-actions"><form action={duplicateMeal}><input type="hidden" name="id" value={meal.id}/><button className="text-button">Duplicar</button></form><form action={archiveMeal}><input type="hidden" name="id" value={meal.id}/><input type="hidden" name="archived" value={String(!meal.archived)}/><button className="text-button">{meal.archived ? "Reativar" : "Arquivar"}</button></form></div></article>; };
  return <main className="shell"><nav className="nav"><Link className="return-link" href="/">⤶ voltar</Link></nav><p className="eyebrow">✦ marmitas</p><h1>Marmitas</h1>
    <section className="card form-card"><h2>Nova marmita</h2><form action={createMeal} className="food-form"><label className="field wide">Nome<input name="name" placeholder="Ex.: Frango com arroz" required /></label><label className="field wide">Descrição opcional<input name="description" placeholder="Observações para você" /></label><div className="form-actions"><button className="button">Montar marmita</button></div></form></section>
    {archivedMeals.length > 0 && <details className="archive-folder"><summary>🗀 arquivados <span>{archivedMeals.length}</span></summary><section className="food-list">{archivedMeals.map(mealCard)}</section></details>}
    {activeMeals.length === 0 ? <div className="card empty"><p>{meals.length === 0 ? "Crie sua primeira marmita para começar a combinar seus alimentos." : "Não há marmitas ativas no momento."}</p></div> : <section className="food-list">{activeMeals.map(mealCard)}</section>}
  </main>;
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { addItem, changeGrams, removeItem, updateMeal } from "./actions";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";
import { portionNutrition, sumNutrition } from "@/lib/nutrition";

const format = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
export default async function MealDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth(); const { id } = await params;
  const [meal, foods] = await Promise.all([prisma.meal.findUnique({ where: { id }, include: { items: { include: { food: true }, orderBy: { createdAt: "asc" } } } }), prisma.food.findMany({ where: { active: true }, orderBy: { name: "asc" } })]);
  if (!meal) notFound(); const total = sumNutrition(meal.items);
  return <main className="shell"><nav className="nav"><Link className="return-link" href="/marmitas">⤶ voltar</Link></nav><p className="eyebrow">♡ editar refeição</p><h1>{meal.name}</h1>
    <section className="card form-card"><h2>Detalhes</h2><form action={updateMeal} className="food-form"><input type="hidden" name="mealId" value={meal.id}/><label className="field wide">Nome<input name="name" defaultValue={meal.name} required/></label><label className="field wide">Descrição<input name="description" defaultValue={meal.description ?? ""}/></label><div className="form-actions"><button className="ghost">Salvar detalhes</button></div></form></section>
    <section className="card form-card"><h2>Adicionar ingrediente</h2>{foods.length === 0 ? <p>Cadastre alimentos ativos antes de montar esta marmita.</p> : <form action={addItem} className="food-form"><input type="hidden" name="mealId" value={meal.id}/><label className="field wide">Alimento<select name="foodId" defaultValue=""> <option value="" disabled>Selecione um alimento</option>{foods.map((food) => <option key={food.id} value={food.id}>{food.name}</option>)}</select></label><label className="field">Quantidade (g)<input name="grams" type="number" min="0.01" step="0.01" required/></label><div className="form-actions"><button className="button">Adicionar item</button></div></form>}</section>
    <section className="list-section"><h2>Composição e totais</h2><div className="nutrition-total card"><b>{format.format(total.calories)} kcal</b><span>{format.format(total.protein)} g proteína · {format.format(total.carbs)} g carboidrato · {format.format(total.fat)} g gordura</span></div>{meal.items.length === 0 ? <div className="card empty"><p>Esta marmita ainda não tem ingredientes.</p></div> : <div className="item-list">{meal.items.map((item) => { const portion = portionNutrition(item.food, item.grams); return <article key={item.id} className="card meal-item"><div><h2>{item.food.name}</h2><p>{format.format(portion.calories)} kcal · P {format.format(portion.protein)} g · C {format.format(portion.carbs)} g · G {format.format(portion.fat)} g</p></div><div className="inline-actions"><form action={changeGrams}><input type="hidden" name="mealId" value={meal.id}/><input type="hidden" name="itemId" value={item.id}/><input className="grams" name="grams" type="number" min="0.01" step="0.01" defaultValue={item.grams.toString()}/><button className="text-button">Atualizar</button></form><form action={removeItem}><input type="hidden" name="mealId" value={meal.id}/><input type="hidden" name="itemId" value={item.id}/><button className="text-button">Remover</button></form></div></article> })}</div>}</section>
  </main>;
}

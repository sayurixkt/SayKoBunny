import { addBowel, addExercise, addFoodLog, addWater, deleteLog } from "@/app/diario/actions";
import { DailyCounter } from "@/components/daily-counter";
import waterIcon from "@/components/agua.png";
import exerciseIcon from "@/components/atividadefisica.png";
import bowelIcon from "@/components/intestinal.png";
import mealIcon from "@/components/refeições.png";
import { prisma } from "@/lib/prisma";
import { databaseDate, dayRange, localDate } from "@/lib/dates";
import { sumNutrition } from "@/lib/nutrition";

const format = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
const periods = [
  ["CAFE_DA_MANHA", "café da manhã"],
  ["ALMOCO", "almoço"],
  ["CAFE_DA_TARDE", "café da tarde"],
  ["JANTAR", "jantar"],
] as const;

export default async function DiaryContent({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const day = (await searchParams).date ?? localDate(); const range = dayRange(day);
  const [meals, foods, foodLogs, waterLogs, bowel, exercises, goals, basalRate] = await Promise.all([
    prisma.meal.findMany({ where: { archived: false }, orderBy: { name: "asc" } }),
    prisma.food.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    prisma.foodLog.findMany({ where: { date: range }, include: { meal: { include: { items: { include: { food: true } } } }, food: true } }),
    prisma.waterLog.findMany({ where: { date: range } }), prisma.bowelMovement.findMany({ where: { occurredAt: range }, orderBy: { occurredAt: "asc" } }), prisma.exerciseLog.findMany({ where: { date: range }, orderBy: { createdAt: "desc" } }), prisma.dailyGoals.findUnique({ where: { id: "default" } }), prisma.basalRate.findFirst({ where: { effectiveDate: { lte: databaseDate(day) } }, orderBy: { effectiveDate: "desc" } }),
  ]);
  const nutrition = foodLogs.reduce((total, log) => {
    const n = log.meal ? sumNutrition(log.meal.items) : log.food ? { calories: Number(log.food.calories), protein: Number(log.food.protein), carbs: Number(log.food.carbs), fat: Number(log.food.fat) } : { calories: 0, protein: 0, carbs: 0, fat: 0 };
    return { calories: total.calories + n.calories * Number(log.portions), protein: total.protein + n.protein * Number(log.portions), carbs: total.carbs + n.carbs * Number(log.portions), fat: total.fat + n.fat * Number(log.portions) };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const water = waterLogs.reduce((sum, log) => sum + log.milliliters, 0); const burned = exercises.reduce((sum, log) => sum + Number(log.caloriesBurned), 0);
  const remove = (kind: string, itemId: string) => <form action={deleteLog}><input type="hidden" name="date" value={day}/><input type="hidden" name="kind" value={kind}/><input type="hidden" name="id" value={itemId}/><button className="text-button">Remover</button></form>;
  const foodLogLabel = (log: (typeof foodLogs)[number]) => log.meal ? `${log.meal.name} · 1 porção` : log.food ? `${log.food.name} · ${format.format(Number(log.portions) * 100)} g` : "Registro indisponível";

  return <><p className="eyebrow">✦ wellness diary</p><h1 className="home-title">stay focused</h1><form className="date-picker"><label>Data <input type="date" name="date" defaultValue={day}/></label><button className="ghost">Ver dia</button></form>
    <section className="metrics"><div className="card"><b>{format.format(nutrition.calories)}</b><span>kcal de {format.format(Number(goals?.calories ?? 1265))}</span></div><div className="card"><b>{format.format(nutrition.protein)} g</b><span>proteínas de {format.format(Number(goals?.protein ?? 132))} g</span></div><div className="card"><b>{water} ml</b><span>água de {goals?.waterMl ?? 3100} ml</span></div><div className="card"><b>{format.format(burned)} kcal</b><span>atividade física</span></div>{basalRate && <div className="card"><b>{format.format(Number(basalRate.calories))} kcal</b><span>taxa basal</span></div>}</section>
    <section className="diary-grid"><section className="card"><h2>Refeições</h2><img className="tracker-icon" src={mealIcon.src} alt="" width="50" height="50"/><form action={addFoodLog} className="meal-form"><input type="hidden" name="date" value={day}/><select name="mealPeriod" defaultValue="CAFE_DA_MANHA" aria-label="Período da refeição">{periods.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><select name="mealId" defaultValue="" aria-label="Marmita"><option value="">Selecionar marmita</option>{meals.map((meal) => <option value={meal.id} key={meal.id}>{meal.name}</option>)}</select><div className="food-picker"><select name="foodId" defaultValue="" aria-label="Alimento"><option value="">Selecionar alimento</option>{foods.map((food) => <option value={food.id} key={food.id}>{food.name}</option>)}</select><label className="food-grams"><input name="foodGrams" type="number" min="0.01" max="10000" step="0.01" defaultValue="100" aria-label="Quantidade em gramas"/><span>g</span></label></div><button className="button">Adicionar</button></form></section>
    <section className="card"><h2>Água</h2><DailyCounter action={addWater} day={day} fieldName="milliliters" icon={waterIcon} iconAlt="Copo de água" step={50} suffix="ml"/><div className="entries">{waterLogs.map((log) => <div key={log.id}><span>{log.milliliters} ml</span>{remove("water", log.id)}</div>)}</div></section>
    <section className="card"><h2>Controle intestinal</h2><DailyCounter action={addBowel} day={day} fieldName="count" icon={bowelIcon} iconAlt="Controle intestinal" step={1}/><div className="entries">{bowel.map((log) => <div key={log.id}><span>{new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" }).format(log.occurredAt)}</span>{remove("bowel", log.id)}</div>)}</div></section>
    <section className="card"><h2>Atividade física</h2><img className="tracker-icon" src={exerciseIcon.src} alt="" width="50" height="50"/><form action={addExercise} className="exercise-form"><input type="hidden" name="date" value={day}/><input name="activity" placeholder="Atividade física" required/><input name="duration" type="number" min="1" placeholder="min" required/><input name="distance" type="number" min="0" step="0.01" placeholder="km"/><input name="calories" type="number" min="0" step="0.01" placeholder="kcal" required/><button className="button">Registrar</button></form><div className="entries">{exercises.map((log) => <div key={log.id}><span>{log.activity} · {log.durationMinutes} min · {format.format(Number(log.caloriesBurned))} kcal</span>{remove("exercise", log.id)}</div>)}</div></section></section>
    {foodLogs.length > 0 && <section className="card meal-summary"><h2>Resumo das refeições</h2>{periods.map(([value, label]) => { const logs = foodLogs.filter((log) => log.mealPeriod === value); return logs.length > 0 && <div className="meal-summary-period" key={value}><h3>{label}</h3>{logs.map((log) => <div className="summary-entry" key={log.id}><span>— {foodLogLabel(log)}</span>{remove("food", log.id)}</div>)}</div>; })}</section>}
  </>;
}

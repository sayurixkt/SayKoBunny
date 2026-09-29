import Link from "next/link";
import { createFood, toggleFood, updateFood } from "./actions";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-auth";

type Search = Promise<{ edit?: string }>;
const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export default async function FoodsPage({ searchParams }: { searchParams: Search }) {
  await requireAuth();
  const [{ edit }, foods] = await Promise.all([searchParams, prisma.food.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] })]);
  const editing = foods.find((food) => food.id === edit);
  const submit = editing ? updateFood : createFood;

  return <main className="shell">
    <nav className="nav"><Link href="/">Sayko Bunny ♡</Link><span>Alimentos</span></nav>
    <p className="eyebrow">✦ cadastros</p><h1>Alimentos</h1>
    <section className="card form-card"><h2>{editing ? "Editar alimento" : "Novo alimento"}</h2><p>Valores nutricionais sempre por 100 g.</p>
      <form action={submit} className="food-form">{editing && <input type="hidden" name="id" value={editing.id} />}
        <label className="field wide">Nome<input name="name" defaultValue={editing?.name} required /></label>
        <label className="field">Calorias (kcal)<input name="calories" type="number" min="0" step="0.01" defaultValue={editing?.calories.toString()} required /></label>
        <label className="field">Proteínas (g)<input name="protein" type="number" min="0" step="0.01" defaultValue={editing?.protein.toString()} required /></label>
        <label className="field">Carboidratos (g)<input name="carbs" type="number" min="0" step="0.01" defaultValue={editing?.carbs.toString()} required /></label>
        <label className="field">Gorduras (g)<input name="fat" type="number" min="0" step="0.01" defaultValue={editing?.fat.toString()} required /></label>
        <div className="form-actions"><button className="button">{editing ? "Salvar alterações" : "Cadastrar alimento"}</button>{editing && <Link className="ghost" href="/alimentos">Cancelar</Link>}</div>
      </form>
    </section>
    <section className="list-section"><div><p className="eyebrow">♡ sua despensa</p><h2>Alimentos cadastrados</h2></div>
      {foods.length === 0 ? <div className="card empty"><p>Ainda não há alimentos. Comece pelo primeiro ingrediente da sua marmita.</p></div> : <div className="food-list">{foods.map((food) => <article className={`card food ${food.active ? "" : "muted"}`} key={food.id}>
        <div className="food-head"><div><h2>{food.name}</h2><span>{food.active ? "Ativo" : "Arquivado"}</span></div><Link className="ghost" href={`/alimentos?edit=${food.id}`}>Editar</Link></div>
        <dl><div><dt>kcal</dt><dd>{number.format(Number(food.calories))}</dd></div><div><dt>proteína</dt><dd>{number.format(Number(food.protein))} g</dd></div><div><dt>carboidrato</dt><dd>{number.format(Number(food.carbs))} g</dd></div><div><dt>gordura</dt><dd>{number.format(Number(food.fat))} g</dd></div></dl>
        <form action={toggleFood}><input type="hidden" name="id" value={food.id} /><input type="hidden" name="active" value={String(!food.active)} /><button className="text-button">{food.active ? "Arquivar" : "Reativar"}</button></form>
      </article>)}</div>}
    </section>
  </main>;
}

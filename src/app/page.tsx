import Link from "next/link";
import { requireAuth } from "@/lib/require-auth";

export default async function Home() {
  await requireAuth();
  return <main className="shell"><p className="eyebrow">✦ seu diário de wellness</p><h1>Olá, coelhinha ♡</h1><section className="card"><h2>Vamos começar?</h2><p>Cadastre seus alimentos e depois transforme-os em marmitas reutilizáveis.</p><div className="inline-actions"><Link className="button" href="/alimentos">Alimentos</Link><Link className="ghost" href="/marmitas">Marmitas</Link></div></section></main>;
}

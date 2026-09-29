import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

export default async function Home() {
  const session = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!isValidSessionToken(session)) redirect("/login");
  return <main className="shell"><p className="eyebrow">✦ seu diário de wellness</p><h1>Olá, coelhinha ♡</h1><section className="card"><h2>Fundação pronta</h2><p>O painel, cadastros e diário serão construídos nas próximas etapas. Suas metas iniciais já estão definidas no esquema: 1.265 kcal, 132 g de proteínas, 120 g de carboidratos, 31 g de gorduras e 3.100 ml de água.</p></section></main>;
}

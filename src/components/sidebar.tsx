import Link from "next/link";
import { cookies } from "next/headers";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { logout } from "@/app/logout";

const items = [["/", "Início"], ["/alimentos", "Alimentos"], ["/marmitas", "Marmitas"], ["/configuracoes", "Metas & basal"], ["/alterar-senha", "Alterar senha"]] as const;

export default async function Sidebar() {
  const store = await cookies();
  if (!isValidSessionToken(store.get(SESSION_COOKIE)?.value)) return null;
  return <aside className="sidebar"><Link className="brand" href="/"><span className="brand-title">SayKo Bunny</span><span className="brand-symbol">.✦ ݁˖</span></Link><nav>{items.map(([href, label]) => href === "/alterar-senha" ? <div className="sidebar-password" key={href}><Link href={href}>{label}</Link><form action={logout}><button className="logout-button" title="Sair" aria-label="Sair do sistema">➜]</button></form></div> : <Link key={href} href={href}>{label}</Link>)}</nav></aside>;
}

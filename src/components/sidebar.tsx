import Link from "next/link";
import { cookies } from "next/headers";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

const items = [["/", "Início"], ["/alimentos", "Alimentos"], ["/marmitas", "Marmitas"], ["/configuracoes", "Metas & basal"], ["/alterar-senha", "Alterar senha"]] as const;

export default async function Sidebar() {
  const store = await cookies();
  if (!isValidSessionToken(store.get(SESSION_COOKIE)?.value)) return null;
  return <aside className="sidebar"><Link className="brand" href="/"><span className="brand-title">SayKo Bunny</span><span className="brand-symbol">.✦ ݁˖</span></Link><nav>{items.map(([href, label]) => <Link key={href} className={href === "/alterar-senha" ? "sidebar-last" : ""} href={href}>{label}</Link>)}</nav></aside>;
}

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return <main className="shell" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}><section className="card" style={{ width: "min(100%, 28rem)" }}><p className="eyebrow">୨୧ diário privado</p><h1>Sayko<br />Bunny ♡</h1><p>Um cantinho gentil para suas marmitas, hábitos e bem-estar.</p><LoginForm /></section></main>;
}

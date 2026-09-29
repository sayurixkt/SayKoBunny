import { requireAuth } from "@/lib/require-auth";
import { PasswordForm } from "./password-form";

export default async function ChangePasswordPage() {
  await requireAuth();
  return <main className="page-content shell"><p className="eyebrow">✦ acesso protegido</p><h1>Alterar senha</h1><p className="page-intro">Informe sua senha atual e escolha uma nova senha com pelo menos 10 caracteres.</p><PasswordForm/></main>;
}

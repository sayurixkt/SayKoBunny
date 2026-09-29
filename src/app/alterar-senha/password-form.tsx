"use client";

import { useActionState } from "react";
import { changePassword, type PasswordState } from "./actions";

const initial: PasswordState = {};
export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, initial);
  return <form action={action} className="card password-form"><label className="field">Senha atual<input name="currentPassword" type="password" autoComplete="current-password" required/></label><label className="field">Nova senha<input name="newPassword" type="password" autoComplete="new-password" minLength={10} required/></label><label className="field">Confirmar nova senha<input name="confirmation" type="password" autoComplete="new-password" minLength={10} required/></label>{state.error && <p className="error">{state.error}</p>}{state.success && <p className="success">{state.success}</p>}<button className="button" disabled={pending}>{pending ? "Alterando…" : "Alterar senha"}</button></form>;
}

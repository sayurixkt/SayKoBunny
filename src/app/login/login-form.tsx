"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};
export function LoginForm() {
  const [state, action, pending] = useActionState(login, initialState);
  return <form action={action}><label className="field">Senha<input name="password" type="password" autoComplete="current-password" required /></label>{state.error && <p className="error" role="alert">{state.error}</p>}<button className="button" disabled={pending}>{pending ? "Entrando…" : "Entrar"}</button></form>;
}

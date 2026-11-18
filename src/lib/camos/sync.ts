import { useSyncExternalStore } from "react";
import { deskSnapshot } from "./backup";
import { accessToken, currentOwner } from "./owner-session";
import { claimOwner, fetchRemoteDesk, saveRemoteDesk } from "./remote";
import { useDesk } from "./store";

const STAMP = "camos-supabase-at";

export type SyncState =
  | { state: "checking" }
  | { state: "saved"; at: string }
  | { state: "saving" }
  | { state: "needs-setup" }
  | { state: "choose" }
  | { state: "locked" }
  | { state: "offline"; at: string | null; error: string };

let snapshot: SyncState = { state: "checking" };
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
let applying = false;
let started = false;
let lastSent = "";

function emit(next: SyncState) {
  snapshot = next;
  for (const listener of listeners) listener();
}

function stamp(): string | null {
  try {
    return localStorage.getItem(STAMP);
  } catch {
    return null;
  }
}

function setStamp(value: string) {
  localStorage.setItem(STAMP, value);
}

export function startDeskSync(): void {
  if (started || typeof window === "undefined") {
    if (started) void reconcile();
    return;
  }
  started = true;
  const boot = () => {
    void reconcile();
  };
  if (useDesk.persist.hasHydrated()) boot();
  else useDesk.persist.onFinishHydration(boot);

  useDesk.subscribe(() => {
    if (applying) return;
    if (snapshot.state === "needs-setup" || snapshot.state === "checking" || snapshot.state === "choose" || snapshot.state === "locked") return;
    const json = JSON.stringify(deskSnapshot(useDesk.getState()));
    if (json === lastSent) return;
    emit({ state: "saving" });
    clearTimeout(timer);
    timer = setTimeout(() => {
      void pushCurrent();
    }, 700);
  });
}

async function reconcile() {
  const token = await accessToken();
  const owner = currentOwner();
  if (!token || !owner) {
    emit({ state: "locked" });
    return;
  }
  const claim = await claimOwner(token);
  if (!claim.ok) {
    emit(claim.missing ? { state: "needs-setup" } : { state: "offline", at: stamp(), error: claim.error });
    return;
  }
  const remote = await fetchRemoteDesk(token);
  if (!remote.ok) {
    emit(remote.missing ? { state: "needs-setup" } : { state: "offline", at: stamp(), error: remote.error });
    return;
  }
  if (!remote.desk || !remote.updatedAt) {
    await pushCurrent();
    return;
  }
  const local = stamp();
  if (!local) {
    emit({ state: "choose" });
    return;
  }
  if (remote.updatedAt > local) {
    applyRemote(remote.desk, remote.updatedAt);
    return;
  }
  emit({ state: "saved", at: local });
}

function applyRemote(desk: ReturnType<typeof deskSnapshot>, at: string) {
  applying = true;
  useDesk.getState().replaceDesk(desk);
  setStamp(at);
  lastSent = JSON.stringify(deskSnapshot(useDesk.getState()));
  applying = false;
  emit({ state: "saved", at });
}

async function pushCurrent() {
  const token = await accessToken();
  const owner = currentOwner();
  if (!token || !owner) {
    emit({ state: "locked" });
    return;
  }
  const result = await saveRemoteDesk(token, owner.id, useDesk.getState());
  if (!result.ok) {
    emit(result.missing ? { state: "needs-setup" } : { state: "offline", at: stamp(), error: result.error });
    return;
  }
  setStamp(result.updatedAt);
  lastSent = JSON.stringify(deskSnapshot(useDesk.getState()));
  emit({ state: "saved", at: result.updatedAt });
}

export async function uploadThisBrowser(): Promise<void> {
  emit({ state: "saving" });
  await pushCurrent();
}

export async function downloadCloud(): Promise<void> {
  emit({ state: "checking" });
  const token = await accessToken();
  if (!token) {
    emit({ state: "locked" });
    return;
  }
  const remote = await fetchRemoteDesk(token);
  if (!remote.ok || !remote.desk || !remote.updatedAt) {
    emit({ state: "offline", at: stamp(), error: remote.ok ? "Nothing is stored in Supabase yet." : remote.error });
    return;
  }
  applyRemote(remote.desk, remote.updatedAt);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useDeskSync(): SyncState {
  return useSyncExternalStore(subscribe, () => snapshot, () => snapshot);
}

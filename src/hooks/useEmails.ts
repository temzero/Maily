import { createMemo } from "solid-js";
import { emailStore } from "~/store/email.store";
import { Email, EmailFolder } from "~/types/email/email.type";

export function useEmails(folder: EmailFolder) {
  return createMemo<Email[]>(() => {
    const list = emailStore.emails.filter((e) => e.folder === folder);

    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });
}


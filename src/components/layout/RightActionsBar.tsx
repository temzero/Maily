import { A, useLocation } from "@solidjs/router";
import { countUnreadInFolder } from "~/store/email.store";
import Badge from "../ui/Badge";

const items: Array<{ label: string; href: string; folder: Parameters<typeof countUnreadInFolder>[0] }> = [
  { label: "Inbox", href: "/inbox", folder: "inbox" },
  { label: "Sent", href: "/sent", folder: "sent" },
  { label: "Drafts", href: "/drafts", folder: "drafts" },
  { label: "Starred", href: "/starred", folder: "starred" },
  { label: "Trash", href: "/trash", folder: "trash" },
];

export default function Sidebar() {
  const location = useLocation();
  const active = (href: string) => (location.pathname === href ? "bg-slate-800 text-slate-100" : "hover:bg-slate-800/50");

  return (
    <nav class="h-full bg-slate-900 text-slate-100 border-r border-slate-800">
      <div class="p-4 text-lg font-semibold tracking-wide">Solid Email</div>
      <ul class="p-2 space-y-1">
        {items.map((item) => {
          const unread = countUnreadInFolder(item.folder);
          return (
            <li>
              <A class={`w-full flex items-center justify-between px-3 py-2 rounded-md ${active(item.href)}`} href={item.href}>
                <span class="font-medium">{item.label}</span>
                {unread > 0 ? <Badge value={unread} /> : <span class="w-6" />}
              </A>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}


import { AdminApp } from "@/components/admin/admin-app";
import { resolveStorage } from "@/lib/cms-storage";
import { effectiveDoc, readDoc } from "@/lib/cms/content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { doc, rev } = await readDoc({ fresh: true });
  return <AdminApp initial={effectiveDoc(doc)} defaults={effectiveDoc({})} rev={rev} mode={resolveStorage().mode} />;
}

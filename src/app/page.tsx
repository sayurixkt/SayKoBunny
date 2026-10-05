import DiaryContent from "@/components/diary-content";
import { requireAuth } from "@/lib/require-auth";

export default async function Home({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  await requireAuth();
  return <main className="shell"><DiaryContent searchParams={searchParams} /></main>;
}

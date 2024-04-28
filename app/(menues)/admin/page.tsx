import Login from "@/components/login";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center text-center">
        <Login />
      </div>
    </main>
  );
}

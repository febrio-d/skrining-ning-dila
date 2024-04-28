import Login from "@/components/login";

export const dynamic = "force-dynamic";

export default function Auth() {
  return (
    <main className="fixed inset-0 overflow-y-auto">
      <div className="flex flex-col min-h-full items-center justify-center text-center">
        <Login />
        <div className="py-2">
          <p className="text-sm">&copy; 2024 dr. Afrizal Kurniawan</p>
        </div>
      </div>
    </main>
  );
}

import { Suspense } from "react";
import UpdateStatusContent from "./UpdateStatusContent";

export default function UpdateStatusPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </main>
      }
    >
      <UpdateStatusContent />
    </Suspense>
  );
}

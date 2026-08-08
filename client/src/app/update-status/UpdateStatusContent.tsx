import { Suspense } from "react";
import UpdateStatusContent from "./UpdateStatusContent";

export default function UpdateStatusPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white" />
          </div>
        </main>
      }
    >
      <UpdateStatusContent />
    </Suspense>
  );
}

import Link from "next/link";
import Image from "next/image";
const features = [
  {
    title: "Multi-Store Management",
    description:
      "Manage orders across multiple stores from a single, organized interface.",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Order Tracking",
    description:
      "Create orders, monitor their progress, and update order status easily.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Real-Time Updates",
    description:
      "Stay informed with real-time order notifications as your orders change.",
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80",
  },
];
export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative isolate min-h-[620px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2FyZWhvdXNlJTIwbG9naXN0aWNzfGVufDB8fDB8fHww"
          alt="Order fulfillment and warehouse operations"
          fill
          priority
          className="object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/70" />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/30" />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
              Multi-Store Order Management
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
              Manage your orders
              <span className="block text-slate-300">with OSM.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
              Create, manage, and track orders across multiple stores from one
              simple and efficient order management system.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create-order"
                className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Create New Order
              </Link>

              <Link
                href="/orders"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/20"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Why OSM
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to manage orders
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              A centralized workspace designed to make multi-store order
              management simple and efficient.
            </p>
          </div>

          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-950">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 sm:px-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-slate-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                Get started
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to manage your orders?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
                Create a new order or view existing orders across your stores.
              </p>

              <Link
                href="/create-order"
                className="mt-7 inline-flex rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Create an Order
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

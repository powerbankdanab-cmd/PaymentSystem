"use client";

const STATIONS = [
  {
    id: 58,
    name: "Cafe Castello Taleex",
    url: "https://station58.danab.site",
    area: "Taleex",
  },
  {
    id: 59,
    name: "Feynuus Bowling",
    url: "https://station59.danab.site",
    area: "Mogadishu",
  },
  {
    id: 60,
    name: "Java Taleex",
    url: "https://station60.danab.site",
    area: "Taleex",
  },
  {
    id: 61,
    name: "Delik Somalia",
    url: "https://station61.danab.site",
    area: "Mogadishu",
  },
  {
    id: 62,
    name: "Beydhan Coffe",
    url: "https://station62.danab.site",
    area: "Mogadishu",
  },
];

export function Stations() {
  const handleAdminClick = () => {
    const pin = prompt("Enter admin PIN:");
    if (pin?.toLowerCase() === "danab") {
      window.open("https://www.danabadmins.online/", "_blank");
    } else if (pin !== null) {
      alert("Incorrect PIN");
    }
  };

  return (
    <section id="stations" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-500">
            Our Locations
          </p>
          <h2 className="mt-3 text-3xl font-black text-gray-900 sm:text-4xl">
            Find a Station
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-600">
            Danab stations are placed at popular cafes and restaurants across
            Mogadishu. More locations coming soon.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATIONS.map((station) => (
            <a
              key={station.id}
              href={station.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 shadow-sm transition-all hover:border-pink-200 hover:bg-pink-50 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-sm font-black text-white shadow-md">
                {station.id}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900 group-hover:text-pink-600">
                  {station.name}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{station.area}</p>
              </div>
              <svg
                className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-pink-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </a>
          ))}
        </div>

        <div className="relative mt-10 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50 p-6 text-center sm:p-8">
          <button
            onClick={handleAdminClick}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-white/60 hover:text-gray-500"
            aria-label="Admin"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
          <h3 className="text-lg font-bold text-gray-900">Admin System</h3>
          <p className="mt-2 text-sm text-gray-600">
            Manage stations, view rentals, and monitor your Danab network.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6 text-center sm:p-8">
          <h3 className="text-lg font-bold text-purple-900">
            Want Danab at Your Location?
          </h3>
          <p className="mt-2 text-sm text-purple-700">
            We&apos;re expanding! If you own a cafe, restaurant, or business and
            want a Danab station, contact us.
          </p>
          <a
            href="#contact"
            className="mt-4 inline-block rounded-xl bg-purple-700 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-purple-800 hover:shadow-lg"
          >
            Partner With Us
          </a>
        </div>
      </div>
    </section>
  );
}

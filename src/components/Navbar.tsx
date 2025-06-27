"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [searchCity, setSearchCity] = useState("");
  const router = useRouter();

  const handleSearchCityInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCity(event.target.value);
  };

  const handleSearchCity = () => {
    router.push(`/search?city=${encodeURIComponent(searchCity.trim())}`);
    setSearchCity("");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-center sm:justify-between py-4 px-2 border-b border-b-gray-200">
      <span className="hidden sm:block sm:text-2xl font-bold">Staybnb</span>
      <div>
        <input
          type="text"
          placeholder="Where do you want to go?"
          className="rounded-full p-2 hover:bg-amber-300 transition-colors duration-300"
          value={searchCity}
          name="searchCity"
          onChange={handleSearchCityInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearchCity();
          }}
        />
        <button className="rounded-full p-2 hover:bg-amber-300 transition-colors duration-300" disabled={searchCity === ""} onClick={handleSearchCity}>
          Search
        </button>
      </div>
      <button className="text-sm sm:text-xl hover:bg-amber-300 transition-colors duration-300 px-4 py-2 rounded-full" onClick={handleLogin}>
        Login
      </button>
    </nav>
  );
}

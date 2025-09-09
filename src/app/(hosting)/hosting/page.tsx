import ActionCards from "./components/ActionCards";
import Dashboard from "./components/Dashboard";
import Stats from "./components/Stats";

export default function Hosting() {
  return (
    <div className="px-12 py-10 w-full">
      <Dashboard />

      <ActionCards />

      <Stats />
    </div>
  );
}

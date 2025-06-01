import DashboardChart from "./dashboard/DashboardChart";
import TotalDashboard from "./dashboard/TotalDashboard";
export const metadata = {
  title: "Trang Chủ",
  description: "...",
};
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Thống Kê</h1>
      <TotalDashboard />
      <DashboardChart />
    </div>
  );
}

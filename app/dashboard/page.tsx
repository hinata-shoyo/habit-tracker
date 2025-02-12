import DashboardPage from "@/components/DashboardPage";
import { getSession } from "@/lib/auth";

export default async function Dashboard() {
  const session = await getSession();
  if (!session?.user) {
    return <h1>Please log in... </h1>;
  }
  return (
    <div>
      <DashboardPage />
    </div>
  );
}

import { AnalyticsCards } from '@/components/dashboard/analytics-cards';
import { RecentActivity } from '@/components/dashboard/recent-activity';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Overview of your resumes and recent activity.</p>
      </div>
      
      <AnalyticsCards />
      
      <div className="mt-8">
        <RecentActivity />
      </div>
    </div>
  );
}

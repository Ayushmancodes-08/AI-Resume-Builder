import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function ResumeListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Resumes</h1>
          <p className="mt-2 text-sm text-gray-600">Manage and edit your created resumes.</p>
        </div>
      </div>

      {/* For demonstration, we show the empty state. This will be dynamic based on the store later. */}
      <div className="mt-8">
        <EmptyState 
          icon={FileText}
          title="No Resumes Yet"
          description="You haven't created any resumes. Get started by creating your first professional resume."
          actionLabel="Create First Resume"
          actionHref="/resumes/new"
        />
      </div>
    </div>
  );
}

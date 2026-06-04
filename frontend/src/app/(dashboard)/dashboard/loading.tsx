import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl border border-gray-100">
             <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-full" />
             </div>
             <Skeleton className="h-8 w-16 mt-4" />
             <Skeleton className="h-4 w-32 mt-2" />
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
         <Skeleton className="h-6 w-40 mb-6" />
         <div className="space-y-6">
            {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-64" />
                     <Skeleton className="h-3 w-32" />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}

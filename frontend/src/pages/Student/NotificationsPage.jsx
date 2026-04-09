import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStats } from "../../store/slices/studentSlice";
import { Bell, Info, Clock } from "lucide-react";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white animate-pulse rounded-2xl" />)}
          </div>
        ) : stats?.notifications?.length > 0 ? (
          <div className="space-y-4">
            {stats.notifications.map((note) => (
              <div key={note._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Info size={20} /></div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-sm">System Update</h3>
                  <p className="text-sm text-gray-600 my-1">{note.message}</p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                    <Clock size={10} /> {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Bell size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
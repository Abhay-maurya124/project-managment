import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead, deleteNotificationAction } from "../../store/slices/notificationSlice";
import { Bell, Info, Clock, CheckCircle, Trash2, ShieldAlert } from "lucide-react";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { list, loading, unreadCount, highPriorityCount } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this notification?")) {
      dispatch(deleteNotificationAction(id));
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="text-blue-600" size={28} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          </div>
          {highPriorityCount > 0 && (
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldAlert size={14} /> {highPriorityCount} Urgent
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-white animate-pulse rounded-2xl border border-gray-100" />
            ))}
          </div>
        ) : list.length > 0 ? (
          <div className="space-y-4">
            {list.map((note) => (
              <div 
                key={note._id} 
                className={`group bg-white p-5 rounded-2xl border transition-all ${
                  note.isRead ? "border-gray-100 opacity-75" : "border-blue-100 shadow-sm ring-1 ring-blue-50"
                } flex gap-4 items-start`}
              >
                <div className={`p-3 rounded-xl ${note.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Info size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-sm capitalize">{note.type} Update</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!note.isRead && (
                        <button onClick={() => handleMarkRead(note._id)} className="text-green-600 hover:bg-green-50 p-1 rounded-lg">
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(note._id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 my-1">{note.message}</p>
                  
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mt-2">
                    <Clock size={10} /> {new Date(note.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <Bell size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">All caught up! No notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
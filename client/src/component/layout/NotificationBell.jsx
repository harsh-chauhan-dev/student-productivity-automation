import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead, deleteNotification } from "../../services/notification.service";
import Card from "../ui/Card";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const res = await getNotifications();
        setNotifications(res.data?.notifications || []);
        setLoading(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      loadNotifications();
      const interval = setInterval(loadNotifications, 60000); // Refresh every 60 seconds
      return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleMarkRead = async (id) => {
    try {
        await markNotificationAsRead(id);
        setNotifications(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item));
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
        await deleteNotification(id);
        setNotifications(prev => prev.filter(item => item.id !== id));
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((item) => !item.is_read).length;

  return (
    <div className="absolute right-3 top-3 z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        🔔
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-3 mt-2 w-80 max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Notifications</h3>
            <button onClick={() => setOpen(false)} className="text-sm text-slate-500">Close</button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : notifications.length === 0 ? (
            <p className="text-sm text-slate-500">No notifications yet.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((item) => (
                <Card key={item.id} className={`p-3 ${item.is_read ? "bg-slate-50" : "bg-blue-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.title || "Notification"}</p>
                      <p className="text-sm text-slate-600">{item.message || "No details provided"}</p>
                      <p className="mt-1 text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      {!item.is_read ? (
                        <button onClick={() => handleMarkRead(item.id)} className="text-xs text-blue-600">Read</button>
                      ) : null}
                      <button onClick={() => handleDelete(item.id)} className="text-xs text-red-500">Delete</button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

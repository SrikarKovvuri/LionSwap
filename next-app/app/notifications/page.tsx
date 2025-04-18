// app/notifications/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notifications, products } from "@/lib/sample-data"
import { Notification } from "@/lib/types"

import { formatDistanceToNow } from "date-fns";


export default function NotificationsPage() {
  // Group notifications by date
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayNotifications = notifications.filter(
    notif => new Date(notif.timestamp) >= new Date(today)
  );
  
  const yesterdayNotifications = notifications.filter(
    notif => new Date(notif.timestamp) >= new Date(yesterday) && new Date(notif.timestamp) < new Date(today)
  );
  
  const earlierNotifications = notifications.filter(
    notif => new Date(notif.timestamp) < new Date(yesterday)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="ghost" size="sm">
          Mark all as read
        </Button>
      </div>

      {/* Today's notifications */}
      {todayNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-500 mb-4">Today</h2>
          <div className="space-y-4">
            {todayNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}

      {/* Yesterday's notifications */}
      {yesterdayNotifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-500 mb-4">Yesterday</h2>
          <div className="space-y-4">
            {yesterdayNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}

      {/* Earlier notifications */}
      {earlierNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-500 mb-4">Earlier</h2>
          <div className="space-y-4">
            {earlierNotifications.map(notification => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="mb-4 text-gray-400">
            <Bell className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-medium mb-2">No notifications yet</h2>
          <p className="text-gray-500">
            When you have notifications, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
}

// NotificationCard component
function NotificationCard({ notification }: { notification: Notification }) {
  // Determine icon based on notification type
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "message":
        return "/placeholder.svg?height=24&width=24&text=💬";
      case "offer":
        return "/placeholder.svg?height=24&width=24&text=💰";
      case "purchase":
        return "/placeholder.svg?height=24&width=24&text=🛒";
      case "price_drop":
        return "/placeholder.svg?height=24&width=24&text=📉";
      case "system":
        return "/placeholder.svg?height=24&width=24&text=🔔";
      default:
        return "/placeholder.svg?height=24&width=24&text=🔔";
    }
  };

  // Get the sender avatar URL - assuming you have a function or mapping to get avatars by user ID
  const getSenderAvatar = (senderId: number) => {
    // You might want to implement a proper lookup function here
    // For now, we'll just return a placeholder with the user ID
    return `/placeholder.svg?height=40&width=40&text=User${senderId}`;
  };

  return (
    <Link href={notification.actionUrl || "#"}>
      <div className={`p-4 rounded-lg border ${notification.read ? 'bg-white' : 'bg-blue-50'} hover:bg-gray-50 transition-colors`}>
        <div className="flex items-start gap-4">
          {/* Avatar or notification icon */}
          <div className="flex-shrink-0">
            {notification.senderId ? (
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <Image
                  src={getSenderAvatar(notification.senderId)} // Now using a function to get avatar by ID
                  alt={`User ${notification.senderId}`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Image
                  src={getNotificationIcon()}
                  alt="Notification"
                  width={24}
                  height={24}
                />
              </div>
            )}
          </div>
          
          {/* Notification content */}
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-black'}`}>
                {notification.title}
              </h3>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
            
            {/* Item preview (if applicable) */}
            {notification.itemImage && (
              <div className="mt-3 flex items-center gap-3 bg-gray-50 p-2 rounded">
                <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={notification.itemImage}
                    alt={notification.title || "Item"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-gray-700">
                  {notification.title}
                </span>
              </div>
            )}
            
            {/* Action buttons for specific notification types */}
            {notification.type === "offer" && (
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-3 py-1 h-auto text-sm">
                  Accept
                </Button>
                <Button size="sm" variant="outline" className="px-3 py-1 h-auto text-sm">
                  Decline
                </Button>
              </div>
            )}
          </div>
          
          {/* Unread indicator */}
          {!notification.read && (
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Import the Bell icon for the empty state
function Bell(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
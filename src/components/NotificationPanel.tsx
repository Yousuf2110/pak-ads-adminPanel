import React, { useState } from 'react';
import { Bell, User, Clock, ChevronDown, ChevronUp, Phone, Mail, MapPin } from 'lucide-react';

interface NotificationData {
  id: number | string;
  message: string;
  memberName?: string;
  email?: string;
  phone?: string;
  loginTime?: string;
  location?: string;
  time?: string;
  isNew?: boolean;
  type?: 'login' | 'signup' | 'withdrawal' | 'deposit' | string;
}

interface NotificationPanelProps {
  notifications?: NotificationData[];
  maxVisible?: number;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
  notifications = [], 
  maxVisible = 3 
}) => {
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string | number>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const notificationData = notifications;
  const visibleNotifications = showAll ? notificationData : notificationData.slice(0, maxVisible);

  const toggleExpanded = (id: string | number) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNotifications(newExpanded);
  };

  const getNotificationIcon = (type?: string) => {
    switch (type || '') {
      case 'login': return '🔐';
      case 'signup': return '👤';
      case 'withdrawal': return '💸';
      case 'deposit': return '💰';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type?: string, isNew?: boolean) => {
    if (isNew) {
      return 'border-l-green-500 bg-green-50';
    }
    
    switch (type || '') {
      case 'login': return 'border-l-blue-500 bg-blue-50';
      case 'signup': return 'border-l-purple-500 bg-purple-50';
      case 'withdrawal': return 'border-l-orange-500 bg-orange-50';
      case 'deposit': return 'border-l-emerald-500 bg-emerald-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getIconColor = (type?: string, isNew?: boolean) => {
    if (isNew) {
      return 'bg-green-100 text-green-600';
    }
    
    switch (type || '') {
      case 'login': return 'bg-blue-100 text-blue-600';
      case 'signup': return 'bg-purple-100 text-purple-600';
      case 'withdrawal': return 'bg-orange-100 text-orange-600';
      case 'deposit': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTextColor = (type?: string, isNew?: boolean) => {
    if (isNew) {
      return 'text-green-800';
    }
    
    switch (type || '') {
      case 'login': return 'text-blue-800';
      case 'signup': return 'text-purple-800';
      case 'withdrawal': return 'text-orange-800';
      case 'deposit': return 'text-emerald-800';
      default: return 'text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Bell className="mr-2 text-blue-600" size={20} />
          Live Notifications
        </h3>
        {notificationData.length > maxVisible && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {showAll ? 'Show Less' : `Show All (${notificationData.length})`}
          </button>
        )}
      </div>

      {notificationData.length === 0 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-500">
          No notifications to display.
        </div>
      )}

      {visibleNotifications.map((notification) => {
        const isExpanded = expandedNotifications.has(notification.id);
        
        return (
          <div 
            key={notification.id} 
            className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition-all duration-200 hover:shadow-md ${getNotificationColor(notification.type, notification.isNew)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${getIconColor(notification.type, notification.isNew)}`}>
                <Bell size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${getTextColor(notification.type, notification.isNew)}`}>
                    {getNotificationIcon(notification.type)} {notification.message}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{notification.time}</span>
                    {notification.isNew && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        New
                      </span>
                    )}
                    <button
                      onClick={() => toggleExpanded(notification.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>
                
                {/* Basic Details */}
                {(notification.memberName || notification.loginTime) && (
                  <div className="text-xs text-gray-600 mt-1 flex items-center">
                    <User size={12} className="mr-1" />
                    <span className="font-medium">{notification.memberName || '—'}</span>
                    {notification.loginTime && <span className="mx-2">•</span>}
                    {notification.loginTime && <span>{notification.loginTime}</span>}
                  </div>
                )}

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {notification.email && (
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{notification.email}</span>
                        </div>
                      )}
                      {notification.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{notification.phone}</span>
                        </div>
                      )}
                      {notification.location && (
                        <div className="flex items-center space-x-2 md:col-span-2">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{notification.location}</span>
                        </div>
                      )}
                    </div>
                    {(notification.loginTime || notification.time) && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          {notification.loginTime && <>Login time: {notification.loginTime}</>}
                          {notification.loginTime && notification.time && ' • '}
                          {notification.time}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationPanel;
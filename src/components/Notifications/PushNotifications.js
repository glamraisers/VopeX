import React, { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';

const PushNotifications = () => {
  const [pushNotifications, setPushNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPushNotifications = async () => {
      try {
        const data = await notificationService.getPushNotifications();
        setPushNotifications(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPushNotifications();
  }, []);

  return (
    <div className="push-notifications">
      <h2>Push Notifications</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {pushNotifications.map((notification) => (
          <li key={notification.id}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <p>Timestamp: {notification.timestamp}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PushNotifications;

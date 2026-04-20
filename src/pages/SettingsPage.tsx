import React from 'react';
import StoreInfoForm from '../components/settings/StoreInfoForm';
import NotificationsForm from '../components/settings/NotificationsForm';

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <StoreInfoForm />
      <NotificationsForm />
    </div>
  );
}

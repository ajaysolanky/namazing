"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { updateProfile, deleteAccount } from "@/app/(dashboard)/settings/actions";

interface AccountSettingsProps {
  displayName: string;
  email: string;
}

export function AccountSettings({ displayName, email }: AccountSettingsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-6">
      {/* Profile update */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-studio-ink/5">
        <h3 className="font-medium text-studio-ink mb-4">Profile</h3>
        <form action={updateProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-studio-ink/60 mb-1.5">Email</label>
            <p className="text-sm text-studio-ink">{email}</p>
          </div>
          <div>
            <label htmlFor="displayName" className="block text-sm text-studio-ink/60 mb-1.5">
              Display name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              defaultValue={displayName}
              className="w-full h-10 px-3 rounded-xl border border-studio-ink/10 bg-white text-studio-ink text-sm focus:outline-none focus:ring-2 focus:ring-studio-terracotta/30"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Save changes
          </Button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-red-200/50">
        <h3 className="font-medium text-red-600 mb-2">Danger zone</h3>
        <p className="text-sm text-studio-ink/50 mb-4">
          Deleting your account removes all your data permanently. This cannot be undone.
        </p>
        {confirmDelete ? (
          <div className="flex gap-3">
            <form action={deleteAccount}>
              <Button type="submit" variant="primary" size="sm" className="bg-red-600 hover:bg-red-700">
                Yes, delete my account
              </Button>
            </form>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setConfirmDelete(true)}>
            Delete account
          </Button>
        )}
      </div>
    </div>
  );
}

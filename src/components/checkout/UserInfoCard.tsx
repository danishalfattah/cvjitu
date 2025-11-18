// components/checkout/UserInfoCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Mail } from "lucide-react";

interface UserInfoCardProps {
  userName: string;
  userEmail: string;
}

export function UserInfoCard({ userName, userEmail }: UserInfoCardProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-[var(--red-light)] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--red-normal)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Nama Lengkap</p>
              <p className="font-semibold text-[var(--neutral-ink)]">
                {userName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-[var(--red-light)] rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-[var(--red-normal)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-[var(--neutral-ink)]">
                {userEmail}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

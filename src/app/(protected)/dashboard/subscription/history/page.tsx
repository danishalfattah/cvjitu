"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Loader2, ReceiptText, Clock, Component } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  plan: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentId?: string;
  paymentUrl?: string;
}

export default function SubscriptionHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // Tunggu session disetup di backend
      if (!user?.id) return;
      
      try {
        const response = await fetch("/api/subscription/history");
        const data = await response.json();

        if (response.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          throw new Error(data.error || "Gagal mengambil riwayat transaksi");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--red-normal)]" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>Pages</span>
          <span>/</span>
          <span>Subscription</span>
          <span>/</span>
          <span className="text-[var(--neutral-ink)]">History</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-poppins font-bold text-[var(--neutral-ink)]">
            Riwayat Pembelian
        </h1>
        <p className="text-gray-600 mt-1">
          Lihat riwayat transaksi langganan Anda
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[var(--border-color)] overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ReceiptText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-700">Belum ada transaksi</p>
            <p className="text-sm">Anda belum melakukan pembelian paket apapun.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[var(--border-color)]">
                  <th className="p-4 font-semibold text-sm text-gray-600">ID Pesanan</th>
                  <th className="p-4 font-semibold text-sm text-gray-600">Tanggal</th>
                  <th className="p-4 font-semibold text-sm text-gray-600">Paket</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 whitespace-nowrap">Total Pembayaran</th>
                  <th className="p-4 font-semibold text-sm text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-sm text-gray-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900 capitalize whitespace-nowrap">
                      {order.plan === 'freshgraduate' ? 'Fresh Graduate' : order.plan === 'jobseeker' ? 'Job Seeker' : order.plan}
                    </td>
                    <td className="p-4 text-sm font-medium text-[var(--red-normal)] whitespace-nowrap">
                      Rp {order.amount?.toLocaleString("id-ID") || 0}
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap">
                      <Badge 
                        variant={order.status === "completed" || order.status === "SUCCESS" || order.status === "PAID" ? "default" : "secondary"}
                        className={
                          order.status === "completed" || order.status === "SUCCESS" || order.status === "PAID" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100 border border-green-200" 
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                        }
                      >
                        {order.status === "completed" || order.status === "SUCCESS" || order.status === "PAID"  ? "Berhasil" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {order.status === "pending" && order.paymentUrl && (
                        <a 
                          href={order.paymentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[var(--red-normal)] hover:underline"
                        >
                          Lanjutkan Bayar
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

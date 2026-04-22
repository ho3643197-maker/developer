import React, { useEffect, useState } from 'react';
import { FileText, User, Home, Calendar, CreditCard, Building2, Download, Printer } from 'lucide-react';
import { Sale, Installment } from '../../types';
import { supabase } from '../../lib/supabase';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { getMockData } from '../../lib/storage';

interface SaleDetailKIPProps {
  sale: Sale;
  onClose: () => void;
}

export const SaleDetailKIP: React.FC<SaleDetailKIPProps> = ({ sale, onClose }) => {
  const { isMockMode } = useAuth();
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        setLoading(true);
        if (isMockMode) {
          const mockInstallments = getMockData<Installment>('installments', [])
            .filter(i => i.sale_id === sale.id);
          setInstallments(mockInstallments);
          return;
        }

        const { data, error } = await supabase
          .from('installments')
          .select('*')
          .eq('sale_id', sale.id)
          .order('due_date', { ascending: true });

        if (error) throw error;
        setInstallments(data || []);
      } catch (error) {
        console.error('Error fetching installments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallments();
  }, [sale.id, isMockMode]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto px-1 print:max-h-none print:overflow-visible print:p-0">
      <div className="flex items-center justify-between gap-4 sticky top-0 bg-white py-2 z-10 print:hidden">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          Kartu Induk Penjualan (KIP)
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
          <Button size="sm" onClick={onClose}>Tutup</Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-indigo-50/50 border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Data Konsumen</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900">{sale.customer?.full_name}</p>
            <p className="text-xs text-slate-500">{sale.customer?.email}</p>
            <p className="text-xs text-slate-500">{sale.customer?.phone}</p>
            <p className="text-xs text-slate-500">{sale.customer?.address}</p>
          </div>
        </Card>

        <Card className="p-6 bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Unit Properti</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900">{sale.unit?.unit_number}</p>
            <p className="text-xs text-slate-600 font-medium">{sale.unit?.project?.name}</p>
            <p className="text-xs text-slate-500">Tipe: {sale.unit?.type}</p>
            <div className="mt-2">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase',
                sale.status === 'active' ? 'bg-indigo-100 text-indigo-700' :
                sale.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              )}>
                Status: {sale.status}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-amber-50/50 border-amber-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900">Administrasi</h3>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tanggal Transaksi:</span>
              <span className="font-medium">{formatDate(sale.sale_date)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Marketing:</span>
              <span className="font-medium">{sale.marketing?.full_name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Metode:</span>
              <span className="font-bold uppercase text-amber-700">{sale.payment_method}</span>
            </div>
            <div className="flex justify-between text-xs pt-2">
              <span className="text-slate-500">Promo:</span>
              <span className="font-medium text-emerald-600">{sale.promo?.name || '-'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Breakdown */}
      <Card className="p-0 overflow-hidden border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rincian Keuangan</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Harga Jual Unit</span>
              <span className="text-sm font-semibold">{formatCurrency((sale.total_price || 0) + (sale.discount || 0))}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-red-600">
              <span className="text-sm">Potongan Harga (Discount)</span>
              <span className="text-sm font-semibold">-{formatCurrency(sale.discount || 0)}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-sm text-slate-600 font-bold">Harga Setelah Discount</span>
              <span className="text-sm font-bold">{formatCurrency(sale.total_price || 0)}</span>
            </div>
            {sale.promo && (
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 text-emerald-600">
                <span className="text-sm">Promo: {sale.promo.name}</span>
                <span className="text-sm font-semibold">-{formatCurrency(sale.promo.value || 0)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-base font-bold text-slate-900">TOTAL AKHIR (Nett)</span>
              <span className="text-xl font-black text-indigo-600">{formatCurrency(sale.final_price || 0)}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Summary Pembayaran</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Booking Fee</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(sale.booking_fee || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Terbayar (Booking)</span>
                <span className="text-sm font-bold text-emerald-600">{formatCurrency(sale.booking_fee || 0)}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900 uppercase">Sisa Piutang</span>
                <span className="text-lg font-black text-rose-600">{formatCurrency((sale.final_price || 0) - (sale.booking_fee || 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Schedule (Installments) */}
      {(sale.payment_method === 'installment' || sale.payment_method === 'kpr') && (
        <Card className="p-0 overflow-hidden border-slate-200">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Jadwal Angsuran / Progress Pembayaran</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{installments.length} Tahapan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-3 font-black">No</th>
                  <th className="px-6 py-3 font-black">Jatuh Tempo</th>
                  <th className="px-6 py-3 font-black">Keterangan</th>
                  <th className="px-6 py-3 font-black text-right">Jumlah Tagihan</th>
                  <th className="px-6 py-3 font-black text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-slate-400 animate-pulse">Memuat data angsuran...</td>
                  </tr>
                ) : installments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 italic">Belum ada jadwal angsuran yang tercatat.</td>
                  </tr>
                ) : (
                  installments.map((inst, index) => (
                    <tr key={inst.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 text-sm text-slate-400 font-bold">#{index + 1}</td>
                      <td className="px-6 py-3 text-sm text-slate-900 font-medium">{formatDate(inst.due_date)}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">Angsuran ke-{index + 1}</td>
                      <td className="px-6 py-3 text-sm font-bold text-slate-900 text-right">{formatCurrency(inst.amount)}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={cn(
                          'px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter',
                          inst.status === 'paid' ? 'bg-emerald-50 text-emerald-600' :
                          inst.status === 'overdue' ? 'bg-rose-50 text-rose-600' :
                          'bg-slate-100 text-slate-500'
                        )}>
                          {inst.status === 'paid' ? 'Lunas' : 
                           inst.status === 'overdue' ? 'Terlambat' : 'Belum Bayar'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Footer / Notes */}
      <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Catatan & Ketentuan</h4>
          <ul className="text-[10px] text-slate-500 space-y-1 list-disc pl-4">
            <li>KIP ini merupakan data resmi transaksi yang tercatat dalam sistem ERP PropDev.</li>
            <li>Segala bentuk perubahan data harus melalui persetujuan Manajer Pemasaran.</li>
            <li>Pembayaran dianggap sah apabila telah diverifikasi oleh bagian Keuangan.</li>
          </ul>
        </div>
        <div className="flex flex-col items-end justify-end space-y-1">
          <p className="text-[10px] text-slate-400 italic">Dicetak secara sistem pada: {new Date().toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Building2 className="text-white w-3 h-3" />
            </div>
            <span className="text-xs font-bold text-slate-900">PropDev ERP Pro 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for cn
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

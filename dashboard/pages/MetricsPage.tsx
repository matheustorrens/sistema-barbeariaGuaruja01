import React, { useState, useCallback, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Tooltip } from '../components/Tooltip';
import { HelpCircle, RotateCcw, Calendar } from 'lucide-react';
import { resetMetrics, fetchDailyMetrics, fetchAllDailyMetrics } from '../../firebase/db';
import { Modal } from '../components/Modal';
import { useAlert } from '../components/Alert';

type Preset = 'all' | 'today' | '7d' | '30d' | 'custom';

const dateStr = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

export const MetricsPage: React.FC = () => {
  const { services } = useData();
  const { showAlert, AlertBanner } = useAlert();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // ── Date range ──────────────────────────────────────────────────────────────
  const todayStr = dateStr(new Date());
  const [preset, setPreset]             = useState<Preset>('all');
  const [fromDate, setFromDate]         = useState(dateStr(addDays(new Date(), -6)));
  const [toDate, setToDate]             = useState(todayStr);
  const [rangeMetrics, setRangeMetrics] = useState<Record<string, number>>({});
  const [loadingRange, setLoadingRange] = useState(false);

  const fetchRange = useCallback(async (from: string, to: string) => {
    setLoadingRange(true);
    try {
      const data = await fetchDailyMetrics(from, to);
      setRangeMetrics(data);
    } catch {
      // ignore aborted requests silently
    } finally {
      setLoadingRange(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoadingRange(true);
    try {
      const data = await fetchAllDailyMetrics();
      setRangeMetrics(data);
    } catch {
      // ignore aborted requests silently
    } finally {
      setLoadingRange(false);
    }
  }, []);

  // Load "Total" once on mount
  useEffect(() => { fetchAll(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyPreset = (p: Preset) => {
    setPreset(p);
    const now = new Date();
    if (p === 'today') {
      const s = dateStr(now);
      setFromDate(s); setToDate(s);
      fetchRange(s, s);
    } else if (p === '7d') {
      const from = dateStr(addDays(now, -6));
      const to   = dateStr(now);
      setFromDate(from); setToDate(to);
      fetchRange(from, to);
    } else if (p === '30d') {
      const from = dateStr(addDays(now, -29));
      const to   = dateStr(now);
      setFromDate(from); setToDate(to);
      fetchRange(from, to);
    } else if (p === 'all') {
      fetchAll();
    }
    // 'custom': just show the pickers
  };

  const m = rangeMetrics;
  const periodLabel =
    preset === 'all'    ? 'total acumulado' :
    preset === 'today'  ? 'hoje' :
    preset === '7d'     ? 'últimos 7 dias' :
    preset === '30d'    ? 'últimos 30 dias' :
    `${fromDate} → ${toDate}`;

  // ── Derived metrics ─────────────────────────────────────────────────────────
  const whatsClicks   = m['whatsappClicks'] ?? 0;
  const totalBookings = services.reduce((acc, s) => acc + (m[`service_${s.id}`] ?? 0), 0);
  const topService    = [...services]
    .map(s => ({ name: s.name, clicks: m[`service_${s.id}`] ?? 0 }))
    .sort((a, b) => b.clicks - a.clicks)[0];

  const maxClicks = Math.max(
    ...services.map(s => m[`service_${s.id}`] ?? 0),
    1,
  );

  const kpis = [
    {
      label: 'Cliques no WhatsApp',
      value: whatsClicks.toString(),
      sub: periodLabel,
      tip: 'Contabilizado quando o visitante clica em qualquer botão do WhatsApp no site',
      big: true,
    },
    {
      label: 'Agendamentos Confirmados',
      value: totalBookings.toString(),
      sub: periodLabel,
      tip: 'Contabilizado quando o cliente preenche o formulário e clica em "Confirmar no WhatsApp"',
      big: true,
    },
    {
      label: 'Serviço Mais Pedido',
      value: topService?.name ?? '—',
      sub: `${topService?.clicks ?? 0} confirmações`,
      tip: 'Serviço com mais confirmações de agendamento no período selecionado',
      big: false,
    },
  ];

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetMetrics();
      setRangeMetrics({});
      showAlert('success', 'Métricas zeradas com sucesso!');
      setResetOpen(false);
    } catch {
      showAlert('error', 'Erro ao zerar métricas.');
    } finally {
      setResetting(false);
    }
  };

  const presetBtns: { key: Preset; label: string }[] = [
    { key: 'today', label: 'Hoje' },
    { key: '7d',    label: '7 dias' },
    { key: '30d',   label: '30 dias' },
    { key: 'custom',label: 'Personalizado' },
    { key: 'all',   label: 'Total' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Métricas</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Interações dos visitantes do site · dados em tempo real
          </p>
        </div>
        <button
          onClick={() => setResetOpen(true)}
          className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-3 py-2 rounded-xl text-xs font-semibold hover:border-red-300 hover:text-red-500 transition-colors"
        >
          <RotateCcw size={13} /> Zerar métricas
        </button>
      </div>

      {AlertBanner && <div>{AlertBanner}</div>}

      {/* ── Date range filter ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar size={14} className="text-gray-400 shrink-0" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1">Período</span>
          <div className="flex gap-1.5 flex-wrap">
            {presetBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  preset === key
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {preset === 'custom' && (
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">De</label>
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={e => setFromDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-900 bg-white focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500">até</label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max={todayStr}
                onChange={e => setToDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-xs text-gray-900 bg-white focus:outline-none focus:border-black"
              />
            </div>
            <button
              onClick={() => fetchRange(fromDate, toDate)}
              disabled={loadingRange}
              className="px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {loadingRange ? 'Buscando…' : 'Aplicar'}
            </button>
          </div>
        )}

        {preset !== 'all' && !loadingRange && (
          <p className="text-xs text-gray-400 mt-2">
            Exibindo: <span className="font-medium text-gray-700">{periodLabel}</span>
          </p>
        )}
        {loadingRange && (
          <p className="text-xs text-gray-400 mt-2 animate-pulse">Carregando dados do período…</p>
        )}
      </div>

      {/* ── KPI cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map(({ label, value, sub, tip, big }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-1.5 mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {label}
              </p>
              <Tooltip title={tip}>
                <HelpCircle size={12} className="text-gray-300" />
              </Tooltip>
            </div>
            <p
              className="font-bold text-black leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: big ? '3.25rem' : '1.6rem',
                lineHeight: 1.1,
              }}
            >
              {value}
            </p>
            <p className="text-gray-400 text-xs mt-2">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Breakdown por serviço ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-black mb-5">Confirmações por Serviço</h2>
        <div className="space-y-4">
          {[...services]
            .map(s => ({ ...s, clicks: m[`service_${s.id}`] ?? 0 }))
            .sort((a, b) => b.clicks - a.clicks)
            .map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 truncate w-36 sm:w-48 shrink-0">
                  {s.name}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-black h-1.5 rounded-full transition-all duration-700"
                    style={{ width: `${(s.clicks / maxClicks) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-black w-6 text-right shrink-0">
                  {s.clicks}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* ── Reset confirm modal ───────────────────────────────────────────── */}
      <Modal
        isOpen={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Zerar Métricas?"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setResetOpen(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40"
            >
              {resetting ? 'Zerando…' : 'Sim, zerar tudo'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Todos os contadores (WhatsApp, agendamentos e cliques por serviço) serão zerados.
          Esta ação <strong>não pode ser desfeita</strong>.
        </p>
      </Modal>
    </div>
  );
};

import React, { useState, useRef, useCallback } from 'react';
import { AlertTriangle, CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { saveBusinessInfo, saveVacationMode } from '../../firebase/db';
import { ExtendedBusinessInfo, VacationMode } from '../../types';
import { Modal } from '../components/Modal';
import { useAlert } from '../components/Alert';

const inputCls  = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-black transition-colors bg-white';
const labelCls  = 'block text-sm font-medium text-gray-700 mb-1';
const sectionCls = 'bg-white border border-gray-200 rounded-2xl p-5';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative shrink-0 ${checked ? 'bg-black' : 'bg-gray-300'}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`}
    />
  </div>
);

type SaveState = 'idle' | 'saving' | 'saved';

export const BusinessPage: React.FC = () => {
  const { businessInfo, vacationMode } = useData();
  const { showAlert, AlertBanner }     = useAlert();

  const [info, setInfo]             = useState<ExtendedBusinessInfo>(businessInfo);
  const [vac, setVac]               = useState<VacationMode>(vacationMode);
  const [vacConfirm, setVacConfirm] = useState(false);
  const [savingVac, setSavingVac]   = useState(false);
  const [saveState, setSaveState]   = useState<SaveState>('idle');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync Firestore → local (only when no pending user edits)
  React.useEffect(() => {
    if (!debounceRef.current) setInfo(businessInfo);
  }, [businessInfo]);
  React.useEffect(() => { setVac(vacationMode); }, [vacationMode]);

  const scheduleInfoSave = useCallback((next: ExtendedBusinessInfo) => {
    setSaveState('saving');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      debounceRef.current = null;
      try {
        await saveBusinessInfo(next);
        setSaveState('saved');
        setTimeout(() => setSaveState('idle'), 2500);
      } catch {
        showAlert('error', 'Erro ao salvar. Tente novamente.');
        setSaveState('idle');
      }
    }, 700);
  }, [showAlert]);

  const updateInfo = (patch: Partial<ExtendedBusinessInfo>) => {
    const next = { ...info, ...patch };
    setInfo(next);
    scheduleInfoSave(next);
  };

  const handleToggleVacation = () => {
    if (!vac.active) {
      setVacConfirm(true);
    } else {
      setVac(v => ({ ...v, active: false }));
    }
  };

  const saveVac = async () => {
    setSavingVac(true);
    try {
      await saveVacationMode(vac);
      showAlert('success', vac.active ? 'Modo férias ativado.' : 'Modo férias desativado.');
    } catch {
      showAlert('error', 'Erro ao salvar modo férias.');
    } finally {
      setSavingVac(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-y-2">
        <div>
          <h1 className="text-2xl font-bold text-black">Negócio</h1>
          <p className="text-gray-400 text-sm mt-0.5">Gerencie as informações da barbearia</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs mt-1 h-5">
          {saveState === 'saving' && (
            <span className="text-gray-400 animate-pulse">Salvando…</span>
          )}
          {saveState === 'saved' && (
            <span className="text-green-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> Salvo
            </span>
          )}
        </div>
      </div>

      {AlertBanner && <div>{AlertBanner}</div>}

      {/* ─── Vacation Mode ─────────────────────────────────────────── */}
      <div className={`${sectionCls} ${vac.active ? 'border-amber-300 bg-amber-50' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle size={18} className={vac.active ? 'text-amber-500' : 'text-gray-400'} />
          <h2 className="font-semibold text-black">Modo Férias / Recesso</h2>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <Toggle checked={vac.active} onChange={handleToggleVacation} />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {vac.active ? 'Modo férias ativo' : 'Modo férias desativado'}
            </p>
            <p className="text-xs text-gray-400">Quando ativo, exibe banner de aviso no topo do site</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Mensagem de aviso</label>
            <input
              type="text"
              value={vac.message}
              onChange={e => setVac({ ...vac, message: e.target.value })}
              className={inputCls}
              placeholder="Ex: Estamos de recesso. Voltamos dia 10/02!"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Data início</label>
              <input
                type="date"
                value={vac.from}
                onChange={e => setVac({ ...vac, from: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Data fim</label>
              <input
                type="date"
                value={vac.to}
                onChange={e => setVac({ ...vac, to: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveVac}
            disabled={savingVac}
            className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40"
          >
            {savingVac ? 'Salvando…' : 'Salvar Modo Férias'}
          </button>
        </div>
      </div>

      {/* ─── Contact ───────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-4">
          <Phone size={18} className="text-gray-400" />
          <h2 className="font-semibold text-black">Contato & WhatsApp</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Número WhatsApp (com DDD)</label>
            <input
              type="tel"
              value={info.phone}
              onChange={e => updateInfo({ phone: e.target.value })}
              className={inputCls}
              placeholder="Ex: 13999999999"
            />
          </div>
          <div>
            <label className={labelCls}>Mensagem padrão do WhatsApp</label>
            <input
              type="text"
              value={info.whatsappMessage ?? ''}
              onChange={e => updateInfo({ whatsappMessage: e.target.value })}
              className={inputCls}
              placeholder="Ex: Olá! Quero agendar um horário."
            />
          </div>
        </div>
      </div>

      {/* ─── Address ───────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} className="text-gray-400" />
          <h2 className="font-semibold text-black">Endereço</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Endereço completo</label>
            <input
              type="text"
              value={info.address}
              onChange={e => updateInfo({ address: e.target.value })}
              className={inputCls}
              placeholder="Rua, número, bairro..."
            />
          </div>
          <div>
            <label className={labelCls}>Cidade</label>
            <input
              type="text"
              value={info.city ?? ''}
              onChange={e => updateInfo({ city: e.target.value })}
              className={inputCls}
              placeholder="Cidade – UF"
            />
          </div>
          <div>
            <label className={labelCls}>Link do Google Maps</label>
            <input
              type="url"
              value={info.mapsEmbedUrl ?? ''}
              onChange={e => updateInfo({ mapsEmbedUrl: e.target.value })}
              className={inputCls}
              placeholder="https://maps.google.com/maps?..."
            />
          </div>
        </div>
      </div>

      {/* ─── Hours ─────────────────────────────────────────────────── */}
      <div className={sectionCls}>
        <div className="flex items-center gap-3 mb-4">
          <Clock size={18} className="text-gray-400" />
          <h2 className="font-semibold text-black">Horários de Funcionamento</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Segunda a Sexta</label>
            <input
              type="text"
              value={info.hours?.weekdays ?? ''}
              onChange={e => updateInfo({ hours: { ...info.hours, weekdays: e.target.value } })}
              className={inputCls}
              placeholder="Ex: 09:00 - 20:00"
            />
          </div>
          <div>
            <label className={labelCls}>Sábado</label>
            <input
              type="text"
              value={info.hours?.saturday ?? ''}
              onChange={e => updateInfo({ hours: { ...info.hours, saturday: e.target.value } })}
              className={inputCls}
              placeholder="Ex: 09:00 - 18:00"
            />
          </div>
          <div>
            <label className={labelCls}>Domingo</label>
            <input
              type="text"
              value={info.hours?.sunday ?? ''}
              onChange={e => updateInfo({ hours: { ...info.hours, sunday: e.target.value } })}
              className={inputCls}
              placeholder="Ex: Fechado"
            />
          </div>
        </div>
      </div>

      <div className="h-0" />

      {/* Vacation Confirmation Modal */}
      <Modal
        isOpen={vacConfirm}
        onClose={() => setVacConfirm(false)}
        title="Ativar Modo Férias?"
        size="sm"
        footer={
          <>
            <button onClick={() => setVacConfirm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Cancelar
            </button>
            <button
              onClick={() => { setVac(v => ({ ...v, active: true })); setVacConfirm(false); }}
              className="px-5 py-2 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 transition-colors"
            >
              Sim, ativar
            </button>
          </>
        }
      >
        <div className="flex gap-3">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700">
              Ao ativar o modo férias, um banner de aviso será exibido no topo do site para os clientes.
            </p>
            <p className="text-sm text-gray-500 mt-1">Lembre-se de salvar após a confirmação.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

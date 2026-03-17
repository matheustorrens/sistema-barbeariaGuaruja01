import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AppService } from '../../types';
import { saveService, deleteService } from '../../firebase/db';
import { Modal } from '../components/Modal';
import { useAlert } from '../components/Alert';

type ServiceForm = Omit<AppService, 'firestoreId'>;

const blankForm = (): ServiceForm => ({
  id: Date.now(), name: '', description: '', price: 0, duration: '', popular: false,
});

const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`w-11 h-6 rounded-full cursor-pointer transition-colors relative shrink-0 ${checked ? 'bg-black' : 'bg-gray-300'}`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`}
    />
  </div>
);

export const ServicesPage: React.FC = () => {
  const { services }              = useData();
  const { showAlert, AlertBanner } = useAlert();

  const [editing, setEditing]       = useState<AppService | null>(null);
  const [toDelete, setToDelete]     = useState<AppService | null>(null);
  const [form, setForm]             = useState<ServiceForm>(blankForm());
  const [formOpen, setFormOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving]         = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(blankForm());
    setFormOpen(true);
  };
  const openEdit = (s: AppService) => {
    setEditing(s);
    setForm({ id: s.id, name: s.name, description: s.description, price: s.price, duration: s.duration, popular: !!s.popular });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await saveService(form, editing?.firestoreId);
      showAlert('success', editing ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!');
      setFormOpen(false);
    } catch {
      showAlert('error', 'Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete?.firestoreId) return;
    try {
      await deleteService(toDelete.firestoreId);
      showAlert('success', 'Serviço removido.');
      setDeleteOpen(false);
    } catch {
      showAlert('error', 'Erro ao remover.');
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Serviços</h1>
          <p className="text-gray-400 text-sm mt-0.5">{services.length} serviços cadastrados</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors active:scale-[0.97]"
        >
          <Plus size={16} /> Novo Serviço
        </button>
      </div>

      {AlertBanner && <div className="mb-5">{AlertBanner}</div>}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map(s => (
          <div
            key={s.firestoreId ?? s.id}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow flex flex-col"
          >
            <div className="flex items-start gap-2 flex-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-black text-sm">{s.name}</h3>
                  {s.popular && (
                    <span className="shrink-0 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      MAIS PROCURADO
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{s.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div>
                <span className="text-xl font-bold text-black">R$ {s.price.toFixed(2)}</span>
                {s.duration && <span className="text-gray-400 text-xs ml-2">{s.duration}</span>}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(s)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => { setToDelete(s); setDeleteOpen(true); }}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Serviço' : 'Novo Serviço'}
        footer={
          <>
            <button onClick={() => setFormOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nome do Serviço *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="Ex: Corte Masculino Tradicional"
            />
          </div>
          <div>
            <label className={labelCls}>Descrição</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              className={inputCls + ' resize-none'}
              placeholder="Breve descrição do serviço"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Preço (R$) *</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Duração</label>
              <input
                type="text"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className={inputCls}
                placeholder="Ex: 40min"
              />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <Toggle
              checked={!!form.popular}
              onChange={() => setForm({ ...form, popular: !form.popular })}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Marcar como "Mais Procurado"</p>
              <p className="text-xs text-gray-400">Exibe um badge de destaque no card do serviço</p>
            </div>
          </label>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remover Serviço"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Cancelar
            </button>
            <button onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
              Remover
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Tem certeza que deseja remover <strong>"{toDelete?.name}"</strong>?{' '}
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
};

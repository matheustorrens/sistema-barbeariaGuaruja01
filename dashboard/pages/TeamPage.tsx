import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AppTeamMember } from '../../types';
import { saveTeamMember, deleteTeamMember } from '../../firebase/db';
import { Modal } from '../components/Modal';
import { ImageUploader } from '../components/ImageUploader';
import { useAlert } from '../components/Alert';

type TeamForm = {
  name: string;
  role: string;
  experience: string;
  image: string;
  available: boolean;
};

const blank: TeamForm = { name: '', role: '', experience: '', image: '', available: true };

const inputCls = 'w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:border-black transition-colors';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

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

export const TeamPage: React.FC = () => {
  const { team }                  = useData();
  const { showAlert, AlertBanner } = useAlert();

  const [editing, setEditing]       = useState<AppTeamMember | null>(null);
  const [toDelete, setToDelete]     = useState<AppTeamMember | null>(null);
  const [form, setForm]             = useState<TeamForm>(blank);
  const [formOpen, setFormOpen]     = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving]         = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(blank);
    setFormOpen(true);
  };
  const openEdit = (m: AppTeamMember) => {
    setEditing(m);
    setForm({ name: m.name, role: m.role, experience: m.experience, image: m.image, available: m.available });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await saveTeamMember({ id: editing?.id ?? Date.now(), ...form }, editing?.firestoreId);
      showAlert('success', editing ? 'Profissional atualizado!' : 'Profissional adicionado!');
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
      await deleteTeamMember(toDelete.firestoreId);
      showAlert('success', 'Profissional removido.');
      setDeleteOpen(false);
    } catch {
      showAlert('error', 'Erro ao remover.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Equipe</h1>
          <p className="text-gray-400 text-sm mt-0.5">{team.length} profissionais</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors active:scale-[0.97]"
        >
          <Plus size={16} /> Novo Profissional
        </button>
      </div>

      {AlertBanner && <div className="mb-5">{AlertBanner}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {team.map(m => (
          <div
            key={m.firestoreId ?? m.id}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
          >
            <img
              src={m.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=eee&color=555&size=80`}
              alt={m.name}
              className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-black text-sm truncate">{m.name}</p>
                <span className={`shrink-0 w-2 h-2 rounded-full ${m.available ? 'bg-green-500' : 'bg-red-400'}`} />
              </div>
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{m.role}</p>
              <p className="text-gray-400 text-xs">{m.experience}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => openEdit(m)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => { setToDelete(m); setDeleteOpen(true); }}
                className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Editar Profissional' : 'Novo Profissional'}
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
          <ImageUploader
            currentImageUrl={form.image}
            onImageSelected={(_file, preview) => setForm(f => ({ ...f, image: preview }))}
            onRemove={() => setForm(f => ({ ...f, image: '' }))}
            label="Foto do Profissional"
            aspectRatio="square"
          />
          <div>
            <label className={labelCls}>Nome *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="Nome completo"
            />
          </div>
          <div>
            <label className={labelCls}>
              Especialidade / Cargo{' '}
              <span className={`font-normal ${form.role.length >= 75 ? 'text-red-500' : 'text-gray-400'}`}>
                ({form.role.length}/80)
              </span>
            </label>
            <input
              type="text"
              value={form.role}
              maxLength={80}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className={inputCls}
              placeholder="Ex: Master Barber & Proprietário"
            />
          </div>
          <div>
            <label className={labelCls}>Experiência</label>
            <input
              type="text"
              value={form.experience}
              onChange={e => setForm({ ...form, experience: e.target.value })}
              className={inputCls}
              placeholder="Ex: 10+ anos"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <Toggle
              checked={form.available}
              onChange={() => setForm({ ...form, available: !form.available })}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">Disponível para agendamentos</p>
              <p className="text-xs text-gray-400">Exibe indicador verde no card da equipe</p>
            </div>
          </label>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remover Profissional"
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
          Tem certeza que deseja remover <strong>"{toDelete?.name}"</strong> da equipe?
        </p>
      </Modal>
    </div>
  );
};

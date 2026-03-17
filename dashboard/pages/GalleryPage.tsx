import React, { useState } from 'react';
import { Plus, Trash2, ImageOff, CheckSquare, Square } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { addGalleryImage, deleteGalleryImage } from '../../firebase/db';
import { GalleryImage } from '../../types';
import { Modal } from '../components/Modal';
import { ImageUploader } from '../components/ImageUploader';
import { useAlert } from '../components/Alert';

export const GalleryPage: React.FC = () => {
  const { gallery }               = useData();
  const { showAlert, AlertBanner } = useAlert();

  const [addOpen, setAddOpen]         = useState(false);
  const [toDelete, setToDelete]       = useState<GalleryImage | null>(null);
  const [deleteOpen, setDeleteOpen]   = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [pending, setPending]         = useState<string | null>(null);
  const [saving, setSaving]           = useState(false);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectMode, setSelectMode]   = useState(false);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setSelected(new Set());
    setSelectMode(false);
  };

  const openAdd = () => {
    setPending(null);
    setAddOpen(true);
  };

  const handleAdd = async () => {
    if (!pending) return;
    setSaving(true);
    try {
      await addGalleryImage(pending);
      showAlert('success', 'Foto adicionada à galeria!');
      setAddOpen(false);
    } catch {
      showAlert('error', 'Erro ao adicionar a foto. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete?.firestoreId) return;
    try {
      await deleteGalleryImage(toDelete.firestoreId);
      showAlert('success', 'Foto removida.');
      setDeleteOpen(false);
    } catch {
      showAlert('error', 'Erro ao remover a foto.');
    }
  };

  const handleBulkDelete = async () => {
    setBulkDeleting(true);
    try {
      await Promise.all([...selected].map(id => deleteGalleryImage(id)));
      showAlert('success', `${selected.size} foto${selected.size > 1 ? 's removidas' : ' removida'}.`);
      clearSelection();
      setBulkDeleteOpen(false);
    } catch {
      showAlert('error', 'Erro ao remover fotos selecionadas.');
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Galeria</h1>
          <p className="text-gray-400 text-sm mt-0.5">{gallery.length} foto{gallery.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          {gallery.length > 0 && (
            <button
              onClick={() => { setSelectMode(s => !s); setSelected(new Set()); }}
              className={`flex items-center gap-1.5 border px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                selectMode
                  ? 'border-black text-black bg-gray-50'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black'
              }`}
            >
              {selectMode ? <CheckSquare size={15} /> : <Square size={15} />}
              Selecionar
            </button>
          )}
          {selectMode && selected.size > 0 && (
            <button
              onClick={() => setBulkDeleteOpen(true)}
              className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              <Trash2 size={15} /> Excluir {selected.size}
            </button>
          )}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors active:scale-[0.97]"
          >
            <Plus size={16} /> Adicionar Foto
          </button>
        </div>
      </div>

      {AlertBanner && <div className="mb-5">{AlertBanner}</div>}

      {gallery.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
          <ImageOff size={40} className="mb-3" />
          <p className="text-sm">Nenhuma foto na galeria ainda.</p>
          <p className="text-xs mt-1 text-gray-400">Clique em "Adicionar Foto" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {gallery.map((img, idx) => {
            const id        = img.firestoreId ?? '';
            const isSelected = selected.has(id);
            return (
              <div
                key={img.firestoreId ?? idx}
                onClick={() => selectMode && id ? toggleSelect(id) : undefined}
                className={`group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 ${
                  selectMode ? 'cursor-pointer' : ''
                } ${isSelected ? 'ring-2 ring-black ring-offset-2' : ''}`}
              >
                <img
                  src={img.url}
                  alt={`Galeria ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Select mode overlay */}
                {selectMode && (
                  <div className={`absolute inset-0 transition-colors flex items-start justify-start p-2 ${
                    isSelected ? 'bg-black/30' : 'bg-black/0 group-hover:bg-black/20'
                  }`}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shadow ${
                      isSelected ? 'bg-black border-black' : 'bg-white/80 border-white'
                    }`}>
                      {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                  </div>
                )}
                {/* Normal hover: single delete */}
                {!selectMode && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => { setToDelete(img); setDeleteOpen(true); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg"
                      title="Remover foto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Adicionar Foto"
        size="md"
        footer={
          <>
            <button onClick={() => setAddOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              disabled={saving || !pending}
              className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              {saving ? 'Enviando…' : 'Adicionar'}
            </button>
          </>
        }
      >
        <ImageUploader
          onImageSelected={(_file, preview) => setPending(preview)}
          onRemove={() => setPending(null)}
          label="Foto para a galeria"
          aspectRatio="free"
        />
      </Modal>

      {/* Delete single Modal */}
      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remover Foto"
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
        <div className="space-y-3">
          {toDelete && (
            <img
              src={toDelete.url}
              alt="Preview"
              className="w-full max-h-48 object-cover rounded-xl bg-gray-100"
            />
          )}
          <p className="text-sm text-gray-600">Tem certeza que deseja remover esta foto da galeria?</p>
        </div>
      </Modal>

      {/* Bulk delete Modal */}
      <Modal
        isOpen={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        title={`Excluir ${selected.size} foto${selected.size > 1 ? 's' : ''}?`}
        size="sm"
        footer={
          <>
            <button onClick={() => setBulkDeleteOpen(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-black transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-5 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-40"
            >
              {bulkDeleting ? 'Excluindo…' : `Excluir ${selected.size} foto${selected.size > 1 ? 's' : ''}`}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Tem certeza que deseja remover as <strong>{selected.size} fotos selecionadas</strong> da galeria?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
};

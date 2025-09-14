import { create } from 'zustand';

const useApplicationStore = create((set) => ({
  showModalPermsission: false, 
  blockedPermissions: [], 
  setBlockedPermissions: (permissions) => set((state) => ({ blockedPermissions: permissions })),
  setShowModalPermsission: (showModal) => set((state) => ({ showModalPermsission: showModal }))
}));

export { useApplicationStore };
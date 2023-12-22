import type { IModalHookRef, OmitProps } from './types';

const createModalRef = <TCP extends object>(): IModalHookRef<OmitProps<TCP>> => ({
  open: () => undefined,
  hide: () => undefined,
});

export default createModalRef;

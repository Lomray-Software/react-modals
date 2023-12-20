import type { IModalHookRef } from './types';

const createModalRef = <TProps extends object>(): IModalHookRef<TProps> => ({
  open: () => undefined,
  hide: () => undefined,
});

export default createModalRef;

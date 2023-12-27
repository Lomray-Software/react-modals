import type { TMapStores } from '@lomray/react-mobx-manager';
import type { IModalHookRef } from './types';

const createModalRef = <
  TCP extends object,
  TS extends TMapStores = NonNullable<unknown>,
>(): IModalHookRef<TS extends TMapStores ? Omit<TCP, keyof TS> : TCP> => ({
  open: () => undefined,
  hide: () => undefined,
});

export default createModalRef;

import type { TMapStores } from '@lomray/react-mobx-manager';
import type { IModalHookRef } from './types';

const createModalRef = <
  TCP extends object,
  TS extends TMapStores = Record<string, any>,
>(): IModalHookRef<Omit<TCP, keyof TS>> => ({
  open: () => undefined,
  hide: () => undefined,
});

export default createModalRef;

import type { FCC } from '@lomray/client-helpers/interfaces/fc-with-children';
import type { ReactNode, FC } from 'react';
import type useModal from './use-modal';

export interface IModalItem<TProps extends object = Record<string, any>> {
  props: IModalProps;
  Component: FCC<TProps & IModalToggle> | null;
  id: string;
  type: string;
  componentProps?: TProps;
}

interface IModalContextState<TComponentProps extends object = Record<string, any>> {
  state: IModalItem<TComponentProps>[];
}

type OmitBaseModalProps<TProps> = Omit<TProps, 'isVisible' | 'toggle'>;

export type IDefaultModalProps<TProps extends object = Record<string, any>> = OmitBaseModalProps<
  IModalProps<TProps>
>;

export interface IModalContext extends IModalContextState {
  openModal: <TProps extends object = Record<string, any>>(
    Component: IModalItem<TProps>['Component'],
    props?: IDefaultModalProps,
    componentProps?: IModalItem<TProps>['componentProps'],
    id?: string,
  ) => void;
  createModal: <TProps extends object = Record<string, any>>(
    Component: IModalItem<TProps>['Component'],
    type: string,
  ) => (props: OmitBaseModalProps<TProps>) => void;
  hideModal: (id?: string | object) => void;
}

export interface IModalRoot<TProps extends object = Record<string, any>> {
  Modal: FC<IModalProps<TProps> & IModalToggle>;
}

export interface IModalToggle {
  isVisible: boolean;
  toggle: () => void;
}

export interface IModalParentId {
  parentId: string;
}

export interface IModalHookRef<TProps extends object> {
  open: ReturnType<typeof useModal<TProps>>[0];
  hide: ReturnType<typeof useModal<TProps>>[1];
}

export interface IModalProps<TProps extends object = Record<string, any>> extends IModalToggle {
  children?: ReactNode;
  hookRef?: IModalHookRef<TProps>;
}

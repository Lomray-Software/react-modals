import type { FCC } from '@lomray/client-helpers/interfaces';
import type { FC } from 'react';
import type CHANNEL from './channel';

export interface IEventsPayload<TCP extends object> {
  event: CHANNEL;
  id: string;
  Component: FC<TCP>;
  modalProps?: IModalProps<TCP>;
  componentProps?: TCP;
}

export interface IModalItem<TCP extends object> {
  Component: FC<TCP> | null;
  modalProps: IModalProps<TCP> & IModalToggle;
  id: string;
  componentProps?: TCP;
}

export type THideModal = (id?: string | object) => void;

export interface IModalRoot<TCP extends object> {
  Modal: FCC<IModalProps<TCP> & IModalToggle>;
}

export interface IModalToggle {
  isVisible: boolean;
  closeModal: () => void;
}

export interface IModalHookRef<TCP extends object> {
  open: (componentProps?: OmitToggleProps<TCP>) => void;
  hide: () => void;
}

export interface IModalProps<TCP extends object> {
  hookRef?: IModalHookRef<TCP>;
}

export type OmitToggleProps<TP> = Omit<TP, 'closeModal' | 'isVisible'>;

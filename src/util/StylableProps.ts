import type {Properties} from 'csstype';

export interface StyleProps {
  style?: Properties;
  className?: string;
}

export type StylableProp<T = unknown> = T & StyleProps;

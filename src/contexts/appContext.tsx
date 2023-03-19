import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { HalfToneInterval, modesHTIntervals } from 'src/config/modes';
import { fourStrings, sixStrings } from 'src/config/tunings';

import { notes } from 'src/config/notes';
import { useGuitarConfig } from 'src/hooks/useGuitarConfig';
import { useStorage } from 'src/hooks/useStorage';
import { version } from '../../package.json';

export type AppContextType = {
  version: string;
  type: NeckType;
  setType: Dispatch<SetStateAction<NeckType>>;
  config: NeckConfig;
  tunings: TuningType[];
  tuning: TuningType;
  setTuning: Dispatch<SetStateAction<TuningType>>;
  tonic: Note | '';
  setTonic: Dispatch<SetStateAction<Note | ''>>;
  mode: Mode | '';
  setMode: Dispatch<SetStateAction<Mode | ''>>;
  modeNotes: Note[];
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [propName: string]: any;
}

export const AppContextProvider = ({ children, ...props }: AppContextProps) => {
  const [type, setType] = useStorage<NeckType>(
    'app-user-guitar-type',
    'classic'
  );
  const { config } = useGuitarConfig(type);
  const [tuning, setTuning] = useStorage<TuningType>(
    `app-user-${type}-tuning`,
    config.defaults.tuning
  );
  const [tonic, setTonic] = useStorage<Note | ''>('app-user-tonic', '');
  const [mode, setMode] = useStorage<Mode | ''>('app-user-mode', '');

  const tunings = useMemo(() => {
    switch (type) {
      case 'bass':
      case 'ukulele':
        return fourStrings;
      default:
      case 'classic':
      case 'lapsteel':
        return sixStrings;
    }
  }, [type]);

  const modeNotes = useMemo(() => {
    const tonicIndex = notes.findIndex((n) => n === tonic);
    const fromTonic = notes.slice(tonicIndex, notes.length);
    const beforeTonic = notes.slice(0, tonicIndex);
    const tonicSorted = [...fromTonic, ...beforeTonic];
    const modeHalfToneInterval = modesHTIntervals[mode as Mode];
    return tonicSorted.reduce(
      (res, n, i) => (modeHalfToneInterval.includes(i) ? [...res, n] : res),
      [] as Note[]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, tuning, mode]);

  useEffect(() => {
    if (!tuning) {
      setTuning(config.defaults.tuning);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return (
    <AppContext.Provider
      value={{
        version,
        type,
        setType,
        config,
        tuning,
        setTuning,
        tunings,
        tonic,
        setTonic,
        mode,
        setMode,
        modeNotes,
      }}
      {...props}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(`useAppContext must be used within a AppContextProvider.`);
  }
  return context;
};

import { Screen } from '../app/store';

export type RootStackParamList = {
  EngineList: undefined;
  AssemblyList: { engineId: string };
  AssemblyDetail: { engineId: string; assemblyId: string };
  PartDetail: { partId: string };
  Search: undefined;
  Settings: undefined;
  Backup: undefined;
};

export type AppScreen = Screen;
export type NavigationStack = Screen[];

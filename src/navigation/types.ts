import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  Upload: undefined;
  Camera: undefined;
  ReportViewer: { reportId: string };
  Reports: undefined;
  FlahyAI: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Reports: undefined;
  Settings: undefined;
};

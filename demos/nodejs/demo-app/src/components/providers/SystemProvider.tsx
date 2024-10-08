import { NavigationPanelContextProvider } from '@/components/navigation/NavigationPanelContext';
import { AppSchema } from '@/library/powersync/AppSchema';
import { DemoConnector } from '@/library/powersync/DemoConnector';
import { CircularProgress } from '@mui/material';
import { PowerSyncContext } from '@powersync/react';
import { PowerSyncDatabase } from '@powersync/web';
import Logger from 'js-logger';
import React, { Suspense } from 'react';

export const db = new PowerSyncDatabase({
  database: {
    dbFilename: 'example.db'
  },
  schema: AppSchema,
  logger: Logger
});

// Make db accessible on the console for debugging
(window as any).db = db;

const ConnectorContext = React.createContext<DemoConnector | null>(null);
export const useConnector = () => React.useContext(ConnectorContext);

export const SystemProvider = ({ children }: { children: React.ReactNode }) => {
  const [connector] = React.useState(new DemoConnector());
  const [powerSync] = React.useState(db);

  React.useEffect(() => {
    // Linting thinks this is a hook due to it's name
    Logger.useDefaults(); // eslint-disable-line
    Logger.setLevel(Logger.DEBUG);

    // For console testing purposes
    (window as any)._powersync = powerSync;

    powerSync.init();
    powerSync.connect(connector);
  }, [powerSync, connector]);

  return (
    <Suspense fallback={<CircularProgress />}>
      <PowerSyncContext.Provider value={powerSync}>
        <ConnectorContext.Provider value={connector}>
          <NavigationPanelContextProvider>{children}</NavigationPanelContextProvider>
        </ConnectorContext.Provider>
      </PowerSyncContext.Provider>
    </Suspense>
  );
};

export default SystemProvider;

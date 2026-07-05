import React, { createContext, useContext, useState } from 'react';

interface ThreadContext {
  threadId: number | undefined;
  setThreadId: (id: number) => void;
}

export const threadIdContext = createContext<ThreadContext>({
  threadId: undefined,
  setThreadId: () => {},
});

export const useThreadIdContext = () => {
  return useContext(threadIdContext);
};

export const ThreadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [threadId, setThreadId] = useState<number>();

  return (
    <threadIdContext.Provider value={{ threadId, setThreadId }}>
      {children}
    </threadIdContext.Provider>
  );
};

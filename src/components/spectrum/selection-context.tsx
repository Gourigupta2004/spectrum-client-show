import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Ctx = {
  count: number;
  setCount: (n: number) => void;
  openCheckout: () => void;
  setOpenCheckout: (fn: () => void) => void;
};

const SelectionContext = createContext<Ctx>({
  count: 0,
  setCount: () => {},
  openCheckout: () => {},
  setOpenCheckout: () => {},
});

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [opener, setOpener] = useState<{ fn: () => void }>({ fn: () => {} });

  const value = useMemo<Ctx>(
    () => ({
      count,
      setCount,
      openCheckout: () => opener.fn(),
      setOpenCheckout: (fn: () => void) => setOpener({ fn }),
    }),
    [count, opener],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export const useSelection = () => useContext(SelectionContext);

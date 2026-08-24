import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type IntroCtx = {
  /** Nav renders its logomark only once the intro logo has handed off. */
  navLogoVisible: boolean;
  setNavLogoVisible: (v: boolean) => void;
};

const Ctx = createContext<IntroCtx>({ navLogoVisible: true, setNavLogoVisible: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  const [navLogoVisible, setNavLogoVisible] = useState(true);
  const value = useMemo(() => ({ navLogoVisible, setNavLogoVisible }), [navLogoVisible]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useIntro = () => useContext(Ctx);

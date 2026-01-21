import React from "react";

export const AuthContext = React.createContext<{
  userId: string | null;
}>({ userId: null });

"use client";

import { ReactNode, useEffect, useState } from "react";
import SuperTokens, { SuperTokensWrapper } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import { canHandleRoute, getRoutingComponent } from "supertokens-auth-react/ui";

// Initialize SuperTokens only on client-side
if (typeof window !== "undefined") {
  SuperTokens.init({
    appInfo: {
      appName: "Trading",
      apiDomain: "http://localhost:3000/",
      websiteDomain: "http://localhost:3000/",
      apiBasePath: "/auth",
      websiteBasePath: "/auth",
    },
    recipeList: [EmailPassword.init(), Session.init()],
  });
}

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  if ( typeof window !== "undefined" && canHandleRoute([EmailPasswordPreBuiltUI]) ) {
    // This renders the login UI on the /auth route
    return getRoutingComponent([EmailPasswordPreBuiltUI]);
  }

  return <SuperTokensWrapper>{children}</SuperTokensWrapper>;
}

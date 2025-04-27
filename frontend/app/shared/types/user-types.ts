interface LoginMethod {
  recipeId: string;
  recipeUserId: {
    recipeUserId: string;
  };
  tenantIds: string[];
  email: string;
  timeJoined: number;
  verified: boolean;
}

interface UserInfo {
  id: string;
  isPrimaryUser: boolean;
  tenantIds: string[];
  emails: string[];
  phoneNumbers: string[];
  thirdParty: any[];
  webauthn: {
    credentialIds: string[];
  };
  timeJoined: number;
  loginMethods: LoginMethod[];
}

export interface UserInfoResponse {
  userId: string;
  userInfo: UserInfo;
}

interface StockHolding {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentValue: number;
}

export interface UserPortfolio {
  portfolioId: string;
  userId: string;
  balance: number;
  investedValue: number;
  holdings: StockHolding[];
  createdAt: string;
  updatedAt: string;
}

// Coinbase OAuth2 integration utilities

/**
 * Generate a random string for the state parameter
 */
export const generateStateParam = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Store the state parameter in localStorage for verification
 */
export const storeStateParam = (state: string): void => {
  localStorage.setItem('coinbase_oauth_state', state);
};

/**
 * Verify the state parameter from the OAuth redirect
 */
export const verifyStateParam = (state: string): boolean => {
  const storedState = localStorage.getItem('coinbase_oauth_state');
  return storedState === state;
};

/**
 * Save the access token and related data
 */
export const saveTokenData = (data: {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}): void => {
  localStorage.setItem('coinbase_token_data', JSON.stringify({
    ...data,
    timestamp: Date.now()
  }));
};

/**
 * Get the saved token data
 */
export const getTokenData = () => {
  const data = localStorage.getItem('coinbase_token_data');
  return data ? JSON.parse(data) : null;
};

/**
 * Check if the token is expired
 */
export const isTokenExpired = (): boolean => {
  const data = getTokenData();
  if (!data) return true;
  
  const expirationTime = data.timestamp + (data.expires_in * 1000);
  return Date.now() > expirationTime;
};

/**
 * Clear the token data
 */
export const clearTokenData = (): void => {
  localStorage.removeItem('coinbase_token_data');
  localStorage.removeItem('coinbase_oauth_state');
};

/**
 * Log debug information to console
 */
export const logDebugInfo = (message: string, data?: any): void => {
  console.log(`[Coinbase OAuth] ${message}`, data || '');
}; 
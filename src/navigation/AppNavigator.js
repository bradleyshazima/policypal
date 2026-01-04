import React, { useState } from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  // This will later be replaced with actual auth state management
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </>
  );
};

export default AppNavigator;
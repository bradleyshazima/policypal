import React, { useState } from 'react';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return isAuthenticated ? (
    <MainNavigator />
  ) : (
    <AuthNavigator setIsAuthenticated={setIsAuthenticated} />
  );
};

export default AppNavigator;

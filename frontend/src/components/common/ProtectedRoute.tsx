import React, { useEffect } from 'react';
import { useAuth, useRefresh } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {token , user} = useAuth()
  const { mutate: refresh, isPending, isError, isSuccess } = useRefresh()
  useEffect(() => {
    if (!token || token.trim() === '' || (user && user.exp * 1000 < Date.now())) {
      refresh()

    }
  }, [])
  if (isPending || (!token && !isError && !isSuccess)) return null
  return token ? (
    <>{children}</>
  ) : (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};
export default ProtectedRoute;

import { createSelector } from '@reduxjs/toolkit';

// Sélecteurs de base
const selectUserState = state => state.user;

// Sélecteurs mémoïsés
export const selectCurrentUser = createSelector(
  [selectUserState],
  (userState) => userState.user
);

export const selectIsAuthenticated = createSelector(
  [selectUserState],
  (userState) => userState.isAuthenticated
);

export const selectAuthToken = createSelector(
  [selectUserState],
  (userState) => userState.token
);

export const selectAuthLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

export const selectAuthError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

// Sélecteur pour vérifier les droits d'admin
export const selectIsAdmin = createSelector(
  [selectCurrentUser],
  (user) => {
    if (!user) return false;
    return user.roles?.includes('admin') || user.role === 'admin';
  }
);

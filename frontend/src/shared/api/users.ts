// frontend/src/shared/api/users.ts
import { UserRole } from "../types/index.ts";

export const updateUserRole = async (userId: number, newRole: UserRole, token: string) => {
  const response = await fetch(`/api/users/${userId}/role`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role: newRole })
  });
  
  if (!response.ok) throw new Error('Ошибка при обновлении роли');
  return await response.json();
};

export const fetchCurrentUserRole = async (token: string) => {
  const response = await fetch('/api/users/check-role', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Ошибка при проверке роли');
  return await response.json();
};
import React, { useEffect, useState } from 'react';
import { api, User } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserSelectionProps {
  onUserSelect: (userId: number) => void;
  selectedUserId?: number;
}

export const UserSelection: React.FC<UserSelectionProps> = ({
  onUserSelect,
  selectedUserId
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api.getUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = (value: string) => {
    const userId = parseInt(value, 10);
    if (!isNaN(userId)) {
      onUserSelect(userId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select User</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center p-4">Loading users...</div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : (
          <Select
            value={selectedUserId?.toString()}
            onValueChange={handleUserChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.name} (ID: {user.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedUserId && users.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium">User Preferences</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {users.find(u => u.id === selectedUserId)?.preferences.map((pref, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSelection;

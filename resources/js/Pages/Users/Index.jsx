import React from 'react';

export default function Index({ users }) {
    return (
        <div style={{ padding: 32 }}>
            <h1>Users Index</h1>
            {users && users.data && users.data.length > 0 ? (
                <ul>
                    {users.data.map(user => (
                        <li key={user.user_id || user.id}>{user.name} ({user.email_address || user.email})</li>
                    ))}
                </ul>
            ) : (
                <p>No users found.</p>
            )}
        </div>
    );
}




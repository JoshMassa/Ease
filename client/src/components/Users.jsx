import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../utils/queries';

const Users = () => {
    const { loading, error, data } = useQuery(GET_USERS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {data.users.map(user => {
                    <li key={user._id}>{user.username} - {user.email}</li>
                })}
            </ul>
        </div>
    );
};

export default Users;
export const GET_ORDERS = `
    SELECT 
        o.id,
        u.name as usuario,
        l.address as locker_address,
        os.name as status,
        o.created_at,
        o.updated_at
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN lockers l ON o.locker_id = l.id
    JOIN order_statuses os ON o.status_id = os.id
    ORDER BY o.created_at DESC
    `

export const GET_ORDER_BY_USER_ID = `
        SELECT 
        o.id,
        u.name as usuario,
        l.address as locker_address,
        os.name as status,
        o.created_at,
        o.updated_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN lockers l ON o.locker_id = l.id
        JOIN order_statuses os ON o.status_id = os.id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC`

export const CREATE_NEW_ORDER = `
        INSERT INTO orders (user_id, locker_id, status_id)
        VALUES ($1, $2, $3)
        RETURNING id, user_id, locker_id, status_id, created_at`

export const UPDATE_ORDER = `
        UPDATE orders 
        SET status_id = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, user_id, locker_id, status_id, updated_at`

export const DELETE_ORDER = `DELETE FROM orders WHERE id = $1 RETURNING id`
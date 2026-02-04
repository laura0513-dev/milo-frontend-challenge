const GET_ALL_USERS = `
      SELECT u.id, u.name, u.email, r.name as role, u.created_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `

const GET_USER_BY_ID =  `
        SELECT u.id, u.name, u.email, r.name as role, u.created_at
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.id = $1`

const CREATE_USER = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role_id, created_at`    

const UPDATE_USER = `
        UPDATE users 
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            password_hash = COALESCE($3, password_hash),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, name, email, role_id, updated_at`

const DELETE_USER = `DELETE FROM users WHERE id = $1 RETURNING id`

module.exports = {
  GET_ALL_USERS,
  GET_USER_BY_ID,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
}


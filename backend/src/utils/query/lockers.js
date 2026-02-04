const GET_ALL_LOCKERS = `
        SELECT l.id, l.name, l.address, l.latitude, l.longitude, COALESCE(u.name, 'Usuario Eliminado') as created_by, l.created_at
        FROM lockers l
        LEFT JOIN users u ON l.created_by = u.id
        WHERE l.is_active = true
        ORDER BY l.created_at DESC
        `

const GET_LOCKER_BY_ID = `
        SELECT l.id, l.name, l.address, l.latitude, l.longitude, COALESCE(u.name, 'Usuario Eliminado') as created_by, l.is_active, l.created_at, l.updated_at
        FROM lockers l
        LEFT JOIN users u ON l.created_by = u.id
        WHERE l.id = $1
        `

const GET_LOCKERS_BY_DISTANCE = `
        SELECT l.id, l.name, l.address, l.latitude, l.longitude, COALESCE(u.name, 'Usuario Eliminado') as created_by,
        (6371 * acos(cos(radians($1)) * cos(radians(l.latitude)) * cos(radians(l.longitude) - radians($2)) + sin(radians($1)) * sin(radians(l.latitude)))) as distance
        FROM lockers l
        LEFT JOIN users u ON l.created_by = u.id
        WHERE l.is_active = true
        AND (6371 * acos(cos(radians($1)) * cos(radians(l.latitude)) * cos(radians(l.longitude) - radians($2)) + sin(radians($1)) * sin(radians(l.latitude)))) <= $3
        ORDER BY distance`

const CREATE_NEW_LOCKER = `
        INSERT INTO lockers (name, address, latitude, longitude, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`

const UPDATE_LOCKER = `
        UPDATE lockers 
        SET name = COALESCE($1, name),
            address = COALESCE($2, address),
            latitude = COALESCE($3, latitude),
            longitude = COALESCE($4, longitude),
            is_active = COALESCE($5, is_active),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        RETURNING *`

const DELETE_LOCKER = `DELETE FROM lockers WHERE id = $1 RETURNING id`

module.exports = {
  GET_ALL_LOCKERS,
  GET_LOCKER_BY_ID,
  GET_LOCKERS_BY_DISTANCE,
  CREATE_NEW_LOCKER,
  UPDATE_LOCKER,
  DELETE_LOCKER
}
const db = require('../config/db');

async function getLastVersion(fingerprint) {
    const result = await db.query("SELECT generated_param, version FROM affiliate_links WHERE fingerprint = $1 AND is_active = true ORDER BY version DESC LIMIT 1 ", [fingerprint]);
    return result.rowCount > 0 ? result.rows[0] : {generated_param: null, version: 1};
}

const insertNewParam = async (params) => {
    const { generated_param, keyword, src, creative, version, fingerprint } = params;
    try {
        await db.query('BEGIN');

        //Insert into affiliate_links
        const result = await db.query(
            `INSERT INTO affiliate_links (keyword, src, creative, generated_param, version, fingerprint)
             VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (keyword, src, creative, version) DO NOTHING
             RETURNING *`,
            [keyword, src, creative, generated_param, version, fingerprint],
        );

        await db.query('COMMIT');

        return result;
    } catch(error) {
        await db.query('ROLLBACK');
        console.error('Error adding version:', error);
        return false;
    }
}

const disableNewParam = async (params) => {
    const { keyword, src, creative, version } = params;
    try {
        await db.query('BEGIN');

        //Updating our_param
        const result = await db.query(
            `UPDATE affiliate_links 
             SET is_active = false, updated_at = NOW()
             WHERE keyword = $1 AND src = $2 AND creative = $3 AND version = $4 AND is_active = true
             RETURNING *`,
            [keyword, src, creative, version],
        )

        await db.query('COMMIT');
        return result;
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error updating version:', error);
        return false;
    }
}

const getNewParam = async (param) => {
    const result = await db.query(`SELECT keyword, src, creative FROM affiliate_links WHERE is_active = true AND generated_param = $1 ORDER BY version DESC LIMIT 1`, [param]);

    if (result.rowCount === 0) {
        throw new Error(`Parameter '${param}' not found`);
    }

    return result.rows[0];
}
const getNewParamHistory = async (param) => {
    const result = await db.query(`SELECT * FROM public.affiliate_links WHERE (keyword, src, creative, fingerprint) IN 
                                    ( SELECT keyword, src, creative, fingerprint FROM affiliate_links WHERE is_active = true AND generated_param = $1 ) 
                                     ORDER BY version DESC`, [param]);

    if (result.rowCount === 0) {
        throw new Error(`Parameter '${param}' not found`);
    }
    return result.rows;
}

module.exports = {
    getLastVersion,
    insertNewParam,
    disableNewParam,
    getNewParam,
    getNewParamHistory
}
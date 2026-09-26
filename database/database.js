const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(
    path.join(__dirname, "olympus.db")
);

db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        message_count INTEGER DEFAULT 0,
        voice_minutes INTEGER DEFAULT 0
    )
`).run();

function getRequiredXP(level) {
    if (level <= 1) return 100;

    const maxXP = 648000;
    const progress = (level - 1) / 999;

    return Math.floor(
        100 + (maxXP - 100) * Math.pow(progress, 1.27)
    );
}

function getLevelFromXP(xp) {
    let low = 1;
    let high = 1000;

    while (low < high) {
        const mid = Math.ceil((low + high) / 2);

        if (getRequiredXP(mid) <= xp) {
            low = mid;
        } else {
            high = mid - 1;
        }
    }

    return low;
}

function getUser(userId) {
    let user = db
        .prepare("SELECT * FROM users WHERE user_id = ?")
        .get(userId);

    if (!user) {
        db.prepare(`
            INSERT INTO users (
                user_id,
                xp,
                level,
                message_count,
                voice_minutes
            )
            VALUES (?, 0, 1, 0, 0)
        `).run(userId);

        user = db
            .prepare("SELECT * FROM users WHERE user_id = ?")
            .get(userId);
    }

    return user;
}

function addXP(userId, amount) {
    const user = getUser(userId);

    const newXP = Math.max(0, user.xp + amount);
    const newLevel = getLevelFromXP(newXP);

    db.prepare(`
        UPDATE users
        SET xp = ?,
            level = ?
        WHERE user_id = ?
    `).run(newXP, newLevel, userId);

    return getUser(userId);
}

function removeXP(userId, amount) {
    const user = getUser(userId);

    const newXP = Math.max(0, user.xp - amount);
    const newLevel = getLevelFromXP(newXP);

    db.prepare(`
        UPDATE users
        SET xp = ?,
            level = ?
        WHERE user_id = ?
    `).run(newXP, newLevel, userId);

    return getUser(userId);
}

function addMessage(userId) {
    getUser(userId);

    db.prepare(`
        UPDATE users
        SET message_count = message_count + 1
        WHERE user_id = ?
    `).run(userId);

    return addXP(userId, 5);
}

function addVoiceMinutes(userId, minutes) {
    getUser(userId);

    db.prepare(`
        UPDATE users
        SET voice_minutes = voice_minutes + ?
        WHERE user_id = ?
    `).run(minutes, userId);

    return addXP(userId, minutes * 15);
}

function resetLevel(userId) {
    getUser(userId);

    db.prepare(`
        UPDATE users
        SET xp = 0,
            level = 1,
            message_count = 0,
            voice_minutes = 0
        WHERE user_id = ?
    `).run(userId);

    return getUser(userId);
}

module.exports = {
    db,
    getUser,
    getRequiredXP,
    getLevelFromXP,
    addXP,
    removeXP,
    addMessage,
    addVoiceMinutes,
    resetLevel
};
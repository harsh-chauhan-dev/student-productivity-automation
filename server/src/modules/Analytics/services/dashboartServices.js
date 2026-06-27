import pool from "../../../config/db_config.js";
export const dashBoardAnalytics = async (userId) => {

    const [
        taskResult,
        subjectResult,
        completeResult,
        pendingResult,
        sessionResult,
        minutesResult
    ] = await Promise.all([

        pool.query(
            `SELECT COUNT(*) AS total
             FROM tasks
             WHERE user_id = $1`,
            [userId]
        ),

        pool.query(
            `SELECT COUNT(*) AS subjects
             FROM subjects
             WHERE user_id = $1`,
            [userId]
        ),

        pool.query(
            `SELECT COUNT(*) AS completed_tasks
             FROM tasks
             WHERE user_id = $1
             AND status = 'completed'`,
            [userId]
        ),

        pool.query(
            `SELECT COUNT(*) AS pending_tasks
             FROM tasks
             WHERE user_id = $1
             AND status = 'pending'`,
            [userId]
        ),

        pool.query(
            `SELECT COUNT(*) AS study_sessions
             FROM study_sessions
             WHERE user_id = $1`,
            [userId]
        ),

        pool.query(
            `SELECT COALESCE(SUM(duration_minutes),0) AS study_minutes
             FROM study_sessions
             WHERE user_id = $1`,
            [userId]
        )

    ]);

    // Extract values
    const tasks = Number(taskResult.rows[0].total);
    const subjects = Number(subjectResult.rows[0].subjects);
    const completedTasks = Number(completeResult.rows[0].completed_tasks);
    const pendingTasks = Number(pendingResult.rows[0].pending_tasks);
    const studySessions = Number(sessionResult.rows[0].study_sessions);
    const studyMinutes = Number(minutesResult.rows[0].study_minutes);

    const completionRate =
        tasks === 0
            ? 0
            : Number(((completedTasks / tasks) * 100).toFixed(2));

    return {
        subjects,
        tasks,
        completedTasks,
        pendingTasks,
        studySessions,
        studyMinutes,
        completionRate
    };
};
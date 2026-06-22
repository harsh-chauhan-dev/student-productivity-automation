const getTaskProgress = async (pool, taskId) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE completed = true) AS completed
    FROM subtasks
    WHERE task_id = $1
    `,
    [taskId]
  );

  const total = Number(result.rows[0].total);
  const completed = Number(result.rows[0].completed);

  return {
    total,
    completed,
    progress:
      total === 0
        ? 0
        : Math.round((completed / total) * 100),
  };
};

export default getTaskProgress;
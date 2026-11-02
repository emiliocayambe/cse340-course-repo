import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT title, description
      FROM public.service_project;
    `;

  const result = await db.query(query);

  return result.rows;
};

export { getAllProjects };

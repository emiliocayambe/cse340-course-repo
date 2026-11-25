import db from "./db.js";

const getAllProjects = async (numberOfProjects) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.date,
      p.location,
      p.organization_id,
      o.name AS organization_name
    FROM public.service_project AS p
    JOIN public.organization AS o ON p.organization_id = o.organization_id
    WHERE p.date >= CURRENT_DATE
    ORDER BY p.date
    LIMIT $1;
  `;
  const result = await db.query(query, [numberOfProjects]);
  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
        SELECT
          p.project_id,
          p.title,
          p.description,
          p.date,
          p.location,
          p.organization_id,
          o.name
        FROM public.service_project AS p 
        JOIN public.organization AS o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
  `;
  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT p.project_id, p.title, p.description
    FROM public.service_project AS p
    JOIN public.project_category AS pc ON p.project_id = pc.project_id
    WHERE pc.category_id = $1
    ORDER BY p.date;
  `;
  const result = await db.query(query, [categoryId]);
  return result.rows;
};

/**
 * Creates a new project in the database.
 * @param {string} title - The title of the project
 * @param {string} description - A description of the project.
 * @param {string} location - The location for the project.
 * @param {string} date - The filename of the organization's logo.
 * @param {string} organizationId - the organization ID
 * @returns {string} The id of the newly created organization record.
 */
const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
      INSERT INTO service_project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  title,
  description,
  location,
  date,
  organizationId,
  projectId,
) => {
  const query = `
      UPDATE service_project
      SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
      WHERE project_id = $6
      RETURNING project_id
    `;

  const queryParams = [
    title,
    description,
    location,
    date,
    organizationId,
    projectId,
  ];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to edit project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("project edited with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getProjectDetails,
  getProjectsByCategoryId,
  createProject,
  updateProject,
};

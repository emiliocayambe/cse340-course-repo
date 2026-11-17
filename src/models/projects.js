import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT
          project_id,
          title,
          description
        FROM
          public.service_project
        LIMIT 5 ;
    `;

  const result = await db.query(query);

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

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getProjectDetails,
  getProjectsByCategoryId,
};

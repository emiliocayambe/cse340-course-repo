import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getOrganizationDetails = async (organizationId) => {
  const query = `
      SELECT
        organization_id,
        name,
        description,
        contact_email,
        logo_filename
      FROM public.organization
      WHERE organization_id = $1;
    `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  // Return the first row of the result set, or null if no rows are found
  return result.rows.length > 0 ? result.rows[0] : null;
}; 

const getOrganizationByProjectId = async (projectId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.service_project
        WHERE project_id = $1
        ORDER BY date;
      `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows;
};
export { getAllOrganizations, getOrganizationDetails, getOrganizationByProjectId };

import { getAllProjects, getProjectDetails } from "../models/projects.js";
import { getOrganizationByProjectId } from "../models/organizations.js";

const showProjectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";
  res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
  const projectId = req.params.id;
  const projectDetails = await getProjectDetails(projectId);
  const organization = await getOrganizationByProjectId(projectId);
  const title = "Project Details";

  res.render("project", { title, projectDetails, organization });
};
export { showProjectsPage, showProjectDetailsPage };

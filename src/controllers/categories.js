import {
  getAllCategories,
  getCategoryDetails,
  assignCategoryToProject,
  updateCategoryAssignments,
  getCategoriesByProjectId,
  createCategory,
  updateCategory,
} from "../models/categories.js";
import {
  getProjectsByCategoryId,
  getProjectDetails,
} from "../models/projects.js";

import { body, validationResult } from "express-validator";

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("name must be between 3 and 100 characters"),
];

const showCategoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Categories";
  res.render("categories", { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryDetails(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);
  const title = "Category Details";

  res.render("category", { title, categoryDetails, projects });
};

const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash("success", "Categories updated successfully.");
  res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";

  res.render("new-category", { title });
};

const processNewCategoryForm = async (req, res) => {
  //Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new organization form
    return res.redirect("/new-category");
  }

  const { name } = req.body;

  try {
    // Create the new project in the database
    const newCategoryId = await createCategory(name);

    req.flash("success", "New category created successfully!");
    res.redirect(`/category/${newCategoryId}`);
  } catch (error) {
    console.error("Error creating new category:", error);
    req.flash("error", "There was an error creating the category.");
    res.redirect("/new-category");
  }
};

const showEditCategoryForm = async (req, res) => {
  const categoryId = req.params.id;
  const categoryDetails = await getCategoryDetails(categoryId);

  const title = "Edit Category";
  res.render("edit-category", { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
  //Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new organization form
    return res.redirect("/edit-category/" + req.params.id);
  }
  const categoryId = req.params.id;
  const { name } = req.body;

  await updateCategory(name, categoryId);

  req.flash("success", "Category edited successfully!");
  res.redirect(`/category/${categoryId}`);
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  showNewCategoryForm,
  categoryValidation,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
};

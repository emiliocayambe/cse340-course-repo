import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT
          category_id,
          name
        FROM
          public.category;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoriesById = async (category_id) => {
  const query = `
        SELECT
          category_id,
          name
        FROM public.category 
        WHERE category_id = $1;
  `;
  const queryParams = [category_id];
  const result = await db.query(query, queryParams);

  return result.rows.length > 0 ? result.rows[0] : null;
};

export { getAllCategories, getCategoriesById };

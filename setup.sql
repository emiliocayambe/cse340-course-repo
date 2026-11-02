CREATE TABLE IF NOT EXISTS public.organization (
    organization_id SERIAL,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL,
    CONSTRAINT organization_pkey PRIMARY KEY (organization_id)
);


CREATE TABLE IF NOT EXISTS public.service_project (
    project_id SERIAL,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT service_project_pkey PRIMARY KEY (project_id),
    CONSTRAINT fk_organization 
        FOREIGN KEY (organization_id) 
        REFERENCES public.organization (organization_id) 
        ON UPDATE CASCADE 
        ON DELETE CASCADE
);


-- 1. Create the category table
CREATE TABLE IF NOT EXISTS public.category (
    category_id SERIAL,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT category_pkey PRIMARY KEY (category_id)
);

-- 2. Create the junction table for the many-to-many relationship between projects and categories
CREATE TABLE IF NOT EXISTS public.project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    CONSTRAINT project_category_pkey PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project FOREIGN KEY (project_id) 
        REFERENCES public.service_project (project_id) 
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) 
        REFERENCES public.category (category_id) 
        ON UPDATE CASCADE ON DELETE CASCADE
);


INSERT INTO public.organization (name, description, contact_email, logo_filename) 
VALUES 
    (
        'BrightFuture Builders', 
        'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
        'info@brightfuturebuilders.org', 
        'brightfuture-logo.png'
    ),
    (
        'GreenHarvest Growers', 
        'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
        'contact@greenharvest.org', 
        'greenharvest-logo.png'
    ),
    (
        'UnityServe Volunteers', 
        'A volunteer coordination group supporting local charities and service initiatives.', 
        'hello@unityserve.org', 
        'unityserve-logo.png'
    );

-- Insert 5 projects for BrightFuture Builders (organization_id = 1)
INSERT INTO public.service_project (organization_id, title, description, location, date) 
VALUES 
    (1, 'Community Center Roof Repair', 'Repairing and insulating the roof of the local community center to prepare for the rainy season.', 'North Sector Community Hub', '2026-11-15'),
    (1, 'Eco-Friendly Playground Build', 'Constructing sustainable wooden playground equipment using recycled materials.', 'Central Park District', '2026-11-22'),
    (1, 'Sustainable Housing Workshop', 'Hosting a workshop on energy-efficient building techniques for local families.', 'Community Hall Room B', '2026-12-05'),
    (1, 'Rainwater Harvesting Setup', 'Installing a community rainwater collection and filtration system.', 'District 4 Water Station', '2026-12-12'),
    (1, 'Public Library Expansion', 'Building an additional reading room using eco-friendly framing materials.', 'Downtown Library Annex', '2026-12-20');

-- Insert 5 projects for GreenHarvest Growers (organization_id = 2)
INSERT INTO public.service_project (organization_id, title, description, location, date) 
VALUES 
    (2, 'Urban Garden Workshop', 'Teaching neighborhood residents how to grow organic vegetables in small backyard spaces.', 'Sector Sur Community Lot', '2026-11-10'),
    (2, 'Composting Training Session', 'Demonstrating organic waste composting techniques to reduce household trash.', 'Green Plaza Pavilion', '2026-11-18'),
    (2, 'School Greenhouse Setup', 'Building a small greenhouse at the local elementary school for educational programs.', 'Local School #5 Grounds', '2026-11-25'),
    (2, 'Seed Distribution Drive', 'Distributing free heirloom vegetable seeds and planting guides to families.', 'Public Square Market', '2026-12-03'),
    (2, 'Hydroponics Intro Class', 'An introductory hands-on class on setting up low-cost hydroponic systems at home.', 'Urban Farming Lab', '2026-12-10');

-- Insert 5 projects for UnityServe Volunteers (organization_id = 3)
INSERT INTO public.service_project (organization_id, title, description, location, date) 
VALUES 
    (3, 'Food Bank Distribution', 'Sorting and distributing emergency food boxes to vulnerable families in the area.', 'Downtown Distribution Hub', '2026-11-12'),
    (3, 'Winter Clothing Drive', 'Collecting, sorting, and distributing warm coats and blankets for the upcoming winter.', 'Central Church Hall', '2026-11-20'),
    (3, 'Senior Care Support Day', 'Visiting local elderly residents to assist with household chores and companionship.', 'Riverside Nursing Home', '2026-11-28'),
    (3, 'Youth Mentorship Seminar', 'Organizing career guidance and leadership workshops for local high school students.', 'Community Library Auditorium', '2026-12-04'),
    (3, 'Neighborhood Cleanup Campaign', 'A community-wide volunteer effort to clean public parks and plant native flowers.', 'West Boulevard Park', '2026-12-15');

	
-- Insert sample categories
INSERT INTO public.category (name) 
VALUES 
    ('Environmental'),
    ('Community Development'),
    ('Education & Training');


-- Associate projects with categories in the junction table
INSERT INTO public.project_category (project_id, category_id) 
VALUES 
    -- BrightFuture Builders projects (IDs 1-5)
    (1, 1), (1, 2), -- Project 1: Environmental & Community Development
    (2, 1),         -- Project 2: Environmental
    (3, 3),         -- Project 3: Education & Training
    (4, 1),         -- Project 4: Environmental
    (5, 2),         (5, 3), -- Project 5: Community Development & Education
    
    -- GreenHarvest Growers projects (IDs 6-10)
    (6, 1), (6, 3), -- Project 6: Environmental & Education
    (7, 1),         -- Project 7: Environmental
    (8, 3),         -- Project 8: Education & Training
    (9, 1),         -- Project 9: Environmental
    (10, 1), (10, 3), -- Project 10: Environmental & Education
    
    -- UnityServe Volunteers projects (IDs 11-15)
    (11, 2),        -- Project 11: Community Development
    (12, 2),        -- Project 12: Community Development
    (13, 2),        -- Project 13: Community Development
    (14, 3),        -- Project 14: Education & Training
    (15, 1), (15, 2); -- Project 15: Environmental & Community Development	
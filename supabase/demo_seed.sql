-- DEMO DATA SEED SCRIPT FOR KIDS TIME KHILGAON
-- Populates the database with initial demo courses, assignments, and curriculum data
-- Run this script in your Supabase SQL Editor to populate demo courses and assignments.

-- 1. Insert Demo Courses
INSERT INTO public.courses (id, title, description, thumbnail_url) VALUES 
('c1111111-1111-1111-1111-111111111111', 'Art & Craft Masterclass', 'Unleash your child''s creativity with hands-on art and craft sessions. Learn origami, painting, and sculpting.', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop'),
('c2222222-2222-2222-2222-222222222222', 'Spoken English for Kids', 'Build confidence and fluency in English through fun interactive storytelling, debates, and group discussions.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop'),
('c3333333-3333-3333-3333-333333333333', 'Mental Math & Logic', 'Make math fun! Boost calculation speed and logical thinking with engaging puzzles and abacus techniques.', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=800&auto=format&fit=crop'),
('c4444444-4444-4444-4444-444444444444', 'Little Scientists (STEM)', 'Exciting hands-on science experiments. Let your child discover the wonders of physics, chemistry, and biology safely.', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop'),
('c5555555-5555-5555-5555-555555555555', 'Creative Writing & Storytelling', 'Nurture the author within. Children learn to structure stories, create characters, and write beautifully.', 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop'),
('c6666666-6666-6666-6666-666666666666', 'Kids Coding (Scratch)', 'Introduction to block-based programming. Kids learn logical flow and create their own mini-games and animations.', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Demo Assignments for these courses
INSERT INTO public.assignments (id, course_id, title, description, worksheet_url, deadline) VALUES 
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Draw Your Dream House', 'Use water colors to paint your dream house. Upload a clear picture of your drawing.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', NOW() + INTERVAL '3 days'),
('a2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'Origami Crane Project', 'Follow the worksheet to fold a paper crane.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', NOW() + INTERVAL '7 days'),
('a3333333-3333-3333-3333-333333333333', 'c2222222-2222-2222-2222-222222222222', 'Record a 1-Minute Intro', 'Record a short audio or video introducing yourself in English.', null, NOW() + INTERVAL '2 days'),
('a4444444-4444-4444-4444-444444444444', 'c3333333-3333-3333-3333-333333333333', 'Math Puzzles Worksheet 1', 'Solve the 10 logic puzzles on the attached worksheet.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', NOW() + INTERVAL '5 days'),
('a5555555-5555-5555-5555-555555555555', 'c4444444-4444-4444-4444-444444444444', 'Volcano Experiment Report', 'Write down what happened when you mixed baking soda and vinegar.', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', NOW() + INTERVAL '4 days'),
('a6666666-6666-6666-6666-666666666666', 'c6666666-6666-6666-6666-666666666666', 'My First Scratch Project', 'Share the link to your Scratch game in the submission box.', null, NOW() + INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- Instruction for the User:
-- Since enrollments and attendance require YOUR specific student ID (which depends on your login), 
-- you will need to add those manually via the Super Admin dashboard once it's fully built, 
-- or you can run this customized query after replacing 'YOUR_STUDENT_ID_HERE' with your child's actual ID from the students table:
-- 
-- INSERT INTO enrollments (student_id, course_id) VALUES 
-- ('YOUR_STUDENT_ID_HERE', 'c1111111-1111-1111-1111-111111111111'),
-- ('YOUR_STUDENT_ID_HERE', 'c3333333-3333-3333-3333-333333333333');

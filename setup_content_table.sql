-- Create the page_content table
CREATE TABLE IF NOT EXISTS public.page_content (
    id TEXT PRIMARY KEY,
    page TEXT NOT NULL,
    section TEXT NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Anyone can read the page content
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.page_content FOR SELECT 
USING ( true );

-- 2. Only authenticated super admins can update page content
CREATE POLICY "Authenticated users can update content." 
ON public.page_content FOR UPDATE 
USING ( auth.role() = 'authenticated' );

CREATE POLICY "Authenticated users can insert content." 
ON public.page_content FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' );

-- Insert Default Data for Home Page
INSERT INTO public.page_content (id, page, section, content) VALUES
(
    'home_hero', 
    'home', 
    'hero', 
    '{"badge": "Admissions Open for 2026!", "title_black": "Nurturing Brilliant Minds for a", "title_gradient": "Brighter Future", "description": "Kids Time Khilgaon offers a world-class early childhood education with a holistic approach to learning, creativity, and personal development.", "button_text": "Watch Demo Classes", "button_link": "/programs"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.page_content (id, page, section, content) VALUES
(
    'home_programs', 
    'home', 
    'programs', 
    '{"title": "Our Core Programs", "description": "Designed by experts to develop cognitive, social, and physical skills.", "items": [{"title": "Art & Creativity", "desc": "Expressing imagination through colors and crafts.", "color": "bg-rose-50", "icon": "Palette"}, {"title": "Social Play", "desc": "Learning teamwork, sharing, and empathy.", "color": "bg-emerald-50", "icon": "Users"}]}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.page_content (id, page, section, content) VALUES
(
    'home_cta', 
    'home', 
    'cta', 
    '{"title": "Ready to Join the Kids Time Family?", "description": "Give your child the best start in life. Schedule a visit or enroll directly through our digital portal.", "button_text": "Start Admission Process", "button_link": "/admissions"}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Insert Default Data for About Page
INSERT INTO public.page_content (id, page, section, content) VALUES
(
    'about_hero', 
    'about', 
    'hero', 
    '{"title": "Nurturing Creativity in Every Child", "description": "At Kids Time Khilgaon, we believe every child is an artist, a storyteller, and an innovator waiting to be discovered."}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.page_content (id, page, section, content) VALUES
(
    'about_mission_vision', 
    'about', 
    'mission_vision', 
    '{"mission_title": "Our Mission", "mission_desc": "To provide a safe, engaging, and highly creative environment where children can explore their imaginations. We focus on developing core skills through art, craft, and storytelling, building confidence that lasts a lifetime.", "vision_title": "Our Vision", "vision_desc": "To be the leading creative development center in Bangladesh, where every child''s unique talent is recognized, nurtured, and celebrated."}'::jsonb
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.page_content (id, page, section, content) VALUES
(
    'about_features', 
    'about', 
    'features', 
    '{"title": "Why Kids Time Khilgaon?", "description": "We offer a unique blend of creative learning methodologies tailored for early childhood development.", "items": [{"title": "Expert Instructors", "desc": "Our teachers are highly trained professionals passionate about early childhood education and creative arts."}, {"title": "Interactive Curriculum", "desc": "Every lesson is designed to be highly interactive, ensuring children remain engaged and excited to learn."}, {"title": "Safe Environment", "desc": "We provide a secure, welcoming, and child-friendly physical and digital environment."}, {"title": "Hybrid Learning", "desc": "Flexibility of both on-center physical classes and engaging live online sessions."}, {"title": "Continuous Feedback", "desc": "Parents receive regular updates, assignments, and progress reports through our dedicated dashboard."}, {"title": "Holistic Development", "desc": "Focusing not just on art, but on cognitive, motor, and social skills development."}]}'::jsonb
) ON CONFLICT (id) DO NOTHING;

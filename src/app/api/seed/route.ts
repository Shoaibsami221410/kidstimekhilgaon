import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const demoCourses = [
      { id: 'c1111111-1111-1111-1111-111111111111', title: 'Art & Craft Masterclass', description: 'Unleash your child\'s creativity with hands-on art and craft sessions. Learn origami, painting, and sculpting.', thumbnail_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop' },
      { id: 'c2222222-2222-2222-2222-222222222222', title: 'Spoken English for Kids', description: 'Build confidence and fluency in English through fun interactive storytelling, debates, and group discussions.', thumbnail_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop' },
      { id: 'c3333333-3333-3333-3333-333333333333', title: 'Mental Math & Logic', description: 'Make math fun! Boost calculation speed and logical thinking with engaging puzzles and abacus techniques.', thumbnail_url: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=800&auto=format&fit=crop' },
      { id: 'c4444444-4444-4444-4444-444444444444', title: 'Little Scientists (STEM)', description: 'Exciting hands-on science experiments. Let your child discover the wonders of physics, chemistry, and biology safely.', thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop' },
      { id: 'c5555555-5555-5555-5555-555555555555', title: 'Creative Writing & Storytelling', description: 'Nurture the author within. Children learn to structure stories, create characters, and write beautifully.', thumbnail_url: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=800&auto=format&fit=crop' },
      { id: 'c6666666-6666-6666-6666-666666666666', title: 'Kids Coding (Scratch)', description: 'Introduction to block-based programming. Kids learn logical flow and create their own mini-games and animations.', thumbnail_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop' }
    ];

    const demoAssignments = [
      { id: 'a1111111-1111-1111-1111-111111111111', course_id: 'c1111111-1111-1111-1111-111111111111', title: 'Draw Your Dream House', description: 'Use water colors to paint your dream house. Upload a clear picture of your drawing.', worksheet_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a2222222-2222-2222-2222-222222222222', course_id: 'c1111111-1111-1111-1111-111111111111', title: 'Origami Crane Project', description: 'Follow the worksheet to fold a paper crane.', worksheet_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a3333333-3333-3333-3333-333333333333', course_id: 'c2222222-2222-2222-2222-222222222222', title: 'Record a 1-Minute Intro', description: 'Record a short audio or video introducing yourself in English.', worksheet_url: null, deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a4444444-4444-4444-4444-444444444444', course_id: 'c3333333-3333-3333-3333-333333333333', title: 'Math Puzzles Worksheet 1', description: 'Solve the 10 logic puzzles on the attached worksheet.', worksheet_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a5555555-5555-5555-5555-555555555555', course_id: 'c4444444-4444-4444-4444-444444444444', title: 'Volcano Experiment Report', description: 'Write down what happened when you mixed baking soda and vinegar.', worksheet_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'a6666666-6666-6666-6666-666666666666', course_id: 'c6666666-6666-6666-6666-666666666666', title: 'My First Scratch Project', description: 'Share the link to your Scratch game in the submission box.', worksheet_url: null, deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() }
    ];

    // Insert courses
    const { error: courseError } = await supabase.from('courses').upsert(demoCourses);
    if (courseError) throw courseError;

    // Insert assignments
    const { error: assignmentError } = await supabase.from('assignments').upsert(demoAssignments);
    if (assignmentError) throw assignmentError;

    return NextResponse.json({ success: true, message: 'Demo data seeded successfully! You can now visit the Parent Dashboard to see the new Discover Courses section.' });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

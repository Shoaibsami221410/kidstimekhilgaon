import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Architecture Overview</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 40px; color: #333; }
    h1, h2, h3 { color: #111; border-bottom: 1px solid #eaeaea; padding-bottom: 10px; margin-top: 30px; }
    p, ul { margin-bottom: 20px; }
    li { margin-bottom: 8px; }
    .mermaid { margin: 20px 0; display: flex; justify-content: center; }
  </style>
</head>
<body>
  <h1>Kids Time Preschool ERP - Architecture Overview</h1>
  <p>This document outlines the high-level architecture, technology stack, and database schema for the Kids Time Preschool ERP application.</p>

  <h2>1. High-Level System Architecture</h2>
  <p>The application follows a modern serverless architecture utilizing Next.js for the frontend and backend API layers, heavily integrated with Supabase for authentication and database services.</p>

  <div class="mermaid">
graph TD
    PublicUser([Public User / Prospect])
    ParentUser([Parent])
    StaffUser([Admin / Teacher])
    StudentUser([Student])

    subgraph "Next.js Application"
        UI[Frontend UI Components<br/>Tailwind + Shadcn]
        
        subgraph "App Router"
            PublicRoutes[Public Site<br/>/about, /admissions, etc.]
            ParentApp[Parent Portal<br/>/parent]
            AdminApp[ERP Dashboard<br/>/dashboard]
            LMSApp[LMS Portal<br/>/lms]
        end
        
        ServerComponents[React Server Components]
        Middleware[Auth Middleware]
    end

    subgraph "Supabase Backend (BaaS)"
        Auth[Supabase Auth<br/>Session Management]
        Postgres[(PostgreSQL Database)]
        Storage[Supabase Storage<br/>Documents, Media]
    end

    PublicUser --> PublicRoutes
    ParentUser --> ParentApp
    StaffUser --> AdminApp
    StudentUser --> LMSApp

    PublicRoutes --> UI
    ParentApp --> UI
    AdminApp --> UI
    LMSApp --> UI

    PublicRoutes --> Middleware
    ParentApp --> Middleware
    AdminApp --> Middleware
    LMSApp --> Middleware

    Middleware <--> Auth
    ServerComponents <--> Postgres
    ServerComponents <--> Storage
  </div>

  <h2>2. Technology Stack</h2>
  <ul>
    <li><strong>Framework:</strong> Next.js 16 (App Router)</li>
    <li><strong>Language:</strong> TypeScript</li>
    <li><strong>UI/Styling:</strong> Tailwind CSS v4, Shadcn UI (Radix UI), Framer Motion</li>
    <li><strong>State Management:</strong> Zustand, React Hook Form (with Zod)</li>
    <li><strong>Backend/Database:</strong> Supabase (PostgreSQL)</li>
    <li><strong>Authentication:</strong> @supabase/ssr for secure Server-Side Rendering integration</li>
  </ul>

  <h2>3. Database Entity-Relationship (ER) Diagram</h2>
  <p>The PostgreSQL database is heavily relational, centering around a core users table that connects to role-specific entities and functional domains.</p>

  <div class="mermaid">
erDiagram
    USERS ||--o| PARENTS : "is a"
    USERS ||--o| TEACHERS : "is a"
    USERS ||--o{ STUDENTS : "logs in as"
    PARENTS ||--o{ STUDENTS : "manages"
    
    STUDENTS ||--o{ ENROLLMENTS : "has"
    COURSES ||--o{ ENROLLMENTS : "has"
    
    COURSES ||--o{ MODULES : "contains"
    MODULES ||--o{ LESSONS : "contains"
    
    STUDENTS ||--o{ ATTENDANCE : "recorded in"
    TEACHERS ||--o{ ATTENDANCE : "records"
    
    STUDENTS ||--o{ INVOICES : "billed for"
    INVOICES ||--o{ PAYMENTS : "paid via"
    
    COURSES ||--o{ ASSIGNMENTS : "has"
    STUDENTS ||--o{ SUBMISSIONS : "makes"
    ASSIGNMENTS ||--o{ SUBMISSIONS : "receives"
  </div>

  <h2>4. Application Domains</h2>
  
  <h3>4.1. Core Access & Identity</h3>
  <p>Managed via <strong>Supabase Auth</strong>. Users are assigned roles (super_admin, admin, teacher, parent, student) upon registration via database triggers. The Next.js middleware.ts ensures role-based route protection.</p>

  <h3>4.2. Academics & LMS</h3>
  <p>A robust system for course delivery. Teachers create Courses, divided into Modules and Lessons (supporting video and PDF content). Students interact with this via the /lms routes.</p>

  <h3>4.3. Administration & Finance</h3>
  <p>Handles the operational side of the preschool.</p>
  <ul>
    <li><strong>Admissions:</strong> Digital forms mapped to the admissions table for tracking prospective students.</li>
    <li><strong>Finance:</strong> Automated fee tracking through invoices and payments.</li>
    <li><strong>Attendance:</strong> Daily logging by teachers mapped to individual students.</li>
  </ul>

  <h3>4.4. Communications</h3>
  <p>Built-in tooling for engagement:</p>
  <ul>
    <li><strong>Events & RSVPs:</strong> School-wide event scheduling.</li>
    <li><strong>Messaging:</strong> Direct internal messaging between parents and staff.</li>
    <li><strong>Marketing (Demo Funnel):</strong> Prospective parents can view "Demo Classes" which are tracked for sales conversions.</li>
  </ul>

  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'architecture.html'), htmlContent);

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  console.log("Opening HTML file...");
  const fileUrl = 'file://' + path.resolve(__dirname, 'architecture.html').replace(/\\\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  
  console.log("Waiting for Mermaid to render...");
  // give it 2 seconds to render just to be safe
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log("Generating PDF...");
  const pdfPath = path.join(__dirname, 'Architecture_KidsTimeERP.pdf');
  await page.pdf({ 
    path: pdfPath, 
    format: 'A4', 
    printBackground: true, 
    margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' } 
  });
  
  await browser.close();
  console.log('PDF generated successfully at: ' + pdfPath);
})();

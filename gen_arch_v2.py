import os

html_content = """<!DOCTYPE html>
<html>
<head>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
  body {
    background: white;
    margin: 0;
    padding: 0;
    width: 900px;
    height: 950px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter', sans-serif;
  }
  .mermaid {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(1.4);
  }
</style>
</head>
<body>
  <div class="mermaid" id="diagram">
flowchart TD
    %% Styling
    classDef layer fill:#f8f9fc,stroke:#e2e8f0,stroke-width:3px,color:#334155,font-size:16px,font-weight:bold;
    classDef node fill:#ffffff,stroke:#94a3b8,stroke-width:2px,color:#0f172a,border-radius:8px,font-size:14px,padding:15px;
    classDef actor fill:#f1f5f9,stroke:#64748b,stroke-width:2px,color:#0f172a,font-size:14px,font-weight:bold;
    classDef db fill:#eff6ff,stroke:#60a5fa,stroke-width:2px,color:#1e3a8a,font-size:14px,font-weight:bold;

    %% Actors
    Parent(("👨‍👩‍👧 Parent / User")):::actor
    Staff(("👔 Admin")):::actor

    subgraph Presentation["Presentation Layer (Client)"]
        UI[Public Pages: Next.js + Tailwind]:::node
        AdminUI[Admin Dashboard UI]:::node
    end

    subgraph Application["Application Layer (Server)"]
        API[Next.js Server Actions]:::node
        AuthLogic[Supabase Auth Service]:::node
    end

    subgraph Data["Data Layer (PostgreSQL)"]
        DB[(Core Database)]:::db
        RLS[Row Level Security]:::node
        Storage[Cloud Storage Bucket]:::node
    end

    %% Flows
    Parent -->|Browse & Request Trial| UI
    Staff -->|Login & Manage| AdminUI
    
    UI -->|JSON HTTP| API
    AdminUI -->|JSON HTTP (Auth Token)| API
    AdminUI -->|Authenticate| AuthLogic
    
    API -->|SQL Queries| DB
    API -->|Upload Media| Storage
    AuthLogic -->|Validates Role| RLS
    RLS -.->|Protects| DB
    
    class Presentation,Application,Data layer;
  </div>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ 
        startOnLoad: true, 
        theme: 'base', 
        themeVariables: { 
            fontFamily: 'Inter',
            fontSize: '16px',
            primaryColor: '#ffffff',
            primaryBorderColor: '#94a3b8',
            lineColor: '#64748b',
            textColor: '#0f172a',
            clusterBkg: '#f8f9fa',
            clusterBorder: '#e2e8f0'
        } 
    });
  </script>
</body>
</html>
"""

cwd = "D:\\kidstimekhilgaon".replace("\\", "/")

with open("arch_v2.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML generated. Capturing screenshot...")
save_path = "C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/.tempmediaStorage/project_arch_v2.png"

# We use viewport-size to perfectly crop the image and prevent the massive white borders.
os.system(f"npx playwright screenshot file:///{cwd}/arch_v2.html {save_path} --viewport-size=900,950 --wait-for-timeout=2000")
print("Done!")

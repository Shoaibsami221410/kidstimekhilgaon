import os

html_content = """<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background: white;
    padding: 40px;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: sans-serif;
  }
  .mermaid {
    background: white;
  }
</style>
</head>
<body>
  <div class="mermaid" id="diagram">
flowchart TD
    %% Styling
    classDef layer fill:#f8f9fa,stroke:#e0e0e0,stroke-width:2px,color:#333;
    classDef node fill:#fff,stroke:#cbd5e1,stroke-width:2px,color:#1e293b,border-radius:6px;
    classDef actor fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#0f172a;
    classDef db fill:#eff6ff,stroke:#bfdbfe,stroke-width:2px,color:#1e40af;

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
    AdminUI -->|JSON HTTP Auth Token| API
    AdminUI -->|Authenticate| AuthLogic
    
    API -->|SQL Queries| DB
    API -->|Upload Media| Storage
    AuthLogic -->|Validates Role| RLS
    RLS -.->|Protects| DB
    
    class Presentation,Application,Data layer;
  </div>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'base', themeVariables: { fontFamily: 'sans-serif' } });
  </script>
</body>
</html>
"""

cwd = "D:\\kidstimekhilgaon".replace("\\", "/")

with open("arch.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML generated. Capturing screenshot...")
save_path = "C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/.tempmediaStorage/project_arch_ss.png"
# wait-for-timeout=2000 to ensure mermaid renders
os.system(f"npx playwright screenshot file:///{cwd}/arch.html {save_path} --wait-for-timeout=2000 --full-page")
print("Done!")

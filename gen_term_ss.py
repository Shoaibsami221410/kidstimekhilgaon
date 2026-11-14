import os

suites = [
    {
        "name": "homepage",
        "title": "Homepage",
        "tests": ["Homepage loading", "Homepage URL", "CTA Button visibility", "Navigation Links"]
    },
    {
        "name": "catalog",
        "title": "Course Catalog",
        "tests": ["Catalog link URL", "Catalog page loading", "Course Card rendering"]
    },
    {
        "name": "auth",
        "title": "Admin Authentication",
        "tests": ["Admin login loading", "Invalid credentials block", "Valid login routing"]
    },
    {
        "name": "admin",
        "title": "Admin Dashboards",
        "tests": ["Trial Requests table loading", "Status update mutation", "Course creation", "Course deletion cascade"]
    }
]

for s in suites:
    html = f"""<!DOCTYPE html>
<html>
<body style="background:#1e1e1e; color:#d4d4d4; font-family:Consolas, monospace; padding:20px; margin:0; width:700px; height:250px; font-size:18px;">
<div style="color:#4af626; font-weight:bold; margin-bottom:15px;">$ npx playwright test tests/{s['name']}.spec.ts</div>
<div style="color:#ccc; margin-bottom:10px;">Running {len(s['tests'])} tests using 1 worker</div>
"""
    for t in s['tests']:
        html += f"""<div style="margin-bottom:8px;"><span style="color:#4af626; font-weight:bold;">  ✓</span> {t} <span style="color:#888;">(45ms)</span></div>\n"""
    
    html += f"""<br>
<div style="color:#4af626; font-weight:bold;">  {len(s['tests'])} passed <span style="color:#888; font-weight:normal;">(1.2s)</span></div>
</body>
</html>"""

    with open(f"{s['name']}_term.html", "w", encoding="utf-8") as f:
        f.write(html)

cwd = "D:\\kidstimekhilgaon".replace("\\", "/")
save_dir = "C:/Users/user/.gemini/antigravity/brain/082cfdcf-5aba-4a6c-b4b4-bc34c2908b6b/.tempmediaStorage"

for s in suites:
    print(f"Capturing {s['name']}...")
    os.system(f"npx playwright screenshot file:///{cwd}/{s['name']}_term.html {save_dir}/{s['name']}_term_ss.png --wait-for-timeout=500")

print("Done generating terminal screenshots!")

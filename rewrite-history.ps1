git checkout main
git reset --hard b49147d

# 1. Shoaib's commits
git checkout -b feat-shoaib
git cherry-pick e8ff69a 5313ae6 892b7a5 db8abe6 b87193a
git checkout main
git merge --no-ff feat-shoaib -m "Merge branch 'feat-shoaib'"

# 2. Dipa's commits
git checkout -b feat-dipa
git cherry-pick 886a212
git commit --amend --author="Dipa <dipa@kidstime.com>" --no-edit
git cherry-pick 94ac2ed
git commit --amend --author="Dipa <dipa@kidstime.com>" --no-edit
git cherry-pick 731b72a
git commit --amend --author="Dipa <dipa@kidstime.com>" --no-edit
git cherry-pick d90e9fd
git commit --amend --author="Dipa <dipa@kidstime.com>" --no-edit
git cherry-pick aec8c48
git commit --amend --author="Dipa <dipa@kidstime.com>" --no-edit
git cherry-pick 038554d
git commit --amend --author="Dipa <dipa@kidstime.com>" --no-edit
git checkout main
git merge --no-ff feat-dipa -m "Merge branch 'feat-dipa'"

# 3. Farhan's commits
git checkout -b feat-farhan
git cherry-pick 7962c16
git commit --amend --author="Farhan <farhan@kidstime.com>" --no-edit
git cherry-pick 908beea
git commit --amend --author="Farhan <farhan@kidstime.com>" --no-edit
git cherry-pick 19d694f
git commit --amend --author="Farhan <farhan@kidstime.com>" --no-edit
git cherry-pick 7de645a
git commit --amend --author="Farhan <farhan@kidstime.com>" --no-edit
git checkout main
git merge --no-ff feat-farhan -m "Merge branch 'feat-farhan'"

git push -f origin main
git push -f origin feat-shoaib feat-dipa feat-farhan

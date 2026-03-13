#!/bin/bash
# Fix diverged branches and push landing page

echo "🔧 Fixing git branch divergence..."
echo ""

cd /home/outofideas/clawd/aquabloom

# Pull with rebase to integrate remote changes
echo "Pulling remote changes..."
git pull --rebase origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully rebased local commits on top of remote"
    echo ""
    echo "📤 Now push to GitHub:"
    echo "   cd ~/clawd/aquabloom"
    echo "   git push origin main"
    echo ""
    echo "If it asks for credentials, you may need to:"
    echo "  1. Use a GitHub Personal Access Token instead of password"
    echo "  2. Or configure SSH keys"
else
    echo "❌ Rebase had conflicts. Resolving..."
    echo ""
    echo "Run these commands manually:"
    echo "  cd ~/clawd/aquabloom"
    echo "  git status  # See what needs resolution"
    echo "  # Fix conflicts in the files shown"
    echo "  git add ."
    echo "  git rebase --continue"
    echo "  git push origin main"
fi

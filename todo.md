# Placeholder Interaction Upgrade Checklist

# Preview Recovery

- [x] Diagnose why the full-stack dev server preview is unavailable.
- [x] Fix the startup or build blocker.
- [x] Restart and verify the preview responds.


# Persisted Analytics Upgrade

- [x] Upgrade the static project with authenticated database support.
- [x] Add a learner activity table and migration.
- [x] Add protected activity query and completion mutation procedures.
- [x] Wire completion actions to record activity and refresh analytics.
- [x] Replace static chart history with persisted activity aggregates.
- [x] Verify authenticated persistence, chart updates, responsiveness, and production build.

# Analytics, Dark Mode, and Export Upgrade

- [x] Add a dashboard analytics view with progress-over-time charts and statistics.
- [x] Add a persistent dark mode toggle with premium theme styling.
- [x] Add a shareable progress image export.
- [x] Add a PDF progress export with print-friendly layout.
- [x] Verify chart rendering, theme switching, export flows, responsiveness, and production build.

# Premium Experience and GitHub Handoff

- [x] Strengthen premium visual hierarchy, depth, and signature product branding.
- [x] Add richer dashboard micro-interactions and a compact progress overview detail.
- [x] Refine responsive spacing, navigation, and sign-in presentation.
- [x] Verify polished desktop/mobile views and production build.
- [x] Save a clean checkpoint for GitHub export.

# Sign-in and External Learning Upgrade

- [x] Add a sign-in screen with email/password validation, remember-me persistence, and logout.
- [x] Gate the dashboard behind the sign-in screen and show the signed-in learner identity.
- [x] Add verified Microsoft Learn destinations for the Azure path, module, course cards, next module, and study-plan rows.
- [x] Make Continue learning open the real Microsoft Learn material in a new tab.
- [x] Verify authentication state, external link behavior, responsiveness, and production build.

- [x] Replace navigation placeholder toasts with working view switching for Overview, My learning, Collections, and Achievements.
- [x] Add a functional learning-path picker dialog with selectable path cards and add-to-workspace behavior.
- [x] Replace study coach placeholder with a focus-plan panel containing actionable study blocks.
- [x] Add a working settings panel for study preferences and notification toggles.
- [x] Add functional path options menus with rename, archive, and duplicate behaviors.
- [x] Add an expanded streak details panel.
- [x] Add a working calendar/study-plan panel with add-session behavior.
- [x] Add a certification breakdown panel with milestones.
- [x] Add a working next-module preview/action flow.
- [x] Verify search, progress updates, dialogs, responsive layout, type checking, and production build.

# Persistence Reliability Follow-up

- [x] Require Microsoft-authenticated entry for persisted analytics or clearly isolate local preview mode from synced progress.
- [x] Record persisted activity from every completion pathway and refresh analytics immediately after success.
- [x] Add browser verification for authenticated completion-to-chart updates on desktop and mobile.

# Persistence Reliability Verification

- [x] Gate synced completion success on activity.record succeeding and roll back local progress on failure.
- [x] Verify each module-completion trigger records activity and refreshes analytics after success.
- [x] Verify authenticated completion-to-chart updates on desktop and mobile.

# Persistence Success-Path Coverage

- [x] Add authenticated success-path coverage for activity recording and analytics refresh.
- [x] Verify each completion entry point shares the persisted completion handler.
- [x] Verify the authenticated analytics view updates after a saved completion on desktop and mobile.

# Frontend Persistence Flow Coverage

- [x] Extract and test the completion-to-record-to-analytics-refresh flow.
- [x] Capture authenticated desktop and mobile analytics verification after a saved completion.

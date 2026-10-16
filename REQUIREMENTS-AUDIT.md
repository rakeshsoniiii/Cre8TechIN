# Round 2 requirements audit — 16 October 2026

Source: the supplied Cre8TechIN_Round_2_Website_Task.pdf, all 10 pages.

## Release finding

**Round 2 is not complete.** The checked public Antideploy homepage still serves the original landing page: there is no Student Login or Dashboard navigation. The new platform files are in GitHub but are not verified as deployed to either original hosting destination. The Sites connector returns project-not-found for the existing Sites project. A GitHub push alone is not proof of a production deployment.

| PDF deliverable | Current implementation | Remaining work / verification |
|---|---|---|
| 1. 3D story homepage | Existing Three.js / GSAP experience retained; vision and portal links added | Deploy latest homepage |
| 2. Program listing and individual pages | Database-driven listing and per-slug query routes | Three programs are drafts; admin must review/publish. Individual program HTML is client-rendered, so crawlable program-specific content and metadata remain incomplete |
| 3. Four duration choices | Database and application enforce 1, 2, 3, 6 months | Detailed curriculum must cover the full selected duration; imported drafts have four milestones |
| 4. Custom application / email | Three-step form, resume upload, consent, reference ID, database RPC | Email delivery deferred by owner; live submission/resume test outstanding |
| 5. Admin program/course management | Protected admin page with program create/edit/publish/unpublish/delete | Public lecture library is currently source-managed, not editable in admin |
| 6. Review/status workflow | Approve, reject, request correction and review history | Complete live two-account journey test |
| 7. Student ID | Unique student record and ID generated on approval | Confirm live approved record and generated ID PDF |
| 8. Digital credential / public verification | Issue function, private storage, public verification RPC, revocation | Generate and inspect actual PDFs and scan QR codes |
| 9. LinkedIn share | Share and copy-link controls for issued non-offer documents | Per-credential server-rendered social previews remain incomplete |
| 10. Portfolio/project proof | Student project links and mentor-reviewed submissions; optional public idea showcase | Permission-based alumni examples/testimonials have not been supplied |
| 11. LOR | Completion and separate admin eligibility decision | Live issue test; no automatic LOR for self-marked study progress |
| 12. Offer letter | Server-side PDF from stored approved application/student fields | Live correction/regeneration/download test; delivery email deferred |
| 13. Student dashboard | Protected dashboard with status, milestones, feedback, documents, sign out | Publish; verify with real signed-in student and admin sessions |
| 14. FAQ/trust/process/contact | Vision/process/FAQ/legal/verification links; login and verification FAQs added | Dedicated confirmed contact/social details and consented testimonials still needed |
| 15. Mobile | Responsive navigation/forms/grid and touch styles | Current browser viewport override did not apply reliably; full mobile verification outstanding |
| 16. Performance / fallback | Existing WebGL fallback, reduced motion, lazy media; lecture player loads on request | Production performance measurement outstanding |
| 17. Major flow tests | Local Postgres tests pass for ownership, admin control, milestones, credentials and votes; browser library checks pass | Full live auth → application → review → issue → verify test outstanding; auth redirects not verified |
| 18. Deployment / documentation | Build, lockfiles, setup notes and source committed | Redeploy Antideploy from GitHub or restore access to the original Sites account; verify production routes |

## How a student logs in in the updated build

1. Choose **Student Login** in the header or hero.
2. Select **Create account**, enter email and password, and confirm the email.
3. Sign in. The default destination is `/dashboard.html`.
4. Apply to a published program. The dashboard shows the application status.
5. After approval, the student workspace shows milestones, mentor feedback and issued documents.

`/dashboard.html` redirects signed-out visitors to `/login.html?next=...`. Admin access uses the same Supabase Auth sign-in; the database grants the designated verified administrator access to `/admin.html`. No default/shared passwords from Skill Nexis were copied.

## Skill Nexis reuse boundary

Reviewed/adapted navigation and session-aware dashboard patterns, course metadata and lecture references, study notes/progress patterns, and the idea/vote flow. The one specified Supabase project owns the new backend. Environment files, source API credentials, default-password authentication, permissive anonymous voting, Google Forms, payments, blog and chatbot were not copied. This is not a complete clone or a completed line-by-line review of every reference file.

## Usability revision - 16 October 2026

The public entry is now labelled Login, including the form. Primary navigation is Programs, Learn and Dashboard; More contains supporting destinations and the user guide PDF. Personal dashboard and notification queries are explicitly scoped to the signed-in account, including for managers. The printable 11-page user manual explains current behavior without implementation details. These improvements do not close the release blockers listed above.

# Cre8TechIN Round 2

All authentication, applications, student records, learning progress, credentials and private storage use project `svnimrdtxcoxttcxifyr`. The browser contains only the supplied publishable key. No Skill Nexis environment file or API credential was copied.

## Setup

### Verified deployment state — 16 October 2026

- Core schema, three program drafts, and community leaderboard schema are installed in `svnimrdtxcoxttcxifyr`.
- The `platform` document function is deployed. An unauthenticated issuance request returns HTTP 401.
- The verified `rakeshsoni6266@gmail.com` account has administrator access (grant confirmed by a returned database row).
- Document signatory is `Cre8tech`, role `Authorized signatory`; the existing site URL is configured in the function.
- Auth redirect settings remain unverified: the dashboard URL Configuration navigation redirects to Integrations in this session.
- Full signed-in application → approval → PDF issuance verification remains outstanding. Local database security and workflow checks pass.
- Email delivery remains deferred. Program drafts remain unpublished pending review.
- The Sites connector currently cannot access the existing site's project. Reconnect the owning Sites account before publishing; do not create a replacement site or change audience.

### Reference adaptation

The shared navigation includes Learn, Home, About, Domain, Leaderboard, Certifications, Contact, notifications, theme switching, verification and login/workspace. The learning library contains 26 course metadata records and 105 YouTube lecture references from the supplied public `courses.js` file. Personal study checklists and notes are explicitly device-local, with notes download; they cannot award assessed credentials. All backend data uses the one specified Supabase project.

The reference project has additional payment, referral, blog, chatbot, proctoring and screening features. These have not been transplanted. Source review is not yet a line-by-line review of every reference file; do not describe this implementation as a complete clone. Reference environment files and credentials were not accessed. The source's custom authentication and permissive anonymous voting policies were replaced with Supabase Auth and ownership-based policies.

1. Apply `supabase/migrations/202610150001_round2.sql` once, followed by `202610150002_program_drafts.sql`, to the intended project. All `c8_` tables have RLS. Existing unrelated tables are untouched.
2. Set Auth Site URL to the deployed website. Allow `/dashboard.html` and `/login.html?mode=password` as redirect destinations. Keep email confirmation enabled.
3. Register and confirm the intended administrator account through `/login.html?mode=signup`. In trusted SQL, grant that exact account access with `insert into public.c8_admins(user_id) select id from auth.users where email='YOUR_ADMIN_EMAIL' on conflict do nothing;`. Never put an admin role in user-editable metadata.
4. Deploy `supabase/functions/platform/index.ts` as function `platform`. The handler validates a user JWT and checks the admin table on every request. `verify_jwt=false` delegates token validation to that handler, which supports the publishable-key frontend.
5. Set function secrets `C8_SITE_URL`, `C8_SIGNATORY_NAME`, and `C8_SIGNATORY_ROLE` to the real site and authorized document signatory. Supabase supplies its service-role environment variable inside the function; never copy that key into the frontend. Documents cannot be issued until the signatory is configured.
6. Review the three imported program drafts in `/admin.html`, adjust actual eligibility and curriculum, then publish. Lectures reuse the supplied Skill Nexis YouTube references. No third-party course files or private records were imported.

## Email deferred by request

Application, review and document events are queued in `c8_email_outbox`. No messages are sent and no row is marked sent. Configure a sender/provider and recipient policy before adding an outbox delivery worker. Supabase Auth confirmation/reset messages use the project's own Auth email configuration independently.

## Development and checks

Use `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm check`, and `pnpm dev` (port 4173). Generated platform pages are committed in `dist`; Supabase is bundled locally rather than loaded from a CDN. The existing Three.js/GSAP homepage is preserved.

The PGlite check executes the SQL against a disposable PostgreSQL engine with stubbed Auth/Storage schemas. It verifies application validation, anonymous denial, owner isolation, admin-only review, milestone locking, completion gating, service-only document issue, and public verified/invalid/revoked results. It does not substitute for live Supabase Auth, Storage, email or Edge Function tests.

## Release verification

- Register and confirm a student; submit an application and private PDF resume.
- Confirm a second student cannot read that application or resume.
- As admin, request correction; confirm the student edits the saved application.
- Approve with start date; confirm unique student/offer references and dates.
- Submit and review sequential milestones; confirm locked steps cannot be bypassed.
- Configure the real signatory; issue PDFs, inspect layout and scan the verification QR.
- Confirm offer letters stay private and revoked documents cannot be downloaded again.
- Correct a student name; confirm prior issue becomes pending and document version increases.
- Confirm completion/LOR decisions and queued notification states.
- Check desktop/mobile forms, keyboard navigation, error states and reduced motion.

Current PDF font supports Latin names. Unsupported names fail explicitly rather than being altered; add a licensed Unicode font before issuing documents containing other scripts. Existing downloaded PDFs cannot be recalled; QR verification reports their current reference status.

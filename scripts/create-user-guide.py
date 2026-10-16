from pathlib import Path
from shutil import copyfile
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/pdf/Cre8TechIN-User-Guide.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
pdfmetrics.registerFont(TTFont('Guide','C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('GuideBold','C:/Windows/Fonts/arialbd.ttf'))
pdfmetrics.registerFontFamily('Guide',normal='Guide',bold='GuideBold')
INK=colors.HexColor('#1b211b'); GOLD=colors.HexColor('#9b7937'); LIGHT=colors.HexColor('#f4f0e7')
styles={
 'title':ParagraphStyle('title',fontName='GuideBold',fontSize=34,leading=40,textColor=INK,spaceAfter=22),
 'h2':ParagraphStyle('h2',fontName='GuideBold',fontSize=15,leading=20,textColor=INK,spaceBefore=15,spaceAfter=9),
 'body':ParagraphStyle('body',fontName='Guide',fontSize=11,leading=17,textColor=INK,spaceAfter=10),
 'small':ParagraphStyle('small',fontName='Guide',fontSize=9,leading=14,textColor=colors.HexColor('#565d50'),spaceAfter=8),
 'kicker':ParagraphStyle('kicker',fontName='GuideBold',fontSize=10,leading=15,textColor=GOLD,spaceAfter=16),
}
story=[]
def p(text,style='body'): return Paragraph(text,styles[style])
def section(n,title,intro):
 if story: story.append(PageBreak())
 story.extend([p(f'CRE8TECHIN / {n}','kicker'),p(title,'title'),p(intro)])
def heading(text):story.append(p(text,'h2'))
def body(text):story.append(p(text))
def steps(items):
 for i,item in enumerate(items,1):story.append(p(f'<b>{i:02d}.</b> {item}'))
def note(text):
 t=Table([[p(text,'small')]],colWidths=[475]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),LIGHT),('BOX',(0,0),(-1,-1),.5,GOLD),('LEFTPADDING',(0,0),(-1,-1),14),('RIGHTPADDING',(0,0),(-1,-1),14),('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),7)]));story.append(t)
def table(rows,widths=[130,345]):
 t=Table([[p(c,'small') for c in row] for row in rows],colWidths=widths,hAlign='LEFT');t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('BACKGROUND',(0,0),(-1,0),LIGHT),('LINEBELOW',(0,0),(-1,-1),.4,colors.HexColor('#ded8c9')),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),6)]));story.append(t)

section('USER MANUAL','Your guide to\nCre8TechIN'.replace('\n','<br/>'),'Create Tech for India First.')
story.append(Spacer(1,28))
body('A practical guide to finding a program, using your account, following your progress and sharing verified proof of your work.')
heading('One account. A clear journey.')
body('Explore a direction. Apply when a program opens. Build through reviewed milestones. Keep your documents together. Share the proof you earn.')
story.append(Spacer(1,32))
note('<b>Edition: 16 October 2026</b><br/>This guide describes the updated website prepared for release. The public website may still show an earlier edition. If you cannot see Login, the updated experience has not yet been made available at that address.')
heading('Before you begin')
body('Programs open only after they are published. Application and document notification emails are not yet enabled; check Dashboard for updates. Issued documents require review and authorization. Example projects and the sample homepage ID are demonstrations, not completed work or valid credentials.')
heading('Inside this guide')
body('02 Find your way &nbsp; / &nbsp; 03 Your account &nbsp; / &nbsp; 04 Programs<br/>05 Apply &nbsp; / &nbsp; 06 Dashboard &nbsp; / &nbsp; 07 Learn and build<br/>08 Your documents &nbsp; / &nbsp; 09 Verify and share ideas<br/>10 Help &nbsp; / &nbsp; 11 Program team')

section('01 / FIND YOUR WAY','Know where to go.','The main navigation keeps the most-used destinations close at hand.')
table([['Where','What you can do'],['Logo','Return to the homepage and explore the Cre8TechIN story.'],['Programs','Read available opportunities, durations, skills and expected work.'],['Learn','Browse self-paced course lectures and keep personal study notes.'],['Dashboard','See your applications, approved learning journey and documents.'],['Login','Create an account, log in or request a password reset.'],['Apply now','Start an application for an open program.'],['Verify credential','Check a document reference without logging in.'],['More','Open About, Leaderboard, Certifications, Help or this user guide.'],['Notification bell','Read application updates after logging in.']])
heading('On your phone')
body('Use the menu button to open navigation. Tap a destination to continue. Login remains a clear entry point. The homepage also includes Login and Dashboard links below its opening message.')
note('If motion feels distracting, use the homepage motion control. You can use links and forms without interacting with the 3D objects.')

section('02 / YOUR ACCOUNT','Start with Login.','Everyone uses the same Login entry. The options shown after login depend on the access available to your account.')
heading('Create an account')
steps(['Choose <b>Login</b>, then <b>Create account</b>.','Enter your email and a password of at least 10 characters.','Check your inbox for a confirmation message and follow its link.','Return to <b>Login</b> and enter your details. Your usual destination is <b>Dashboard</b>.'])
heading('Already registered?')
body('Enter the same email and password you used to register. If you opened a protected page first, the website asks you to log in before continuing there.')
heading('Forgot your password?')
body('Choose <b>Forgot password?</b>, enter your email and request a reset link. Check your inbox and spam folder. Follow the reset link and choose a new password. If the link does not arrive or return correctly, contact Cre8TechIN for help.')
note('Never share your password. Use <b>Sign out</b> in Dashboard when you finish on a shared device. Creating an account does not mean your program application has been approved.')

section('03 / PROGRAMS','Choose your direction.','Programs and the self-paced Learn library serve different purposes. A lecture checklist alone does not award a program credential.')
steps(['Open <b>Programs</b> and choose <b>Explore program</b>.','Read the skills, projects, mentorship, eligibility, learning mode and start information.','Compare the available <b>1, 2, 3 or 6 month</b> options. Each month contains four reviewed milestones.','Choose <b>Apply for this program</b> when you are ready.'])
heading('What changes with duration?')
table([['Duration','Milestones'],['1 month','4 milestones: foundations and a focused project.'],['2 months','8 milestones: a guided build and iteration.'],['3 months','12 milestones: extended work, review and refinement.'],['6 months','24 milestones: advanced development and portfolio refinement.']])
note('If Programs is empty, applications are not open yet. You can still explore Learn. The program description and approved offer letter should guide your expectations; do not treat illustrative homepage courses as an enrollment offer.')

section('04 / APPLY','Send a clear application.','Prepare your contact and education details, a short statement about your goals, and any project links you want to share.')
heading('Step 1: Your details')
body('Enter your full name, phone number, college or institution, course, branch and graduation year. The application uses your account email. Use the name you want to appear on your official documents.')
heading('Step 2: Your direction')
body('Choose a program and duration. Add LinkedIn and portfolio links if you have them. Explain why you want to join. You may attach a PDF resume up to 5 MB; it is optional and private.')
heading('Step 3: Review and submit')
body('Check every detail, read the privacy notice and terms, and give your consent. Use Back if you need to correct something. Choose Submit application once you are satisfied.')
heading('Keep your reference')
body('A successful submission shows an application reference. Open Dashboard to see its status. If you see an error, read it and correct the relevant field. Before submitting again after a connection problem, check Dashboard to see whether your application was saved.')
note('The form does not promise to save an unfinished application if you leave or refresh. Keep a separate copy of a long motivation statement. Submitting an application does not guarantee admission.')

section('05 / DASHBOARD','Know your next step.','Dashboard is the place to follow your application and your approved program work.')
table([['Status','Meaning and next action'],['Submitted','Your application is saved and waiting for review.'],['Correction requested','Read the review note. Choose Update application, make the requested changes and submit again.'],['Approved','Your program workspace can open. Check your dates, student reference and document status.'],['Rejected','Read the review note. The application has not been accepted.'],['Active','Work through the available milestones and respond to feedback.'],['Completed','Completion has been reviewed. Check which documents are issued or still pending.']])
heading('Your workspace')
body('An approved program displays your student reference, start and end dates, accepted milestone count, learning tasks, feedback and documents. A new account can have an empty Dashboard until an application is submitted.')
heading('Notifications')
body('The bell shows recent application updates after login. Choose an update to open Dashboard. Mark all read clears the unread indicator on that browser.')
note('Check Dashboard rather than waiting for an application or document email. Those email notifications are not yet enabled.')

section('06 / LEARN AND BUILD','Turn learning into work.','Use the library to study, and your approved program workspace to submit work for review.')
heading('Use the Learn library')
steps(['Search by a skill or course name, or choose a topic.','Open <b>Explore lessons</b>, then choose a lecture.','Choose <b>Load lecture</b> to watch, or use the YouTube link.','Use Previous, Next or the lesson list to move between lectures.','Choose <b>Mark studied</b> for your own checklist. You can undo it.'])
heading('Keep your notes')
body('Write in Your study notes and choose Save notes on this device. Use Download notes to keep a text copy. Notes and library checklists stay in that browser; they do not automatically follow you to another device.')
heading('Submit assessed work')
steps(['Open Dashboard and expand an unlocked milestone.','Read its task and any available lecture or mentor feedback.','Add a working project or repository link beginning with https://, plus helpful notes.','Choose Submit for review. If changes are requested, revise and submit again.','The next milestone unlocks after the previous one is accepted.'])
note('A self-marked lecture is personal study progress. Program completion depends on accepted submissions and a completion review, not on clicking Mark studied.')

section('07 / YOUR DOCUMENTS','Keep the proof you earn.','Find documents under Your documents in the approved program section of Dashboard.')
table([['Document','When it is available'],['Student ID','Prepared from an approved student record; available to download after issue.'],['Offer letter','Uses approved program details and dates; available privately after issue.'],['Completion certificate','Requires accepted milestones and completion review, followed by issue.'],['Recommendation letter','Requires completion and a separate eligibility decision, followed by issue.']])
heading('Understand the document status')
body('<b>Pending:</b> the document is waiting for authorized issue. <b>Issued:</b> use Download PDF. <b>Revoked:</b> the document is no longer valid; contact the program team.')
heading('Share an issued credential')
steps(['For an issued eligible document, choose <b>Verify</b> to open its public status.','Choose <b>Copy verification link</b> to share it in a portfolio or message.','Choose <b>Share on LinkedIn</b> to open LinkedIn and finish sharing there.'])
note('Offer letters are private and do not have the public sharing controls. Check your name and dates before sharing. If a correction is needed, ask the team to update the record and issue the corrected document.')

section('08 / VERIFY AND SHARE IDEAS','Make your work easy to trust.','Credential verification is available without an account. The community showcase is optional.')
heading('Verify a credential')
steps(['Choose <b>Verify credential</b>, or scan the QR code on an issued document.','Enter the document reference exactly as shown.','Read the result and compare the displayed details with the document.'])
table([['Result','What it means'],['Verified','An issued credential matches the reference.'],['Invalid','No issued credential matches. Check for typing mistakes.'],['Revoked','The credential has been withdrawn and is no longer valid.']])
heading('Share an idea on Leaderboard')
body('Open More, then Leaderboard. Log in to share a display name, title, description and project link. Review what you are making public before publishing. You can withdraw your own entry later.')
heading('Vote thoughtfully')
body('Signed-in members can vote once per idea and remove their vote. You cannot vote for your own entry. Community votes do not replace milestone reviews or award credentials.')
note('Share only work you are entitled to publish. Remove private contact details, passwords and confidential material from project descriptions and linked work.')

section('09 / HELP','When something is unclear.','Start with the message on the page and the latest status in Dashboard.')
table([['What you see','What to do'],['No Login button','You may be viewing an earlier website edition. Ask the team for the updated website address.'],['No open programs','Applications are not open yet. Browse Learn and check back later.'],['Confirmation email missing','Check spam and the email you entered. Contact the team if confirmation cannot be completed.'],['Dashboard asks for login','Log in again. Your account may have signed out.'],['Milestone is locked','Wait until the preceding submission is accepted. Read any feedback first.'],['PDF is pending','Wait for authorized issue; approval alone does not mean a PDF has been issued.'],['Lecture will not play','Use Watch on YouTube. Availability is controlled by the lecture publisher.'],['Notes are missing','Check the same browser and device. Use downloaded notes as your backup.'],['Credential says Invalid','Check the reference. If it still fails, ask the issuing team to confirm its status.']])
heading('Contact and privacy')
body('Use the Help section and the contact information on the official Cre8TechIN website. Include an application or document reference when relevant. Do not send your password. Privacy and Terms are available in the footer.')

section('10 / PROGRAM TEAM','Manage the journey.','This section is for authorized program managers. Everyone still enters through the same Login button.')
steps(['Log in with your authorized account. From Dashboard choose <b>Manage programs</b>, or use Administration in the footer.','Create or select a program. Review its description, durations, projects, mentorship and learning requirements before publishing. Unpublish it when applications should close.','Search applications by name, email or reference, and filter by status. Review the submitted information and private resume where present.','Approve with a start date, reject, or request corrections. Add a useful review note.','Review submitted project links and provide feedback. Accept completed milestones or request changes.','Review completion once all milestones are accepted. Decide recommendation eligibility separately.','Use <b>Generate &amp; issue PDF</b> for pending eligible documents. Open the result and check the details before sharing.','For an authorized correction, update the record with a reason and regenerate pending documents. Revoke an incorrectly issued credential with a reason.'])
note('Review documents before distribution. Previously downloaded copies cannot be recalled; the verification page shows the current status. Keep records with application history by unpublishing a program rather than trying to remove it.')
heading('A good experience is a clear next step.')
body('Keep program information accurate, explain decisions, give actionable feedback, and direct learners to Dashboard for their current status.')

def decoration(c,doc):
 c.setFillColor(LIGHT);c.rect(0,812,595,30,fill=1,stroke=0)
 c.setStrokeColor(GOLD);c.setLineWidth(.7);c.line(60,53,535,53)
 c.setFont('Guide',8);c.setFillColor(INK);c.drawString(60,37,'Cre8TechIN | User guide | 16 October 2026');c.drawRightString(535,37,f'{doc.page:02d}')
doc=SimpleDocTemplate(str(OUT),pagesize=(595,842),rightMargin=60,leftMargin=60,topMargin=65,bottomMargin=72,title='Cre8TechIN - User Guide',author='Cre8TechIN')
doc.build(story,onFirstPage=decoration,onLaterPages=decoration)
copyfile(OUT,ROOT/'dist/user-guide.pdf')
print(OUT)

/**
 * EDGE Education Group — Pathway Creation Request Form
 * Run this script once in Google Apps Script to create the form
 * and linked Google Sheet automatically.
 *
 * HOW TO RUN:
 * 1. Go to script.google.com
 * 2. Click "New project"
 * 3. Paste this entire file, replacing the default content
 * 4. Click Save, then click Run (▶)
 * 5. Approve permissions when prompted
 * 6. Check your Google Drive — the form and sheet will appear there
 * 7. Open the execution log (View > Logs) to see the form and sheet URLs
 */

function createPathwayForm() {

  // ── FORM ──────────────────────────────────────────────────
  var form = FormApp.create('EDGE Pathway Creation Request');

  form.setDescription(
    'Submit this form to initiate a new Pathway to Success build.\n\n' +
    'Your submission triggers the pipeline: Claude generates the full ' +
    'course package — KSG-structured unit by unit, with misconceptions, ' +
    'practice problems, and Tutor Kit notes — which you review before ' +
    'anything moves to Pictory, Coursebox, or LearnWorlds.\n\n' +
    'Average pipeline time from submission to Gate 1 review: 3–5 minutes.'
  );

  form.setCollectEmail(false);
  form.setShowLinkToRespondAgain(true);
  form.setConfirmationMessage(
    'Your Pathway request has been submitted. The pipeline is running. ' +
    'You will see the Claude-generated package appear in the Pipeline ' +
    'Dashboard (Google Sheet) within a few minutes.'
  );


  // ── SECTION 1: COURSE ─────────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Course')
    .setHelpText('Select the course this Pathway covers. The full curriculum map for this course is already loaded — Claude will build unit by unit from the Georgia DOE standards.');

  var courseItem = form.addListItem()
    .setTitle('Course')
    .setRequired(true)
    .setHelpText('Currently piloting Algebra: Concepts & Connections. Additional courses will be added as the pipeline expands.');

  courseItem.setChoices([
    courseItem.createChoice('Algebra: Concepts & Connections'),
    courseItem.createChoice('Geometry: Concepts & Connections (coming soon)'),
    courseItem.createChoice('Advanced Algebra: Concepts & Connections (coming soon)')
  ]);


  // ── SECTION 2: STATE & SCHEDULE ───────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Standards & Schedule')
    .setHelpText('Claude uses these to pull the correct curriculum map and generate pacing-appropriate content.');

  var stateItem = form.addMultipleChoiceItem()
    .setTitle('State')
    .setRequired(true)
    .setHelpText('Determines which state standards Claude references. Additional states will be unlocked as the platform expands.');

  stateItem.setChoices([
    stateItem.createChoice('Georgia')
  ]);

  var scheduleItem = form.addMultipleChoiceItem()
    .setTitle('Schedule Type')
    .setRequired(true)
    .setHelpText('Traditional = semester-long class periods. Block = extended class periods. This sets the pacing Claude uses for each unit.');

  scheduleItem.setChoices([
    scheduleItem.createChoice('Traditional (standard class periods, weeks-based pacing)'),
    scheduleItem.createChoice('Block (extended periods, days-based pacing)')
  ]);


  // ── SECTION 3: COHORT CONTEXT ─────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Cohort Context')
    .setHelpText('Optional — but the more Claude knows about who this is for, the better the non-cognitive scaffolding, My Goals prompts, and AI coach framing will be.');

  form.addParagraphTextItem()
    .setTitle('Cohort Context')
    .setRequired(false)
    .setHelpText(
      'Describe the students this course is built for. Examples:\n' +
      '• "High math anxiety cohort, majority 9th grade, first time taking Algebra"\n' +
      '• "11th grade SAT prep group, strong procedural skills but weak conceptual understanding"\n' +
      '• "Mixed grades 9–10, several students with IEP/504 accommodations"\n\n' +
      'This context shapes how Claude writes the KNOW stage mindset activation, ' +
      'the My Goals prompts, and the AI coach tone throughout.'
    );


  // ── SECTION 4: SUBMISSION ─────────────────────────────────
  form.addSectionHeaderItem()
    .setTitle('Timeline')
    .setHelpText('Used to prioritize the pipeline queue and set the target publish date in the Pipeline Dashboard.');

  var priorityItem = form.addMultipleChoiceItem()
    .setTitle('Priority Level')
    .setRequired(true);

  priorityItem.setChoices([
    priorityItem.createChoice('Standard — 2 to 3 week timeline'),
    priorityItem.createChoice('Urgent — needed within 1 week'),
    priorityItem.createChoice('Planning Ahead — 1 month or more')
  ]);

  form.addDateItem()
    .setTitle('Target Live Date in LearnWorlds')
    .setRequired(false)
    .setHelpText('When do you need this course published and available to students?');

  form.addParagraphTextItem()
    .setTitle('Additional Notes for Claude')
    .setRequired(false)
    .setHelpText(
      'Anything else Claude should know when building this course:\n' +
      '• Connections to other courses or prior pathways students have completed\n' +
      '• Upcoming test dates that affect pacing\n' +
      '• Specific real-world contexts or examples to lean into\n' +
      '• Tone or framing preferences'
    );


  // ── LINK TO GOOGLE SHEET ──────────────────────────────────
  var sheet = SpreadsheetApp.create('EDGE Pipeline Dashboard — Pathway Requests');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  // Add pipeline status tracking columns to the sheet
  var responseSheet = sheet.getSheets()[0];
  responseSheet.setName('Pipeline');

  // The form responses auto-populate columns A onwards.
  // We add pipeline tracking columns after the form response columns.
  // Form has 7 questions so responses land in columns B–H (A = Timestamp).
  // Pipeline columns start at I.
  var headers = [
    'Pipeline Status',
    'Claude Output Doc',
    'Gate 1 Approved',
    'Pictory Videos',
    'Gate 2 Approved',
    'Coursebox Link',
    'Gate 3 Approved',
    'LearnWorlds URL',
    'Notes'
  ];

  // Find the last column after form response columns and add headers
  // We'll set them starting at column I (index 9)
  for (var i = 0; i < headers.length; i++) {
    responseSheet.getRange(1, 9 + i).setValue(headers[i]);
  }

  // Format the header row
  responseSheet.getRange(1, 1, 1, 17)
    .setBackground('#065078')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  // Freeze the header row
  responseSheet.setFrozenRows(1);

  // Add data validation for Pipeline Status column (column I = 9)
  var statusRange = responseSheet.getRange(2, 9, 1000, 1);
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList([
      'NEW',
      'OUTLINE READY',
      'OUTLINE APPROVED',
      'VIDEOS READY',
      'VIDEOS APPROVED',
      'IN COURSEBOX',
      'READY TO EXPORT',
      'LIVE'
    ], true)
    .build();
  statusRange.setDataValidation(statusRule);

  // Auto-set new submissions to NEW status using a formula note
  // (n8n will handle this automatically — this is a fallback)
  responseSheet.getRange('I2').setNote(
    'n8n auto-sets this to NEW on form submission. ' +
    'Change to OUTLINE APPROVED to trigger Pictory. ' +
    'Change to VIDEOS APPROVED to trigger Coursebox. ' +
    'Change to READY TO EXPORT to trigger LearnWorlds upload.'
  );

  // Conditional formatting for status column
  var rules = [];

  var statusColors = {
    'NEW':                '#e3f2fd',
    'OUTLINE READY':      '#fff9c4',
    'OUTLINE APPROVED':   '#c8e6c9',
    'VIDEOS READY':       '#fff9c4',
    'VIDEOS APPROVED':    '#c8e6c9',
    'IN COURSEBOX':       '#ffe0b2',
    'READY TO EXPORT':    '#e1bee7',
    'LIVE':               '#a5d6a7'
  };

  Object.keys(statusColors).forEach(function(status) {
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(status)
      .setBackground(statusColors[status])
      .setRanges([statusRange])
      .build();
    rules.push(rule);
  });

  responseSheet.setConditionalFormatRules(rules);

  // Auto-resize columns
  responseSheet.autoResizeColumns(1, 17);


  // ── LOG URLS ──────────────────────────────────────────────
  Logger.log('==============================================');
  Logger.log('EDGE Pathway Creation Form — CREATED');
  Logger.log('==============================================');
  Logger.log('FORM URL (share this with staff):');
  Logger.log(form.getPublishedUrl());
  Logger.log('');
  Logger.log('FORM EDIT URL (your admin link):');
  Logger.log(form.getEditUrl());
  Logger.log('');
  Logger.log('PIPELINE DASHBOARD (Google Sheet):');
  Logger.log(sheet.getUrl());
  Logger.log('');
  Logger.log('FORM ID (needed for n8n Google Forms trigger):');
  Logger.log(form.getId());
  Logger.log('');
  Logger.log('SHEET ID (needed for n8n Google Sheets connection):');
  Logger.log(sheet.getId());
  Logger.log('==============================================');
  Logger.log('Next step: Copy the Form ID and Sheet ID into n8n.');
  Logger.log('==============================================');

}

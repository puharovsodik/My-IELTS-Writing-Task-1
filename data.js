// data.js — IELTS Writing Trainer content tree
// Three levels: Domain (L1) → Group (L2) → Content Node (L3)

window.IELTS_DATA = {
  domains: [
    {
      id: 'guidebook',
      title: 'Guidebook',
      kicker: 'Theory & Reference',
      tagline: 'Structural anatomy of the Writing test — what examiners look for, what to deliver, how to score.',
      summary: 'Static reference. Read once, return often. Two long-form modules with companion cheatsheets.',
      groups: [
        { id: 'task1', title: 'Writing Task 1', meta: '20 min · 150 words', nodes: ['instruction', 'cheatsheet'] },
        { id: 'task2', title: 'Writing Task 2', meta: '40 min · 250 words', nodes: ['instruction', 'cheatsheet'] },
      ],
    },
    {
      id: 'practice',
      title: 'Practice',
      kicker: 'Active Drill',
      tagline: 'Retype model answers under live correctness feedback. Reps build the muscle for exam day.',
      summary: 'Live typing drills. Choose a topic, type the model answer, watch your accuracy and WPM in real time.',
      groups: [
        {
          id: 'task1',
          title: 'Task 1',
          meta: 'Visual description',
          topics: [
            { id: 'line-graphs', title: 'Line Graphs', meta: 'Trends over time' },
            { id: 'bar-charts', title: 'Bar Charts', meta: 'Discrete comparison' },
            { id: 'pie-charts', title: 'Pie Charts', meta: 'Proportions' },
            { id: 'maps', title: 'Maps', meta: 'Spatial change' },
            { id: 'processes', title: 'Processes', meta: 'Stages & flow' },
            { id: 'tables', title: 'Tables', meta: 'Multi-variable' },
          ],
        },
        {
          id: 'task2',
          title: 'Task 2',
          meta: 'Argumentative essays',
          topics: [
            { id: 'opinion', title: 'Opinion Essay', meta: 'Agree / disagree' },
            { id: 'discussion', title: 'Discussion', meta: 'Both views + own' },
            { id: 'problem-solution', title: 'Problem / Solution', meta: 'Cause-effect' },
            { id: 'advantage-disadvantage', title: 'Advantages / Disadvantages', meta: 'Two-sided weigh-in' },
            { id: 'two-part', title: 'Two-Part Question', meta: 'Direct questions' },
          ],
        },
      ],
    },
  ],
};

// ─── Instruction pages ──────────────────────────────────────────────────────
window.INSTRUCTIONS = {
  'guidebook/task1': {
    domain: 'guidebook',
    title: 'Writing Task 1',
    eyebrow: 'Module 01 · Instruction',
    deck: 'You are given a visual — chart, map, or process diagram. You have 20 minutes to write at least 150 words describing what it shows, comparing the main features. No opinion. No speculation.',

    article: [
      { h: 'What examiners actually want', p: 'A clear overview that names the two or three biggest patterns, followed by paragraphs that group related data and compare it. Not a list of every data point. Not your interpretation of why the data looks that way.' },
      { h: 'The four scoring bands', p: 'Task Achievement (did you cover the main features?), Coherence & Cohesion (do paragraphs flow with logical linkers?), Lexical Resource (range and accuracy of vocabulary), and Grammatical Range & Accuracy (complex structures used correctly). Each is scored 0–9 and averaged.' },
      { h: 'Time budget', p: 'Two minutes reading the visual and noting the overview. Two minutes outlining body paragraphs. Fifteen minutes writing. One minute proofreading. The proofread minute saves more marks than any extra sentence.' },
    ],

    checklist: [
      'Paraphrase the prompt — do not copy it.',
      'Write a one-sentence overview naming the two biggest trends or features.',
      'Group data into two body paragraphs by similarity, not chronology.',
      'Use comparative and superlative forms — more than, the highest, roughly twice.',
      'Reference specific numbers and units at least three times.',
      'Vary sentence openers: prepositional phrases, gerunds, while-clauses.',
      'Close without conclusion — Task 1 has no opinion line.',
    ],

    anatomy: {
      label: 'Anatomy of a model answer',
      blocks: [
        { tag: 'Paraphrase', body: 'The line graph illustrates the changes in average sea-surface temperatures across three oceans between 1960 and 2020.', note: 'Source noun → "graph illustrates". Time range moved to end.' },
        { tag: 'Overview', body: 'Overall, all three regions experienced an upward trend, with the Pacific recording the most pronounced increase.', note: 'No numbers. Names the headline pattern.' },
        { tag: 'Body A', body: 'In 1960, the Pacific stood at approximately 14°C, while the Atlantic and Indian Oceans were slightly cooler at 13°C and 12.5°C respectively. Over the following two decades, all three rose gradually, gaining roughly 0.5°C each.', note: 'Groups the slow-rise period. Specific values, comparative language.' },
        { tag: 'Body B', body: 'From 1990 onwards, the rate of warming accelerated. By 2020, the Pacific had climbed to 16.2°C, an increase of more than two degrees, whereas the other oceans rose to around 15°C.', note: 'Groups the acceleration phase. Past perfect for completed action.' },
      ],
    },
  },

  'guidebook/task2': {
    domain: 'guidebook',
    title: 'Writing Task 2',
    eyebrow: 'Module 02 · Instruction',
    deck: 'A short prompt asks you to discuss an issue and present your view. You have 40 minutes to write at least 250 words. Task 2 is worth two-thirds of your Writing band — invest accordingly.',

    article: [
      { h: 'Five question types', p: 'Opinion (agree/disagree), Discussion (discuss both views and give your own), Problem/Solution, Advantages/Disadvantages, and Two-Part Question. The structure varies by type. Identifying the type is the first 90 seconds of your work.' },
      { h: 'The introduction does two jobs', p: 'Paraphrase the prompt in one sentence. State your thesis in the next. That is the entire introduction — three lines max. Examiners want to find your position immediately.' },
      { h: 'Body paragraphs follow PEEL', p: 'Point (topic sentence), Evidence or Example, Explanation (why it matters), Link (back to the thesis or forward to the next point). Two body paragraphs is the standard. Three is acceptable if you can sustain depth.' },
      { h: 'Conclusion is a restate, not a reveal', p: 'Restate your thesis in different words. Summarise the two strongest points. Do not introduce new arguments. Two sentences is enough.' },
    ],

    checklist: [
      'Identify the question type before you outline.',
      'Write the thesis sentence first, on scratch paper — everything else flexes around it.',
      'Outline two body paragraphs with a point + an example each.',
      'Use precise topic vocabulary; avoid generic words like "thing", "good", "many".',
      'Connect paragraphs with discourse markers, not just "Also" or "And".',
      'Keep an eye on the clock at the 20-minute mark — you should be halfway done.',
      'Reserve 3 minutes to proofread for tense slips and article errors.',
    ],

    anatomy: {
      label: 'Anatomy of a model answer',
      blocks: [
        { tag: 'Introduction', body: 'It is sometimes argued that governments should subsidise the arts rather than leave them to private funding. While I recognise the value of artistic freedom, I largely agree that public support is essential for a healthy cultural sector.', note: 'Paraphrase + clear thesis with concession.' },
        { tag: 'Body A', body: 'Public funding ensures that cultural production is not confined to projects that generate immediate profit. Museums, regional theatres, and experimental work would struggle without state grants…', note: 'Point + evidence + extension.' },
        { tag: 'Body B', body: 'However, over-dependence on public money risks creating art that conforms to political taste. A mixed funding model — combining state grants with private patronage — addresses this tension…', note: 'Concession that strengthens, not weakens, the thesis.' },
        { tag: 'Conclusion', body: 'In conclusion, although there are legitimate concerns about state influence, the public good served by funded arts outweighs the alternative of a market-only model.', note: 'Restate, two-line summary, stop.' },
      ],
    },
  },
};

// ─── Cheatsheet pages ───────────────────────────────────────────────────────
window.CHEATSHEETS = {
  'guidebook/task1': {
    domain: 'guidebook',
    title: 'Writing Task 1',
    eyebrow: 'Module 01 · Cheatsheet',
    deck: 'Reference card. Phrases grouped by rhetorical function, vocabulary table, and slot-templates ready to adapt.',

    phraseBlocks: [
      {
        label: 'Introducing data',
        items: [
          'The chart illustrates / shows / depicts…',
          'The diagram provides information about…',
          'The graph compares X with Y over a period of…',
          'It is clear from the data that…',
        ],
      },
      {
        label: 'Describing trends',
        items: [
          'rose steadily · climbed gradually · surged · jumped',
          'declined sharply · fell modestly · plummeted',
          'fluctuated · remained stable · plateaued at',
          'reached a peak of … before falling to …',
        ],
      },
      {
        label: 'Comparing',
        items: [
          'X was roughly twice as high as Y',
          'In contrast / By comparison / On the other hand',
          'Whereas A grew, B remained unchanged',
          'The difference between … and … was negligible',
        ],
      },
      {
        label: 'Concluding the overview',
        items: [
          'Overall, the most striking feature is…',
          'In general, all three categories followed the same pattern…',
          'The data reveals a clear upward / downward shift…',
        ],
      },
    ],

    vocabTable: {
      label: 'Formal ↔ informal synonyms',
      headers: ['Casual', 'Use this instead'],
      rows: [
        ['went up a lot', 'rose sharply / surged'],
        ['went down', 'declined / decreased'],
        ['stayed the same', 'remained constant / plateaued'],
        ['big difference', 'a marked discrepancy'],
        ['about', 'approximately / roughly'],
        ['a lot of', 'a substantial number of'],
        ['got bigger', 'expanded / grew significantly'],
      ],
    },

    templates: [
      { label: 'Opening sentence', body: 'The [chart type] [illustrates / shows] the [variable] in [units] across [categories] between [year] and [year].' },
      { label: 'Overview', body: 'Overall, [the most prominent feature] is that [trend A], while [trend B / contrast].' },
      { label: 'Comparison line', body: '[Category A] rose from [value] in [year] to [value] in [year], whereas [Category B] [contrasting verb] over the same period.' },
    ],
  },

  'guidebook/task2': {
    domain: 'guidebook',
    title: 'Writing Task 2',
    eyebrow: 'Module 02 · Cheatsheet',
    deck: 'Phrase bank, formal alternatives to everyday words, and four reusable sentence templates.',

    phraseBlocks: [
      {
        label: 'Stating your position',
        items: [
          'I firmly believe that…',
          'In my view, … is preferable to …',
          'While I acknowledge that …, I would argue that …',
          'It is my contention that …',
        ],
      },
      {
        label: 'Introducing arguments',
        items: [
          'One compelling reason is that…',
          'A further consideration concerns…',
          'It is also worth noting that…',
          'From an economic / social / environmental perspective…',
        ],
      },
      {
        label: 'Counter-arguments',
        items: [
          'Critics may contend that…',
          'Although it is true that…, this argument overlooks…',
          'While such concerns are not without merit, …',
          'On the contrary, …',
        ],
      },
      {
        label: 'Concluding',
        items: [
          'To conclude / In conclusion / On balance, …',
          'Weighing these considerations, I maintain that…',
          'Although the issue is nuanced, the case for … is stronger because …',
        ],
      },
    ],

    vocabTable: {
      label: 'Upgrade everyday words',
      headers: ['Casual', 'Use this instead'],
      rows: [
        ['important', 'crucial / pivotal / paramount'],
        ['good', 'beneficial / advantageous / constructive'],
        ['bad', 'detrimental / harmful / adverse'],
        ['people', 'individuals / citizens / the public'],
        ['think', 'maintain / contend / assert'],
        ['show', 'demonstrate / indicate / illustrate'],
        ['help', 'facilitate / contribute to'],
      ],
    },

    templates: [
      { label: 'Thesis line', body: 'While [concession clause], I [strongly / largely / partially] agree that [position], primarily because [main reason].' },
      { label: 'Topic sentence', body: 'A [crucial / significant] factor in support of [position] is that [argument], particularly in [context].' },
      { label: 'Example introduction', body: 'A clear illustration of this can be found in [domain]: [specific example with detail].' },
      { label: 'Conclusion', body: 'In conclusion, despite [acknowledged drawback], the [benefits / case for X] outweigh [the alternative], making [thesis restated] the more reasonable position.' },
    ],
  },
};

// ─── Practice exercises (typing) ────────────────────────────────────────────
window.EXERCISES = {
  'practice/task1/line-graphs': {
    domain: 'practice',
    title: 'Line Graphs',
    eyebrow: 'Task 1 · Line Graphs',
    prompt: 'The graph below shows the average sea-surface temperature of three oceans between 1960 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    chartKind: 'line',
    text: 'The line graph illustrates the changes in average sea-surface temperatures across three oceans — the Pacific, Atlantic, and Indian — between 1960 and 2020. Overall, all three regions experienced an upward trend, with the Pacific recording the most pronounced increase. In 1960, the Pacific stood at approximately 14 degrees Celsius, while the Atlantic and Indian Oceans were slightly cooler at 13 and 12.5 degrees respectively. Over the following two decades, all three rose gradually, gaining roughly half a degree each. From 1990 onwards, the rate of warming accelerated noticeably. By 2020, the Pacific had climbed to 16.2 degrees, an increase of more than two degrees from its starting point, whereas the Atlantic and Indian Oceans rose to around 15 and 14.7 degrees. The gap between the warmest and coolest ocean therefore widened over the sixty-year period.',
  },
  'practice/task1/bar-charts': {
    domain: 'practice',
    title: 'Bar Charts',
    eyebrow: 'Task 1 · Bar Charts',
    prompt: 'The chart below shows the percentage of households owning selected consumer goods in the United Kingdom in 1985 and 2015.',
    chartKind: 'bar',
    text: 'The bar chart compares household ownership of five consumer goods in the United Kingdom across two reference years, 1985 and 2015. Overall, ownership rose markedly for every item, with mobile phones and personal computers showing the most dramatic gains. In 1985, only a small fraction of households — around 5 percent — owned a personal computer, and mobile phones were effectively non-existent. By 2015, computer ownership had climbed to 84 percent and mobile phone ownership to 93 percent. Television sets, already widespread in 1985 at 95 percent, edged up marginally to 97 percent. Refrigerator ownership followed a similar pattern, rising from 92 to 99 percent. Dishwashers, the least common appliance throughout the period, grew more modestly from 11 to 41 percent. Across the three decades, traditional appliances reached near-saturation while digital devices transformed from rarities into household norms.',
  },
  'practice/task1/pie-charts': {
    domain: 'practice',
    title: 'Pie Charts',
    eyebrow: 'Task 1 · Pie Charts',
    prompt: 'The pie charts below show the breakdown of household energy consumption in a typical European country in 1990 and 2020.',
    chartKind: 'pie',
    text: 'The two pie charts illustrate how household energy was distributed across five end-uses in a typical European country in 1990 and in 2020. Overall, heating remained the dominant consumer of energy in both years, but its share decreased noticeably, while appliances and water heating both expanded. In 1990, space heating accounted for roughly two-thirds of total consumption, with water heating taking 15 percent and appliances a further 10 percent. Lighting and cooking made up the remaining 9 percent. By 2020, the picture had shifted: heating had fallen to just over half, water heating had grown to 22 percent, and appliances now consumed nearly a fifth of household energy. Lighting dropped slightly, reflecting the spread of efficient bulbs, while cooking remained largely unchanged. The data suggests that as homes became better insulated, secondary uses claimed a larger share of the energy budget.',
  },
  'practice/task1/maps': {
    domain: 'practice',
    title: 'Maps',
    eyebrow: 'Task 1 · Maps',
    prompt: 'The maps below show the development of a small coastal village between 1980 and 2020.',
    chartKind: 'map',
    text: 'The two maps depict the same coastal village as it appeared in 1980 and how it has been transformed by 2020. Overall, the settlement has shifted from a quiet fishing community into a tourism-oriented town, with significant residential and commercial expansion along the shoreline. In 1980, the village comprised a small cluster of houses around a central harbour, surrounded by farmland to the west and dense forest to the north. A single road connected the harbour to the inland highway. By 2020, the farmland has been replaced by a grid of holiday apartments, and a marina has been constructed adjacent to the original harbour. The northern forest has been partially cleared to make room for a hotel and an access road. A coastal promenade now links the marina to a new beach development at the southern end of the village. The original fishermen\'s cottages remain, though several have been converted into restaurants serving the tourist trade.',
  },
  'practice/task1/processes': {
    domain: 'practice',
    title: 'Processes',
    eyebrow: 'Task 1 · Processes',
    prompt: 'The diagram below illustrates the process by which bricks are manufactured for the construction industry.',
    chartKind: 'process',
    text: 'The diagram outlines the eight-stage process by which clay is transformed into bricks for use in construction. Overall, the procedure begins with the extraction of raw material and ends with the dispatch of finished bricks, with shaping, drying, and firing forming the central stages. Initially, clay is dug from the ground using a mechanical digger and transported to the processing site. The material is then passed through a metal grid that removes large stones, after which it enters a roller to be crushed into a finer consistency. Once refined, the clay is mixed with sand and water and forced into rectangular moulds, or alternatively cut from a continuous extruded strip using a wire cutter. The shaped bricks are dried for between 24 and 48 hours before being moved into a kiln, where they are fired at temperatures of up to 1300 degrees Celsius. After firing, the bricks are cooled gradually over a 48 to 72 hour period. Finally, the cooled bricks are packaged and dispatched to building sites by lorry.',
  },
  'practice/task1/tables': {
    domain: 'practice',
    title: 'Tables',
    eyebrow: 'Task 1 · Tables',
    prompt: 'The table below shows the consumption of three types of fast food by teenagers in Australia between 1975 and 2015.',
    chartKind: 'table',
    text: 'The table presents data on average annual fast-food consumption among Australian teenagers across four reference years between 1975 and 2015, broken down into pizza, hamburgers, and fish and chips. Overall, pizza and hamburger intake rose substantially over the four decades, while consumption of fish and chips declined steadily. In 1975, fish and chips was by far the most popular choice, with teenagers eating it on average 100 times per year, compared with just 5 servings of pizza and 10 of hamburgers. By 1985, this picture had begun to shift: hamburger consumption had tripled to 33 portions, pizza had risen to 20, and fish and chips had slipped to 90. The most dramatic change occurred between 1995 and 2015, during which pizza overtook fish and chips as the leading choice, reaching 82 servings annually by the final year. Hamburgers continued to climb to 95, while fish and chips fell to just 39 portions, a decline of more than 60 percent across the period.',
  },
  'practice/task2/opinion': {
    domain: 'practice',
    title: 'Opinion Essay',
    eyebrow: 'Task 2 · Opinion',
    prompt: 'Some people believe that universities should focus on practical, job-oriented courses rather than academic subjects. To what extent do you agree or disagree?',
    chartKind: 'essay',
    text: 'The proposition that universities should prioritise vocational training over traditional academic disciplines has gained considerable traction in recent debate. While I acknowledge the genuine economic pressures behind this view, I largely disagree that academic study should be displaced, primarily because a healthy society depends on both kinds of learning. Proponents argue that graduates emerging into a competitive labour market need immediately applicable skills, and there is real merit in this position. A computer science student who has only studied abstract theory may struggle in an entry-level developer role, whereas one trained on current frameworks can contribute from week one. Universities have a legitimate responsibility to prepare students for working life. However, equating education with job training risks impoverishing both the individual and the wider culture. Disciplines such as history, philosophy, and pure mathematics may not yield obvious career paths, yet they cultivate the analytical and ethical reasoning that complex modern professions increasingly demand. Moreover, the half-life of any specific vocational skill is short — a curriculum built around today\'s industry needs may be obsolete within a decade — whereas the habits of critical thought formed by academic study endure throughout a career. In conclusion, although vocational relevance is a fair expectation of higher education, it should complement rather than replace the academic mission. Universities serve students best when they teach them how to think, not merely what to do.',
  },
  'practice/task2/discussion': {
    domain: 'practice',
    title: 'Discussion',
    eyebrow: 'Task 2 · Discussion',
    prompt: 'Some people believe children should begin formal schooling at the age of four, while others argue that seven is more appropriate. Discuss both views and give your own opinion.',
    chartKind: 'essay',
    text: 'The age at which children should enter formal schooling remains a contested question among educators and parents alike. Some argue that an early start — around the age of four — gives children a crucial head start, whereas others insist that delaying formal instruction until seven produces healthier and ultimately more capable learners. In my view, the later starting age carries more substantial benefits. Those in favour of early enrolment point to the rapid pace of cognitive development between the ages of three and five. During this window, children acquire language and basic literacy with relative ease, and structured exposure to letters and numbers can lay a strong foundation. Early schooling also socialises children and provides reliable childcare for working families. By contrast, advocates of a later start, such as those in Finland or parts of Scandinavia, emphasise that young children learn best through play and unstructured exploration. Pushing formal academics too soon, they argue, can dampen curiosity and create anxiety around performance. Research from these countries suggests that children who begin school at seven catch up quickly and often outperform their peers by adolescence. On balance, I find the latter position more persuasive. The cognitive gains of early enrolment appear short-lived, while the developmental costs are real. A system that protects early childhood for play and only later introduces formal study seems better aligned with how children actually learn.',
  },
  'practice/task2/problem-solution': {
    domain: 'practice',
    title: 'Problem / Solution',
    eyebrow: 'Task 2 · Problem / Solution',
    prompt: 'Urban traffic congestion is worsening in many cities worldwide. What are the main causes of this problem, and what measures could be taken to address it?',
    chartKind: 'essay',
    text: 'Traffic congestion has become a defining feature of urban life in cities from São Paulo to Jakarta, with commuters routinely losing hours each week to gridlock. The causes are multiple and reinforcing, but a combination of targeted policies can meaningfully ease the burden. The most obvious driver is the sheer growth in private car ownership. As incomes rise, individual vehicles become attainable for households that previously relied on public transport, and road networks struggle to absorb the additional volume. Compounding this, many cities have grown outward rather than upward, producing sprawling suburbs whose residents have little practical alternative to driving. Underinvestment in mass transit and the historical privileging of car infrastructure over cycling and pedestrian routes have further locked in car dependency. A range of measures can reverse the trend. Congestion charging schemes, of the kind pioneered in London and Stockholm, have demonstrably reduced peak-hour traffic by pricing scarce road space. Significant investment in rapid transit — metros, light rail, and bus rapid transit corridors — gives commuters a faster alternative. Cities can also redesign streets to favour cycling and walking, narrowing lanes and widening pavements. In conclusion, urban congestion arises from a tangle of economic and planning failures, but it is not intractable. A coordinated programme of road pricing, transit investment, and street redesign can restore movement to cities that have ground to a halt.',
  },
  'practice/task2/advantage-disadvantage': {
    domain: 'practice',
    title: 'Advantages / Disadvantages',
    eyebrow: 'Task 2 · Adv / Disadv',
    prompt: 'More and more people are working remotely from home rather than commuting to an office. What are the advantages and disadvantages of this trend?',
    chartKind: 'essay',
    text: 'The mass shift to remote working, accelerated by the pandemic and now embedded in many sectors, has reshaped how organisations operate and how individuals structure their days. The trend carries clear benefits for both workers and employers, although it is not without significant drawbacks. On the positive side, remote work removes the daily commute, returning to workers an hour or more of time and reducing transport costs and carbon emissions at scale. Employees report greater autonomy over their schedules, which often translates into improved focus on deep tasks and a better balance between professional and personal demands. For employers, the talent pool expands geographically: a small firm in Manchester can hire a designer in Lisbon without relocation costs. Office overheads, too, decline as floor-space requirements shrink. The disadvantages, however, are equally real. Spontaneous collaboration — the unscheduled hallway conversation that sparks a new idea — is difficult to replicate over video calls, and junior employees in particular lose the informal mentorship that proximity provides. Many remote workers report a blurring of boundaries between work and home, with longer effective hours and a rising incidence of burnout. Team cohesion can erode over time as colleagues become avatars on a screen. On balance, the trend has produced genuine gains in flexibility and autonomy, but organisations that adopt it must invest deliberately in maintaining culture and protecting the boundaries that an office once enforced.',
  },
  'practice/task2/two-part': {
    domain: 'practice',
    title: 'Two-Part Question',
    eyebrow: 'Task 2 · Two-Part',
    prompt: 'In many countries, the gap between rich and poor is widening. Why is this happening, and what steps could governments take to reduce it?',
    chartKind: 'essay',
    text: 'Across both developed and developing economies, the gap between the wealthiest households and those at the bottom of the income distribution has widened significantly over recent decades. Understanding the mechanisms behind this divergence is essential before useful policy can be designed. Several forces have combined to drive the trend. Globalisation has rewarded workers with portable, high-skill qualifications while suppressing wages for those whose jobs can be offshored or automated. The decline of trade union membership has weakened the bargaining position of lower-paid workers, and tax systems in many countries have grown less progressive, with capital gains and inheritance taxed more lightly than ordinary wages. Asset price inflation, particularly in housing, has further enriched those who already own property while pushing it out of reach for younger and lower-income households. Governments have a number of levers available. Reforming taxation to close loopholes around capital, property, and inheritance can fund redistribution. Sustained investment in public education and vocational retraining gives workers a fighting chance against technological change. Stronger floor wages, paid sick leave, and tenancy protections directly improve the position of those at the bottom. In conclusion, rising inequality is not a natural phenomenon but the product of specific policy choices, and reversing it requires equally deliberate intervention across the tax code, labour law, and the public investment budget.',
  },
};

window.SHADOW_DATA = {
  grammar: {
    title: 'Grammar',
    domain: 'grammar',
    categories: [
      {
        id: 'conditionals',
        title: 'Conditionals',
        icon: '⚡',
        note: 'Type 2/3 inverted — Had / Were / Should instead of If',
        sentences: [
          { text: 'Had the government invested more in infrastructure, the transport crisis would have been averted.' },
          { text: 'Were she to apply for the position, she would undoubtedly be selected.', band: 8 },
          { text: 'Should the data prove inconclusive, the researchers would need to conduct further trials.' },
          { text: 'Had it not been for the intervention of international organisations, the conflict might have escalated.', band: 8 },
          { text: 'Were prices to fall significantly, consumer spending would inevitably rise.' },
          { text: 'Should the temperature continue to increase, coastal communities would face severe flooding.' },
          { text: 'Had the authorities acted sooner, the environmental damage could have been minimised.' },
          { text: 'Were the company to relocate, hundreds of jobs would be lost.' },
          { text: 'Should more funding be allocated to renewable energy, the transition from fossil fuels would accelerate.', band: 7 },
          { text: 'Had stricter regulations been in place, the financial collapse might have been prevented.' },
        ],
      },
      {
        id: 'passive',
        title: 'Passive Voice',
        icon: '🔄',
        note: 'Complex passives — reporting verbs with perfect infinitive passives',
        sentences: [
          { text: 'The legislation is expected to have been drafted by the end of the financial year.', band: 8 },
          { text: 'Significant progress has been made in reducing carbon emissions over the past decade.' },
          { text: 'The report is believed to have been submitted without the required supporting evidence.', band: 8 },
          { text: 'Several recommendations were put forward by the committee but were subsequently rejected.' },
          { text: 'The data collected over three decades has been used to formulate the new policy.' },
          { text: 'The building is said to have been designed by one of the leading architects of the era.' },
          { text: 'More than a thousand species are thought to be threatened by habitat destruction each year.' },
          { text: 'The agreement is understood to have been reached after months of difficult negotiations.', band: 7 },
          { text: 'Considerable resources have been devoted to understanding the long-term effects of urbanisation.' },
          { text: 'The findings are expected to be published in a peer-reviewed journal later this year.' },
        ],
      },
      {
        id: 'inversion',
        title: 'Inversion',
        icon: '↩️',
        note: 'Negative adverbials — Not only, Rarely, Never before, So rapidly',
        sentences: [
          { text: 'Not only did the government fail to address the issue, but it also introduced counterproductive measures.', band: 7 },
          { text: 'Rarely has such a significant shift in public opinion been observed in so short a time.', band: 7 },
          { text: 'Under no circumstances should personal data be shared without the explicit consent of the individual.' },
          { text: 'No sooner had the legislation been passed than it was challenged in the courts.' },
          { text: 'Only when the scale of the problem became apparent did officials take decisive action.' },
          { text: 'Never before has the rate of technological change posed such a profound challenge to society.', band: 8 },
          { text: 'Seldom do economic growth and environmental protection advance simultaneously.' },
          { text: 'Not until the final results were announced did investors regain confidence in the market.' },
          { text: 'So rapidly has the technology developed that regulators have struggled to keep pace.', band: 8 },
          { text: 'Little did the researchers anticipate that their findings would generate such widespread controversy.' },
        ],
      },
      {
        id: 'reported-speech',
        title: 'Reported Speech',
        icon: '💬',
        note: 'Backshift — will→would, is→was, has been→had been',
        sentences: [
          { text: 'The minister announced that the proposed reforms would be implemented in stages over the following year.' },
          { text: 'Scientists warned that unless immediate action was taken, the damage would prove irreversible.' },
          { text: 'The spokesperson confirmed that the investigation had been ongoing for several months.' },
          { text: 'Analysts predicted that the economic recovery would take longer than had initially been anticipated.', band: 8 },
          { text: 'The committee acknowledged that insufficient attention had been paid to the needs of rural communities.' },
          { text: 'Critics argued that the policy had been poorly designed and was unlikely to achieve its stated objectives.' },
          { text: 'Researchers suggested that the findings should be interpreted with considerable caution.' },
          { text: 'The report concluded that further investment would be required if the targets were to be met.', band: 8 },
          { text: 'Officials stated that the negotiations had reached a critical stage and that a breakthrough was imminent.' },
          { text: 'Experts cautioned that the technology, while promising, had yet to be tested at scale.' },
        ],
      },
      {
        id: 'cleft',
        title: 'Cleft Sentences',
        icon: '✂️',
        note: 'It is...that / What...is — highlighting sentence structures',
        sentences: [
          { text: 'It is the lack of affordable housing that has driven many young people out of the city.' },
          { text: 'What the data clearly demonstrates is that inequality has widened significantly over the past two decades.', band: 8 },
          { text: 'It was not until the industrial revolution that the pace of urbanisation began to accelerate dramatically.' },
          { text: 'What the government has failed to recognise is the long-term cost of underinvesting in education.', band: 7 },
          { text: 'It is through international cooperation that the most pressing environmental challenges can be addressed.', band: 8 },
          { text: 'What distinguishes this approach from previous attempts is its emphasis on community-led solutions.' },
          { text: 'It is the wealthiest nations that bear the greatest responsibility for reducing carbon emissions.' },
          { text: 'What the research consistently shows is that early intervention yields the most significant long-term benefits.' },
          { text: 'It was only after considerable public pressure that the authorities agreed to review the decision.' },
          { text: 'What makes this period particularly significant is the unprecedented convergence of social and economic disruption.' },
        ],
      },
    ],
  },
  practice: {
    title: 'Practice',
    domain: 'practice',
    categories: [
      {
        id: 'line-graphs',
        title: 'Line Graphs',
        icon: '📈',
        note: 'Trend vocabulary — rise, fall, plateau, peak, converge',
        sentences: [
          { text: 'The line graph illustrates the changes in energy consumption across five countries between 1990 and 2020.' },
          { text: 'Overall, it is evident that oil usage experienced a dramatic surge, while renewable energy climbed steadily throughout the period.' },
          { text: 'France consistently outperformed Germany throughout the period, with the gap widening particularly after 2005.' },
          { text: 'Having peaked at 45 million in 2010, the figure subsequently plummeted to just 28 million by the end of the period.', band: 7 },
          { text: 'The proportion of users accessing the internet via mobile devices rose exponentially from 2008 onwards.' },
          { text: 'Both categories fluctuated considerably during the early years before levelling off at approximately 30% in 2015.' },
          { text: 'By far the most striking feature is the sharp decline in coal consumption, which nearly halved over the two-decade period.', band: 8 },
          { text: 'The figures for urban and rural populations converged significantly, reaching an almost identical level by 2018.' },
          { text: 'After remaining stable throughout most of the 1990s, sales began to climb steadily from 2001 onwards.' },
          { text: 'In contrast to the UK, where usage dropped significantly, Germany witnessed a sharp increase over the same period.', band: 7 },
        ],
      },
      {
        id: 'bar-charts',
        title: 'Bar Charts',
        icon: '📊',
        note: 'Comparison language — outstrip, dwarf, stark contrast',
        sentences: [
          { text: 'The bar chart compares the proportion of household income spent on food and leisure across six European countries in 2019.' },
          { text: 'Overall, the United Kingdom recorded the highest figure by a considerable margin, while Poland showed the lowest across all categories.' },
          { text: 'At 45%, transport costs in Japan significantly outstripped those in all other countries surveyed.', band: 7 },
          { text: 'Healthcare spending in the United States dwarfed all other categories, standing at approximately three times the global average.', band: 8 },
          { text: 'While the figures for Germany and France exhibit a marginal difference, both countries considerably outpace their eastern European counterparts.' },
          { text: 'The proportion allocated to education ranked highest in South Korea, accounting for the largest share at nearly 18%.' },
          { text: 'There is a stark contrast between developed and developing nations, with the former spending nearly double the latter on infrastructure.', band: 7 },
          { text: 'With the exception of Japan, all countries surveyed showed a broadly similar pattern of expenditure across the five categories.' },
          { text: 'Technology exports from China more than doubled between 2010 and 2020, causing it to overtake the United States for the first time.' },
          { text: 'The gap between the highest and lowest performing nations was particularly pronounced in the healthcare and education sectors.' },
        ],
      },
      {
        id: 'pie-charts',
        title: 'Pie Charts',
        icon: '🥧',
        note: "Proportion language — lion's share, skewed, two-fifths",
        sentences: [
          { text: 'The pie charts illustrate the breakdown of household energy consumption in Germany in 1990 and 2020.' },
          { text: 'Overall, heating accounted for the largest proportion in both years, while electricity constituted the smallest share.' },
          { text: "Transport claimed the lion's share of government expenditure, accounting for well over a third of the total budget.", band: 8 },
          { text: 'Food and clothing collectively accounted for approximately two-fifths of total household spending in the base year.' },
          { text: 'At a mere 4%, expenditure on culture and recreation remained only a fraction of that spent on housing.' },
          { text: 'The distribution is heavily skewed towards service industries, which jointly represented over 60% of the national economy.', band: 7 },
          { text: 'Manufacturing and agriculture, comprising approximately 15% and 8% respectively, saw their combined share decline sharply by 2020.' },
          { text: 'The share attributed to renewable energy was more than double that recorded a decade earlier, rising from 12% to 25%.' },
          { text: 'With the notable exception of Asia, all other regions showed a broadly comparable distribution of trade activity.' },
          { text: 'Spending on defence, at approximately one-fifth of the total, considerably outweighed investment in social welfare programmes.' },
        ],
      },
      {
        id: 'maps',
        title: 'Maps',
        icon: '🗺️',
        note: 'Spatial transformation — constructed, demolished, converted into',
        sentences: [
          { text: 'The maps illustrate how the coastal town of Bradfield has transformed over a fifty-year period from 1970 to 2020.' },
          { text: 'Overall, the area underwent substantial development, with the farmland to the north being replaced by a residential zone.', band: 7 },
          { text: 'The factory situated in the northern corner was demolished and replaced by a modern shopping centre.' },
          { text: 'A dual carriageway running through the centre of town was constructed, significantly improving connectivity across the region.' },
          { text: 'The woodland adjacent to the river was removed to make way for a new leisure complex and car park.' },
          { text: 'The school building, originally located opposite the town hall, was extended considerably during the later period.' },
          { text: 'Several residential properties on both sides of the main road were converted into commercial premises between 1990 and 2020.' },
          { text: 'The harbour, which had previously remained unchanged since its construction, was expanded and upgraded during the later period.', band: 8 },
          { text: 'A pedestrian walkway was developed along the northern bank, connecting the old town to the newly built cultural centre.' },
          { text: 'The industrial zone to the east of the railway line was relocated and transformed into a public park and recreation area.' },
        ],
      },
      {
        id: 'processes',
        title: 'Process Diagrams',
        icon: '⚙️',
        note: 'Sequential passive — commencing with, culminating in, penultimate stage',
        sentences: [
          { text: 'The diagram illustrates the process by which raw coffee beans are transformed into the finished product ready for retail sale.' },
          { text: 'Overall, the process comprises seven distinct stages, commencing with the harvesting of ripe berries and culminating in packaging.' },
          { text: 'Once the outer casing has been removed, the beans are subjected to a thorough washing process to eliminate impurities.' },
          { text: 'In the penultimate stage, the dried beans undergo roasting at temperatures exceeding 200 degrees, thereby altering their chemical composition.', band: 8 },
          { text: 'Prior to fermentation, the harvested grapes are passed through a mechanical press to extract the juice from the pulp.' },
          { text: 'The mixture is then transferred to a series of heated chambers, where it is left to mature for a minimum of six weeks.' },
          { text: 'At this juncture, the material is meticulously inspected for defects before being passed on to the next stage of production.', band: 8 },
          { text: 'The recycled material is converted into small pellets, which are subsequently melted and moulded into new plastic containers.' },
          { text: 'The water is first filtered to remove solid particles, then treated with chemicals to eliminate any remaining bacterial contamination.' },
          { text: 'Once processing is complete, the final product is packaged, labelled, and dispatched to distribution centres across the country.' },
        ],
      },
      {
        id: 'tables',
        title: 'Tables',
        icon: '📋',
        note: 'Range and disparity — range from/to, outlier, marked disparity',
        sentences: [
          { text: 'The table compares five countries across four socioeconomic indicators: GDP per capita, life expectancy, literacy rate, and unemployment.' },
          { text: 'Overall, Japan ranks highest in life expectancy and literacy, while Brazil records the lowest figures across most indicators.' },
          { text: 'Norway consistently outperforms all other nations, with its GDP per capita standing at approximately twice the global average.' },
          { text: 'The figures for literacy rate range from a high of 99% in South Korea to a low of 61% in Nigeria.', band: 7 },
          { text: 'There is a marked disparity between developed and developing nations, particularly in the areas of healthcare spending and educational attainment.' },
          { text: 'With the exception of China, all Asian economies surveyed show a comparable level of export activity relative to GDP.' },
          { text: 'Germany presents a striking contrast to its European neighbours, recording both the highest trade surplus and the lowest unemployment rate.' },
          { text: 'Life expectancy in the United States, at 78 years, lags considerably behind that of Japan, which stands at 84 years.' },
          { text: 'The data reveals that countries with higher literacy rates consistently outperform those with lower rates in terms of economic productivity.' },
          { text: 'Australia stands out as a notable outlier, achieving high scores across all four categories despite its relatively small population.', band: 7 },
        ],
      },
      {
        id: 'overviews',
        title: 'Overviews',
        icon: '📝',
        note: 'Overview sentences — it is clear that, underwent transformation',
        sentences: [
          { text: 'Overall, it is clear that renewable energy experienced the most significant growth, while coal consumption declined steadily throughout the period.', band: 7 },
          { text: 'In general, the proportion of spending on healthcare rose considerably, whereas education funding declined over the same timeframe.', band: 7 },
          { text: 'Overall, the area underwent substantial transformation, with industrial land being replaced by residential zones, while the town centre remained largely unchanged.', band: 7 },
          { text: 'In summary, the wealthiest nations consistently recorded the highest figures across all indicators, with the gap between the highest and lowest widening over time.', band: 8 },
          { text: 'Overall, it is evident that the two countries followed markedly different trajectories, with one peaking early while the other rose steadily throughout.', band: 7 },
          { text: 'In general, manufacturing accounted for the dominant share in the earlier period, whereas services had become the largest sector by the end.', band: 7 },
          { text: 'Overall, the process is relatively straightforward, comprising six distinct stages from the initial raw material through to the finished consumer product.', band: 7 },
          { text: 'In summary, younger age groups represented the largest proportion of internet users, while those aged over 65 accounted for the smallest share.', band: 7 },
          { text: 'Overall, there is a clear correlation between levels of urbanisation and economic output, with more developed nations consistently outperforming their counterparts.', band: 8 },
          { text: 'In general, both cities underwent considerable expansion, though the nature of development differed significantly between the northern and southern districts.', band: 7 },
        ],
      },
      {
        id: 'discourse-markers',
        title: 'Discourse Markers',
        icon: '🔗',
        note: 'Cohesion — Furthermore, Nevertheless, By contrast, Moreover',
        sentences: [
          { text: 'Furthermore, the data suggests that investment in renewable energy more than doubled over the course of the decade.', band: 7 },
          { text: 'Nevertheless, it should be noted that these figures represent only a small fraction of total global expenditure.', band: 7 },
          { text: 'In spite of this general upward trend, the figures for Japan remained consistently high throughout the entire period.', band: 7 },
          { text: 'As a consequence, the overall proportion of urban dwellers surpassed that of rural residents for the first time in recorded history.', band: 7 },
          { text: 'In addition to this, the proportion allocated to transport infrastructure increased by approximately 15 percentage points between 2000 and 2020.', band: 7 },
          { text: 'By contrast, the southern region experienced a marked decline, falling from 45% to just 28% over the same period.', band: 7 },
          { text: 'Despite the overall growth trend, there were notable fluctuations during the middle years, particularly between 2008 and 2012.', band: 7 },
          { text: 'Moreover, countries with higher levels of educational attainment consistently demonstrated stronger economic performance across all measured indicators.', band: 8 },
          { text: 'On the other hand, developing nations showed a significantly different pattern, with expenditure on food comprising the largest proportion of household budgets.', band: 7 },
          { text: 'As a result of this rapid urbanisation, green spaces in the town centre were almost entirely replaced by commercial and residential buildings.', band: 7 },
        ],
      },
      {
        id: 'approximation',
        title: 'Approximation',
        icon: '≈',
        note: 'Hedging figures — just under, roughly, well over, in the region of',
        sentences: [
          { text: 'The proportion rose to just under 40%, while the corresponding figure for the previous year stood at roughly 25%.', band: 7 },
          { text: 'At approximately 3.5 million, the figure was slightly more than double that recorded at the start of the period.', band: 7 },
          { text: 'Spending on healthcare accounted for around one-third of the total budget, compared to a mere 8% allocated to education.', band: 7 },
          { text: 'The two figures were broadly comparable, with the UK standing at just over 35% and France recording approximately 33%.', band: 7 },
          { text: 'By 2020, the number had fallen to nearly half its peak value, settling at around 12 million units per year.', band: 7 },
          { text: 'The gap between the highest and lowest categories narrowed considerably, from roughly 30 percentage points to just under 10.', band: 7 },
          { text: 'Coal consumption, at well over 40% in 1990, had declined to a little more than 15% by the end of the period.', band: 7 },
          { text: 'The figures for Germany and Japan were almost identical, both standing at somewhere in the region of 2.8 million.', band: 7 },
          { text: 'In the final year, the proportion had recovered to approximately its 2005 level, hovering at around 22% of the total.', band: 7 },
        ],
      },
    ],
  },
};

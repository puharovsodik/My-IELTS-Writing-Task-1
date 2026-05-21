export type Sentence = {
  text: string
  grammar?: string
}

export type Category = {
  id: string
  name: string
  icon: string
  sentences: Sentence[]
}

export const CATEGORIES: Category[] = [
  {
    id: 'conditionals',
    name: 'Conditionals',
    icon: '⚡',
    sentences: [
      { text: 'Had the government invested more in infrastructure, the transport crisis would have been averted.', grammar: 'Type 3 inverted conditional — "Had" replaces "If...had"; formal academic register' },
      { text: 'Were she to apply for the position, she would undoubtedly be selected.', grammar: 'Type 2 inverted conditional — "Were...to" replaces "If she were to"' },
      { text: 'Should the data prove inconclusive, the researchers would need to conduct further trials.', grammar: 'Inverted "Should" conditional — expresses a realistic future possibility' },
      { text: 'Had it not been for the intervention of international organisations, the conflict might have escalated.', grammar: '"Had it not been for" — Type 3 counterfactual expressing a prevented outcome' },
      { text: 'Were prices to fall significantly, consumer spending would inevitably rise.', grammar: '"Were...to" structure — formal hypothetical future, suitable for academic prose' },
      { text: 'Should the temperature continue to increase, coastal communities would face severe flooding.', grammar: '"Should" inversion — commonly used in policy documents and academic reports' },
      { text: 'Had the authorities acted sooner, the environmental damage could have been minimised.', grammar: 'Type 3 with modal "could have been" — expresses unrealised past possibility' },
      { text: 'Were the company to relocate, hundreds of jobs would be lost.', grammar: '"Were...to" — indicates a hypothetical future scenario with serious consequences' },
      { text: 'Should more funding be allocated to renewable energy, the transition from fossil fuels would accelerate.', grammar: 'Passive + inverted conditional — "should...be allocated" in formal writing' },
      { text: 'Had stricter regulations been in place, the financial collapse might have been prevented.', grammar: 'Type 3 passive — "had...been in place" + modal perfect passive in result clause' },
    ],
  },
  {
    id: 'passive',
    name: 'Passive Voice',
    icon: '🔄',
    sentences: [
      { text: 'The legislation is expected to have been drafted by the end of the financial year.', grammar: 'Complex passive — "is expected to have been" combines present + perfect infinitive passive' },
      { text: 'Significant progress has been made in reducing carbon emissions over the past decade.', grammar: 'Present perfect passive — focuses on result; agent omitted as unimportant' },
      { text: 'The report is believed to have been submitted without the required supporting evidence.', grammar: '"is believed to have been" — reporting verb passive with perfect infinitive' },
      { text: 'Several recommendations were put forward by the committee but were subsequently rejected.', grammar: 'Double passive in one sentence — two passive verbs linked by "but"' },
      { text: 'The data collected over three decades has been used to formulate the new policy.', grammar: 'Reduced relative clause — "data collected" = "data that was collected"; present perfect passive main verb' },
      { text: 'The building is said to have been designed by one of the leading architects of the era.', grammar: '"is said to have been designed" — reporting passive + perfect infinitive passive' },
      { text: 'More than a thousand species are thought to be threatened by habitat destruction each year.', grammar: '"are thought to be" — present passive with simple infinitive' },
      { text: 'The agreement is understood to have been reached after months of difficult negotiations.', grammar: '"is understood to have been reached" — complex passive reporting structure' },
      { text: 'Considerable resources have been devoted to understanding the long-term effects of urbanisation.', grammar: '"have been devoted to" + gerund — present perfect passive with prepositional complement' },
      { text: 'The findings are expected to be published in a peer-reviewed journal later this year.', grammar: '"are expected to be published" — future event expressed via passive reporting verb' },
    ],
  },
  {
    id: 'inversion',
    name: 'Inversion',
    icon: '↩️',
    sentences: [
      { text: 'Not only did the government fail to address the issue, but it also introduced counterproductive measures.', grammar: '"Not only...but also" — auxiliary "did" inverted before subject for emphasis' },
      { text: 'Rarely has such a significant shift in public opinion been observed in so short a time.', grammar: '"Rarely" inversion — present perfect auxiliary "has" placed before subject' },
      { text: 'Under no circumstances should personal data be shared without the explicit consent of the individual.', grammar: '"Under no circumstances" — negative adverbial triggers inversion of "should" before subject' },
      { text: 'No sooner had the legislation been passed than it was challenged in the courts.', grammar: '"No sooner...than" — past perfect inverted after opening negative adverbial' },
      { text: 'Only when the scale of the problem became apparent did officials take decisive action.', grammar: '"Only when" inversion — auxiliary "did" fronted in main clause after adverbial clause' },
      { text: 'Never before has the rate of technological change posed such a profound challenge to society.', grammar: '"Never before" — present perfect inverted for maximum rhetorical emphasis' },
      { text: 'Seldom do economic growth and environmental protection advance simultaneously.', grammar: '"Seldom" inversion — auxiliary "do" fronted with compound subject following' },
      { text: 'Not until the final results were announced did investors regain confidence in the market.', grammar: '"Not until" inversion — emphasis on the delayed moment of change' },
      { text: 'So rapidly has the technology developed that regulators have struggled to keep pace.', grammar: '"So + adverb" inversion — "so rapidly has" triggers subject-auxiliary inversion + result clause' },
      { text: 'Little did the researchers anticipate that their findings would generate such widespread controversy.', grammar: '"Little" inversion — "little did...anticipate" stresses the unexpectedness of the outcome' },
    ],
  },
  {
    id: 'reported',
    name: 'Reported Speech',
    icon: '💬',
    sentences: [
      { text: 'The minister announced that the proposed reforms would be implemented in stages over the following year.', grammar: 'Backshift: "will" → "would"; "next" → "the following" — standard reported speech shifts' },
      { text: 'Scientists warned that unless immediate action was taken, the damage would prove irreversible.', grammar: 'Reported conditional — "is taken" → "was taken"; "will prove" → "would prove"' },
      { text: 'The spokesperson confirmed that the investigation had been ongoing for several months.', grammar: 'Backshift to past perfect — "has been" → "had been" in reported speech' },
      { text: 'Analysts predicted that the economic recovery would take longer than had initially been anticipated.', grammar: 'Embedded past perfect passive in reported prediction — "had...been anticipated"' },
      { text: 'The committee acknowledged that insufficient attention had been paid to the needs of rural communities.', grammar: 'Reported acknowledgement with past perfect passive — formal academic register' },
      { text: 'Critics argued that the policy had been poorly designed and was unlikely to achieve its stated objectives.', grammar: 'Two backshifted clauses — "has been designed" → "had been designed"; "is" → "was"' },
      { text: 'Researchers suggested that the findings should be interpreted with considerable caution.', grammar: '"Should" does not backshift — modal suggestion is retained unchanged in reported speech' },
      { text: 'The report concluded that further investment would be required if the targets were to be met.', grammar: 'Reported conclusion with embedded formal conditional — "were to be met"' },
      { text: 'Officials stated that the negotiations had reached a critical stage and that a breakthrough was imminent.', grammar: 'Two parallel "that" clauses — same reporting verb governs both subordinate clauses' },
      { text: 'Experts cautioned that the technology, while promising, had yet to be tested at scale.', grammar: '"Had yet to be tested" — past perfect passive expressing an unfulfilled requirement' },
    ],
  },
  {
    id: 'cleft',
    name: 'Cleft Sentences',
    icon: '✂️',
    sentences: [
      { text: 'It is the lack of affordable housing that has driven many young people out of the city.', grammar: '"It is...that" cleft — focuses emphasis on "the lack of affordable housing" as the key cause' },
      { text: 'What the data clearly demonstrates is that inequality has widened significantly over the past two decades.', grammar: '"What...is" pseudo-cleft — noun clause subject + "is" + that-clause predicate' },
      { text: 'It was not until the industrial revolution that the pace of urbanisation began to accelerate dramatically.', grammar: '"It was not until...that" cleft — emphasises the turning point in time' },
      { text: 'What the government has failed to recognise is the long-term cost of underinvesting in education.', grammar: '"What...is" pseudo-cleft — moves focus to the government\'s critical oversight' },
      { text: 'It is through international cooperation that the most pressing environmental challenges can be addressed.', grammar: '"It is...that" cleft with prepositional phrase — emphasises the means or method' },
      { text: 'What distinguishes this approach from previous attempts is its emphasis on community-led solutions.', grammar: '"What...is" cleft — subject is a "what" clause; predicate is a noun phrase' },
      { text: 'It is the wealthiest nations that bear the greatest responsibility for reducing carbon emissions.', grammar: '"It is...that" cleft — redirects focus to the agent bearing primary responsibility' },
      { text: 'What the research consistently shows is that early intervention yields the most significant long-term benefits.', grammar: '"What...is that" cleft — links a generalised finding to a specific conclusion' },
      { text: 'It was only after considerable public pressure that the authorities agreed to review the decision.', grammar: '"It was only...that" cleft — "only" adds restrictive emphasis to the triggering condition' },
      { text: 'What makes this period particularly significant is the unprecedented convergence of social and economic disruption.', grammar: '"What...is" cleft — "what makes" clause as subject + noun phrase as predicate' },
    ],
  },
]

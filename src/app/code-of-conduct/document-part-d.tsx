function DisciplineTable({ rows }: { rows: readonly { misconduct: string; action: string }[] }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[28rem] border-collapse text-left text-xs md:text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-primary-50">
            <th className="px-3 py-2 font-semibold text-primary-950 md:px-4">Misconduct</th>
            <th className="px-3 py-2 font-semibold text-primary-950 md:px-4">Disciplinary Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-800">
          {rows.map((row) => (
            <tr key={row.misconduct} className="align-top hover:bg-gray-50/80">
              <td className="px-3 py-2 md:px-4">{row.misconduct}</td>
              <td className="px-3 py-2 md:px-4">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const level1Rows = [
  { misconduct: "Eating or drinking in class", action: "Punishment" },
  { misconduct: "Homework or assignment not done", action: "Punishment and warning" },
  { misconduct: "Late for class", action: "Verbal reprimand/inform the parent telephonically" },
  { misconduct: "Talking in class", action: "Verbal reprimand" },
  { misconduct: "Failing to respond to reasonable instructions", action: "Verbal reprimand" },
  { misconduct: "Lying", action: "Written warning" },
  { misconduct: "Using wrong language in class (not official language)", action: "Detention" },
  { misconduct: "Inappropriate dress code/wrong hairstyle/untidiness)", action: "Written warning, notification and confiscation" },
  { misconduct: "Littering", action: "Punishment" },
] as const

const level2Rows = [
  { misconduct: "Repetition of level 1", action: "Detention and warning letter" },
  { misconduct: "Leaving school or class without permission", action: "Punishment" },
  { misconduct: "Engaging in minor vandalism", action: "Cleaning at break or replace, warning letter" },
  { misconduct: "Interrupting the progress of lesson", action: "Suspension from class" },
  { misconduct: "Using cell phone in the school buildings", action: "Temporary confiscation till term end" },
  { misconduct: "Bunking extra curriculum activities", action: "Punishment" },
] as const

const level3Rows = [
  { misconduct: "Repetition of level 2 misconduct", action: "Formal disciplinary hearing" },
  { misconduct: "Bunking class or school", action: "Phone call to parents and special detention" },
  { misconduct: "Cheating during tests and examinations", action: "Nought and warning letter" },
  { misconduct: "Disrespecting educators", action: "Formal disciplinary hearing" },
  { misconduct: "Intimidating or bullying other learners", action: "Formal disciplinary hearing and suspension" },
  { misconduct: "Possessing weapons of any form or nature", action: "Confiscation, formal hearing and suspension or expulsion" },
  { misconduct: "Late for school", action: "Phone call to parents and detention" },
  { misconduct: "Absent without a letter", action: "Warning and phone call to parents" },
  { misconduct: "Forging documents or signatures", action: "Warning and detention" },
  { misconduct: "Vandalism", action: "Hearing, replacement and punishment" },
  { misconduct: "Gambling", action: "Hearing, suspension and punishment" },
  {
    misconduct: "Smoking on school premises or being in the presence of learners",
    action: "Formal disciplinary hearing and suspension — Professional Counselling",
  },
] as const

const level4Rows = [
  { misconduct: "Repetition of level 3 misconduct", action: "Suspension and formal hearing" },
  { misconduct: "Threatening another with a dangerous weapon", action: "Confiscation, formal hearing, suspension/ expulsion" },
  { misconduct: "Possessing, selling, using or being under the influence of drugs or alcohol", action: "Confiscation, formal hearing, suspension/ expulsion" },
  { misconduct: "Sexual harassment", action: "Formal hearing, suspension/expulsion" },
  { misconduct: "Theft, robbery/major theft", action: "Formal hearing, suspension/expulsion" },
  { misconduct: "Intentionally using dangerous weapons", action: "Confiscation, formal hearing, suspension/ expulsion" },
  { misconduct: "Disrupting the entire school", action: "Formal hearing and suspension" },
  { misconduct: "Engaging in sexual activity with or without consent of others", action: "Formal hearing, suspension/expulsion" },
  { misconduct: "Breaking and entering unauthorised premises", action: "Formal hearing, suspension/expulsion" },
  { misconduct: "Fighting, intentionally injuring another learner", action: "Formal hearing, suspension/expulsion" },
] as const

export function CodeOfConductPartD() {
  return (
    <div className="space-y-8 border-b border-gray-100 pb-10">
      <section id="general-rules" className="scroll-mt-32">
        <h2 className="font-display text-xl font-bold text-primary-950 md:text-2xl">23. General Rules and Regulations</h2>
        <h3 className="mt-4 font-display text-base font-semibold text-gray-900">23.1. The learner shall:</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700 md:text-[15px]">
          <li>Attend school assemblies, and during assembly the learner shall stand in rows according to their register class, quietly.</li>
          <li>After assembly, learners must file according to their classes.</li>
          <li>Keep the classrooms, toilets free of dirt and litter.</li>
        </ul>
        <h3 className="mt-4 font-display text-base font-semibold text-gray-900">23.2. The learner shall not:</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700 md:text-[15px]">
          <li>Eat or drink inside the class unless with the permission from the educator</li>
          <li>Trade on school premises</li>
          <li>Have pornographic material, illegal substances, tobacco and alcohol products or weapons for any use.</li>
          <li>Bring phones at school</li>
          <li>Run, bundle, hug or shout in school premises</li>
          <li>
            Smoke, drink alcohol, gamble when in school premises or while wearing uniform even after school. In
            general, all these are being discouraged.
          </li>
        </ul>
      </section>

      <section id="rights-learner" className="scroll-mt-32">
        <h2 className="font-display text-xl font-bold text-primary-950 md:text-2xl">24. Rights of the learner</h2>
        <p className="mt-2 text-sm font-medium text-gray-900 md:text-[15px]">The learner has a right to:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700 md:text-[15px]">
          <li>Tuition in a safe and disciplined environment</li>
          <li>Security of their possession and person</li>
          <li>Tuition in a clean and healthy environment</li>
          <li>Treated with respect by school community</li>
          <li>Punctual and consistent lessons</li>
        </ul>
      </section>

      <section id="responsibilities-learner" className="scroll-mt-32">
        <h2 className="font-display text-xl font-bold text-primary-950 md:text-2xl">25. Responsibilities of a learner</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 md:text-[15px]">
          <li>Attend classes and other activities on time</li>
          <li>Bring correct stationery as required.</li>
          <li>Show respect to other learners and school staff</li>
          <li>Uphold school security</li>
          <li>Listen to and be tolerant to others and their beliefs</li>
          <li>Ensure that school premises are kept clean and are not defaced or damaged</li>
          <li>To remain smart and presentable throughout each school day</li>
          <li>Take charge of his/her work and complete, homework, tasks and assignments on time</li>
          <li>Ensure that parents receive all official communication i.e. letters and circulars</li>
          <li>Respect other learners’ and staff’s property and belongings</li>
          <li>Take care of their belongings</li>
          <li>Ensure that letters and circulars from the school are sent to parents and be in good condition.</li>
        </ul>
      </section>

      <section id="responsibilities-parents" className="scroll-mt-32">
        <h2 className="font-display text-xl font-bold text-primary-950 md:text-2xl">26. Responsibilities of parents</h2>
        <p className="mt-2 text-sm font-medium text-gray-900 md:text-[15px]">Parents shall ensure that:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700 md:text-[15px]">
          <li>
            The learner attends school every day and is punctual. Parents must not plan casual family activities and
            trips during the school contact time
          </li>
          <li>
            Any absenteeism is reported to the school and valid reasons are provide, also supply the school with
            relevant proof of absenteeism e.g. doctor’s note
          </li>
          <li>The learner follows the school’s rules and regulations and code of conduct</li>
          <li>
            The learner is healthy, clean and neat, be dressed in an appropriate dress code and is in the right frame
            of mind for learning
          </li>
          <li>The learner does not use abusive language or behave in an abusive way</li>
          <li>The school fee is paid in full and within the stipulated dates</li>
          <li>The learner is supplied with basic resources needed for school work and home work and assignments</li>
          <li>
            The school authorities are informed about any problem concerning the learner that may affect other
            children and the staff
          </li>
          <li>The rights of the learner to learn are upheld</li>
          <li>The school is provided with all the documentation requested upon registration</li>
          <li>
            Correct information is provided upon registration of learner and must update the school for any changes
            e.g. change of contact details e.g. cell phone and address
          </li>
          <li>They respect and honour school rules and regulations</li>
          <li>They respect the educators and all school members of staff</li>
          <li>
            They co-operate with the school and attend meetings and/or disciplinary hearings concerning the conduct of
            their children when required to do so.
          </li>
        </ul>
      </section>

      <section id="discipline" className="scroll-mt-32">
        <h2 className="font-display text-xl font-bold text-primary-950 md:text-2xl">27. Discipline and punishment</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
          In an attempt to instil discipline amongst the learners the school shall apply measures.
        </p>

        <h3 className="mt-6 font-display text-lg font-semibold text-gray-900">27.1. Discipline measures</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
          27.1.1. Misconduct of a learner shall be classified according to four levels. Disciplinary action shall suit
          the level of misconduct as follows:
        </p>

        <h4 className="mt-6 text-base font-semibold text-primary-900">Level 1: Personal Conduct</h4>
        <DisciplineTable rows={level1Rows} />

        <h4 className="mt-8 text-base font-semibold text-primary-900">Level 2: Breaking school rules as in code of conduct</h4>
        <DisciplineTable rows={level2Rows} />

        <h4 className="mt-8 text-base font-semibold text-primary-900">Level 3: Serious violation of school rules</h4>
        <DisciplineTable rows={level3Rows} />

        <h4 className="mt-8 text-base font-semibold text-primary-900">Level 4: Very serious violation of school rules</h4>
        <DisciplineTable rows={level4Rows} />

        <div className="mt-6 space-y-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4 text-sm text-gray-800">
          <p>
            <strong>Note:</strong>
          </p>
          <p>
            <strong>Level 2</strong> — Non attendance for detention – written warning and special detention
          </p>
          <p>
            <strong>Level 3</strong> — Smoking – formal disciplinary hearing and suspension – professional
            counselling, confiscation.
          </p>
          <p>
            <strong>Level 4</strong> — Engaging in sexual activities – formal hearing, suspension/expulsion
          </p>
          <p>
            ***If there is any reason to believe or suspect that a learner is under the influence of, or is using
            drugs or alcohol, the school will not allow the learner into the class. The parent will be informed that
            the learner will not be in class.
          </p>
        </div>

        <h3 className="mt-8 font-display text-lg font-semibold text-gray-900">27.2. Suspension</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
          The principal shall suspend a learner for a maximum of five school days. The parents must be informed of
          the suspension in writing.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
          On repetition of level 1 to 3 misconduct, the principal will negotiate a contract to be signed by the
          learner, parent and principal. Any breach of the negotiated contract will result in immediate expulsion.
        </p>

        <h3 className="mt-6 font-display text-lg font-semibold text-gray-900">27.3. Expulsion</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
          All level 4 offences can lead to immediate expulsion. The final decision lies with the principal. If the
          learner is not expelled, the principal will negotiate a contract to be signed by the learner, parent and
          the principal. Any breach of contract will result in immediate expulsion.
        </p>

        <h3 className="mt-6 font-display text-lg font-semibold text-gray-900">27.4. Appeal</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-700 md:text-[15px] md:leading-relaxed">
          All parents are welcome to discuss any situation with the principal or disciplinary committee. All
          agreements will be signed by all parties. Disciplinary issues will be attended to by the principal from
          08.30 to 10.00 and 13.30 to 15.00 on school days.
        </p>
      </section>
    </div>
  )
}

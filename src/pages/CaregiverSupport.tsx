import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Heart, Play, BookOpen, Coffee, Moon, Shield, ChevronDown, ChevronUp, Phone, AlertTriangle, Pen, Save, Calendar, Trash2, Check } from 'lucide-react'
import SafetyFooter from '../components/SafetyFooter'

const API_URL = import.meta.env.VITE_API_URL || ''

function getToken(): string {
  return localStorage.getItem('auth_token') || ''
}

const regulationVideos = [
  {
    title: 'Box Breathing for Caregivers',
    duration: '3 min',
    source: 'Sunnybrook Hospital (Dr. Joanna Mansfield, Women\u2019s Mood & Anxiety Clinic)',
    caption: 'A simple breath pattern to steady yourself in a stressful moment.',
    embedUrl: 'https://www.youtube.com/embed/tEmt1Znux58',
    embedType: 'youtube' as const,
  },
  {
    title: 'Progressive Muscle Relaxation',
    duration: '7 min',
    source: 'Therapist Aid',
    caption: 'Tense and release each muscle group to let go of stored tension. If tensing feels uncomfortable, just breathe slowly instead.',
    embedUrl: 'https://www.youtube.com/embed/1nZEdqcGVzo',
    embedType: 'youtube' as const,
  },
  {
    title: 'Guided Body Scan',
    duration: '15 min',
    source: 'UCLA Health, Simms/Mann Center for Integrative Oncology (Shiori Lange, LCSW)',
    caption: 'Slowly move your attention through your body, noticing without judging. If a sensation feels too intense, return to your breath.',
    embedUrl: 'https://player.vimeo.com/video/1092920047',
    embedType: 'vimeo' as const,
  },
  {
    title: 'Mindful Grounding Exercise',
    duration: '5 min',
    source: 'The Partnership in Education, Duquesne University (NIH-funded)',
    caption: 'The 5-4-3-2-1 method uses your five senses to bring you back to the present moment.',
    embedUrl: 'https://www.youtube.com/embed/30VMIEmA114',
    embedType: 'youtube' as const,
  },
]

const educationArticles = [
  {
    title: 'Understanding Blocked Care',
    duration: '~7 min read',
    subtitle: 'Why you can love your child deeply and still, some days, not feel it \u2014 and what that actually means.',
    sections: [
      { heading: '', body: 'There is a particular kind of guilt that many foster, adoptive, and kinship caregivers carry quietly. It\u2019s the moment you realize you\u2019re going through the motions \u2014 feeding, driving, managing, correcting \u2014 but the warmth underneath has gone flat. You still love this child. You would still do anything for them. But in the moment, you can\u2019t feel the tenderness you know is supposed to be there. And then comes the second wave: What kind of parent feels this way?\n\nIf that describes even a few of your days, you are not a bad caregiver. You may be experiencing something researchers Daniel Hughes and Jonathan Baylin named blocked care in their work on the neuroscience of parenting. Blocked care is what happens when chronic stress temporarily suppresses the brain systems that let us nurture. It is not a character flaw, a lack of love, or a sign you were never meant to do this. It is a stressed caregiving brain shifting into self-protection \u2014 and it is reversible.' },
      { heading: 'What \u201cthe parenting brain\u201d actually does', body: 'Hughes and Baylin describe caregiving as running on several interconnected brain systems working together in the background. One keeps you feeling safe and open enough to move toward your child rather than away. Another makes caring for them feel rewarding \u2014 the small hit of satisfaction when they smile, settle, or reach for you. Others help you read your child\u2019s cues accurately, make generous sense of their behavior, and stay thoughtful instead of reactive when things get hard.\n\nWhen you\u2019re rested, supported, and your child is giving back, these systems hum along and good parenting feels almost automatic. The trouble is that they all run on the same fuel \u2014 and that fuel is a nervous system that feels reasonably safe. When stress climbs and stays high, the brain does something protective and ancient: it dials down the open, nurturing systems and turns up the defensive ones. You become guarded, irritable, and detached, not because you\u2019ve stopped caring, but because your brain has decided you need to protect yourself first.' },
      { heading: 'Why this hits our families especially hard', body: 'Blocked care can happen to any parent. But it\u2019s more common, and often more intense, for those raising children who have experienced trauma \u2014 and here\u2019s the piece that\u2019s rarely said out loud.\n\nThe parenting reward system is designed to be refueled by the child. A baby coos, you feel a wave of warmth, and that warmth replenishes you for the next round of care. But many children who\u2019ve been hurt or moved between homes have learned that closeness isn\u2019t safe. They may push away comfort, reject affection, escalate right when you\u2019re trying to connect, or stay flat and unreachable. None of this is a choice, and it isn\u2019t a rejection of you \u2014 it\u2019s a nervous system that learned early on that closeness wasn\u2019t safe, still doing its best to stay protected. So you pour care in, and very little comes back through the usual channels. Over months and years, the reward loop that\u2019s supposed to refill your tank keeps coming up empty \u2014 and the caregiving systems quietly run down. You are essentially parenting uphill, against a child\u2019s survival wiring, without the biological paycheck most parenting is built to provide.' },
      { heading: 'The different shapes blocked care takes', body: 'It helps to know that blocked care isn\u2019t one thing. Sometimes it\u2019s acute \u2014 a single brutal day, a bad night\u2019s sleep, a crisis that leaves you empty by dinnertime. That kind lifts once you recover. Sometimes it\u2019s chronic, built up slowly over months of unrelenting stress until flatness becomes your baseline. Sometimes it\u2019s child-specific: you feel open and warm with one child and inexplicably shut down with another whose particular behaviors get under your skin. And sometimes it rises from your own history \u2014 when a child\u2019s behavior brushes against something unhealed from your own early life, and your brain reacts to old danger rather than the present moment.\n\nNone of these mean you\u2019re failing. They mean you\u2019re human, and your brain is doing exactly what stressed brains do.' },
      { heading: 'What actually helps', body: 'The first move is the hardest and the most important: name it without shame. Blocked care thrives in secrecy and self-judgment. Simply recognizing \u201cthis is blocked care, not the truth about how I feel about my child\u201d loosens its grip.\n\nFrom there, the work is less about trying harder to feel loving and more about lowering your stress load so the caregiving systems can come back online. That means tending to your own regulation \u2014 sleep, food, movement, moments of genuine rest \u2014 not as a luxury but as the mechanism that restores your capacity to nurture. It means getting your own support: people who co-regulate you, whether that\u2019s a partner, a friend, a peer group of other caregivers, or a therapist who understands trauma parenting. It means looking honestly at your own triggers, because the child-specific and history-based forms of blocked care often ease when you understand what\u2019s really being activated.\n\nAnd it means going looking for the small moments of connection that the reward system has stopped noticing \u2014 the weight of their head against your shoulder, a shared laugh, the fact that they came to you when they were scared. Hughes offers a helpful stance for these moments, summed up as playfulness, acceptance, curiosity, and empathy: a way of staying open and warm toward your child even when their behavior is hard, and even when you have to reach for it on purpose.' },
      { heading: 'The most important thing to remember', body: 'Blocked care is a stress state, not a verdict. The warmth hasn\u2019t been destroyed; it\u2019s been suppressed by a nervous system trying to protect you. When the pressure eases and your own tank begins to refill, those caregiving systems reawaken \u2014 often more quickly than you\u2019d expect. Feeling blocked doesn\u2019t mean you love your child less. It means you\u2019ve been carrying more than any one nervous system was built to carry alone.' },
    ],
    citation: 'The concept of blocked care comes from the work of Daniel A. Hughes and Jonathan Baylin, \u201cBrain-Based Parenting: The Neuroscience of Caregiving for Healthy Attachment.\u201d',
  },
  {
    title: 'Secondary Trauma in Caregivers',
    duration: '~6 min read',
    subtitle: 'You didn\u2019t live through your child\u2019s trauma \u2014 so why does it sometimes feel like you did?',
    sections: [
      { heading: '', body: 'You\u2019ve read the file. You\u2019ve heard the disclosures. You\u2019ve watched a nightmare grip your child at 2 a.m. and held them while they shook. And somewhere along the way, you started noticing changes in yourself: intrusive images you can\u2019t shake, a new jumpiness, trouble sleeping, a heaviness or numbness that wasn\u2019t there before. Maybe you\u2019ve caught yourself scanning every room for danger, or bracing for the next crisis even during a calm moment.\n\nThis isn\u2019t weakness, and it isn\u2019t you being \u201ctoo sensitive.\u201d It has a name: secondary traumatic stress. And understanding it is one of the most protective things a caregiver can do \u2014 for themselves and for their child.' },
      { heading: 'What secondary trauma is', body: 'The trauma researcher Charles Figley described secondary traumatic stress as the stress that comes from helping, or wanting to help, a person who has been traumatized. In plain terms: you can develop trauma symptoms from being close to someone else\u2019s trauma, even though the frightening events never happened to you directly. Your nervous system, steeped day after day in another person\u2019s pain, can begin to carry marks of that pain itself.\n\nWhat makes this so relevant for foster, adoptive, and kinship caregivers is exposure. A therapist sees a child for an hour a week. You live inside the story \u2014 through the disclosures, the trauma-driven behaviors, the medical appointments, the court dates, the details you can never quite un-know. You are one of the most exposed helpers there is, precisely because you\u2019re the one who\u2019s always there.' },
      { heading: 'How it can show up', body: 'Secondary traumatic stress often mirrors the shape of trauma itself. You might notice re-experiencing \u2014 intrusive thoughts about what your child went through, distressing mental images, or bad dreams. You might notice avoidance and numbing \u2014 steering away from reminders, feeling emotionally flat, pulling back from people or activities you used to enjoy. And you might notice heightened arousal \u2014 being on edge, easily startled, irritable, hypervigilant, unable to relax even when things are calm.\n\nSome caregivers also describe a quieter shift in how they see the world \u2014 a new sense that the world is more dangerous, or a loss of some of the hope or trust they used to carry. When that shift runs deep and starts to reshape how you see everything, it can benefit from professional support to work through, not just rest. Others feel a persistent, low-grade guilt, as though nothing they do is ever enough to undo what happened to their child.\n\nReading through that list, you may recognize yourself in several of these. If so, take a breath: seeing yourself here is useful information, not a diagnosis and not a verdict on your fitness as a caregiver. It simply means your system has been carrying a lot, and it\u2019s worth paying attention to.' },
      { heading: 'How it\u2019s different from burnout and \u201cjust being tired\u201d', body: 'These terms get tangled together, and the distinction matters. Burnout is the gradual depletion that comes from operating in a demanding, under-resourced environment for too long \u2014 the sense of being used up, cynical, and running on empty. It builds slowly and lifts with rest, support, and lightened load.\n\nSecondary traumatic stress is different in flavor. It\u2019s not just exhaustion; it carries the specific fingerprints of trauma \u2014 the intrusions, the hypervigilance, the sense of threat. You can be well-rested and still be carrying secondary trauma. The two often travel together, but they\u2019re not the same thing, and secondary trauma sometimes needs more than rest to resolve.' },
      { heading: 'What helps', body: 'The first thing that helps is simply knowing this is real and has a name. So many caregivers silently conclude they\u2019re falling apart or \u201cnot cut out for this,\u201d when what\u2019s actually happening is a predictable response to sustained exposure. Naming it \u2014 this is secondary traumatic stress \u2014 takes some of the fear and shame out of it.\n\nFrom there, the most protective step is finding a place to process what you\u2019re carrying rather than absorbing it alone. That might be a therapist who understands trauma and caregiving, a support group of others doing this work, or trusted people who can hear the hard parts without flinching. Trauma held silently tends to grow; trauma spoken in a safe place tends to loosen.\n\nIt also helps to protect the boundary between your child\u2019s story and your identity \u2014 to remember that being deeply affected doesn\u2019t mean you\u2019ve been damaged beyond repair, and that you\u2019re allowed to have a life, joys, and an inner world that aren\u2019t defined by the worst things that happened to your child. Regulating your nervous system through the ordinary channels \u2014 sleep, movement, breath, connection, moments of genuine rest \u2014 gives your body real recovery time between exposures.' },
      { heading: 'When to reach for more support', body: 'Secondary traumatic stress exists on a spectrum. Some of it eases with awareness, support, and rest. But if the symptoms are intense, lasting more than a few weeks, getting worse, or interfering with your sleep, relationships, work, or ability to function, that\u2019s a signal to bring in a professional \u2014 ideally one who understands trauma. Reaching out is not an admission of failure; it\u2019s exactly what we\u2019d tell your child to do, and you deserve the same care.\n\nAnd if you ever find yourself having thoughts of harming yourself, please reach out right away \u2014 you can call or text 988, the Suicide & Crisis Lifeline, any time, day or night.\n\nCaring this much is not the problem. It\u2019s evidence of exactly the kind of caregiver your child needs. The goal isn\u2019t to feel less \u2014 it\u2019s to make sure you\u2019re carried, too.' },
    ],
    citation: 'This is a sensitive topic. The concept of secondary traumatic stress draws on the work of Charles Figley and colleagues.',
  },
  {
    title: 'The Biology of Caregiver Stress',
    duration: '~7 min read',
    subtitle: 'Why \u201cjust stay calm\u201d is easier said than done \u2014 and what\u2019s actually happening in your body when you can\u2019t.',
    sections: [
      { heading: '', body: 'Picture the moment: your child is escalating \u2014 yelling, throwing, spiraling \u2014 and you can feel it happening in your own body. Your heart speeds up. Your chest tightens. Your thoughts narrow. Somewhere in the back of your mind a calm, wise voice reminds you to breathe and stay regulated, but your body has already left the building. Afterward, you might wonder why you couldn\u2019t just keep it together.\n\nHere\u2019s the reassuring truth: what happened in your body wasn\u2019t a failure of willpower. It was biology doing exactly what it evolved to do. Understanding that biology won\u2019t make caregiving easy, but it will help you stop blaming yourself for being human \u2014 and it will point you toward what actually works.' },
      { heading: 'Your stress response is a feature, not a flaw', body: 'Deep in your brain sits a threat-detection system whose entire job is to keep you alive. When it senses danger \u2014 real or perceived \u2014 it doesn\u2019t ask permission. It floods your body with adrenaline and cortisol, speeds your heart, sharpens your senses, and shunts energy toward your muscles so you can fight, flee, or freeze. This is your sympathetic nervous system, the body\u2019s accelerator, and it\u2019s brilliant at getting you through emergencies.\n\nThe counterpart is your parasympathetic nervous system \u2014 the brakes \u2014 which brings you back down to rest, digest, and connect once the danger passes. In a well-functioning day, you move fluidly between the two: a stressor hits, you rev up, you handle it, you settle back down. The problem for caregivers isn\u2019t that the accelerator works. It\u2019s that parenting a child with trauma can keep a foot pressed on it for hours, days, months at a time.' },
      { heading: 'Two nervous systems in one room', body: 'There\u2019s a second layer that makes caregiving uniquely demanding: co-regulation. Human nervous systems are not sealed off from one another. We are wired to pick up on and sync with the emotional states of the people around us \u2014 especially the people we\u2019re bonded to. This is a gift when you\u2019re calm and your child borrows your steadiness. It\u2019s exhausting when your child is dysregulated and their alarm keeps pulling on yours.\n\nWhen you sit with an escalating child, your body isn\u2019t just reacting to the noise and the risk. It\u2019s resonating with their distress. Their racing nervous system is, in a very real sense, talking to yours. This is why a single hard hour with a dysregulated child can leave you as wrung out as a full day of physical labor. You weren\u2019t just managing a behavior; you were lending your regulation to someone whose own was offline.' },
      { heading: 'When the alarm never fully resets', body: 'Our stress system was designed for bursts \u2014 sprint from the threat, then recover. It was not designed to stay switched on. But caregiving for a child with trauma often means unpredictability, big behaviors, and a constant low hum of vigilance, so the system never gets its full recovery window.\n\nResearchers use the term allostatic load to describe the cumulative wear and tear of a stress response that stays activated too long without enough recovery. Over time, that chronic activation shows up in the body: disrupted sleep, a weakened immune system, headaches and stomach trouble, low mood, difficulty concentrating, and a shorter fuse. It\u2019s not that you\u2019ve become weak or impatient. It\u2019s that a body running on high alert for months is paying a physiological bill.\n\nA word of care here: while these symptoms are common signs of chronic stress, they aren\u2019t only caused by stress. If physical symptoms \u2014 chest pain, ongoing stomach issues, persistent sleep problems, or anything that worries you \u2014 stick around or get worse, get them checked by a doctor rather than assuming it\u2019s \u201cjust stress.\u201d You deserve to have the real cause ruled in or out.\n\nThis is also why \u201cjust think positive\u201d or \u201cjust stay calm\u201d so often fails in the heat of the moment. When your survival system is fully activated, it temporarily downshifts the thinking, reasoning parts of your brain \u2014 the very parts those instructions rely on. You genuinely cannot reason your way to calm from inside a threat state. The body has to lead.' },
      { heading: 'Working with your biology instead of against it', body: 'Because regulation starts in the body, the most effective tools are the ones that speak the body\u2019s language directly \u2014 what\u2019s sometimes called bottom-up regulation. Slow breathing with a longer exhale sends a physical signal of safety to your nervous system. Movement, rhythm, and gentle physical activity help discharge the stress chemistry your body has mobilized. Cool water, a change of scenery, or stepping outside can interrupt an escalating state. These aren\u2019t soft extras; they\u2019re the levers that actually reach the accelerator and brakes.\n\nJust as important is recovery. A nervous system that\u2019s asked to activate repeatedly needs real windows to come back down, or the load keeps accumulating. That means protecting sleep as if it were medicine, building in small pockets of genuine rest, and finding your own sources of co-regulation \u2014 people and moments that steady your system the way you steady your child\u2019s. You are not exempt from the co-regulation you provide; you need it too.\n\nAnd it means offering yourself the same grace you\u2019d offer your child after a hard moment. A body that spikes and struggles to settle isn\u2019t broken. It\u2019s a normal system carrying an abnormal load.' },
      { heading: 'The bottom line', body: 'Taking care of your own physiology is not a detour from caring for your child. It is the mechanism. A regulated caregiver is the single most powerful regulating force in a dysregulated child\u2019s life \u2014 and you can\u2019t lend a calm you don\u2019t have. Tending to your nervous system isn\u2019t selfish. It\u2019s the most direct investment you can make in your child\u2019s healing.' },
    ],
    citation: 'This article draws on widely accepted concepts in stress physiology, including the body\u2019s autonomic stress response and the idea of allostatic load described by researcher Bruce McEwen.',
  },
  {
    title: 'Repair After Caregiver Rupture',
    duration: '~6 min read',
    subtitle: 'You will lose your patience. What you do next matters more than the moment you lost it.',
    sections: [
      { heading: '', body: 'You raised your voice. You said the sharp thing. You slammed the cabinet, or walked away, or met your child\u2019s dysregulation with your own. And now you\u2019re sitting in the aftermath, flooded with guilt, replaying it, certain you\u2019ve undone months of progress or confirmed every fear your child carries about adults.\n\nTake a breath. Not only is this recoverable \u2014 the recovery itself is one of the most powerful things you will ever give your child. To understand why, it helps to know what decades of attachment research have quietly established: connection is not built by getting it right. It\u2019s built by repairing when you get it wrong.' },
      { heading: 'The 70% that no one tells you about', body: 'In the 1970s, developmental psychologist Edward Tronick ran a now-famous study called the Still Face Experiment. A parent and baby interact warmly; then the parent goes blank and unresponsive; the baby works hard to win them back and grows distressed; then the parent re-engages and the baby settles. What the broader body of this research revealed is striking: even healthy, securely attached parent-child pairs are out of sync with each other a majority of the time \u2014 by some estimates around 70% of the time. Misattunement is not the exception. It\u2019s the normal texture of every close relationship.\n\nWhat separated the secure pairs from the struggling ones wasn\u2019t the absence of rupture. It was the presence of repair \u2014 the reliable return to connection after a break. As the pediatrician and psychoanalyst D.W. Winnicott put it, children don\u2019t need a perfect parent. They need a \u201cgood enough\u201d one. The rupture, it turns out, was never the wound. The absence of repair was.' },
      { heading: 'Why repair is medicine for our kids especially', body: 'For a child who came to you from hard places, this is not a minor comfort \u2014 it\u2019s the whole point. Many children who\u2019ve experienced trauma learned early that ruptures don\u2019t get repaired. An adult got angry and stayed gone. Connection broke and never came back. Their internal expectation, written before they could speak, is that disconnection is permanent and relationships can\u2019t survive conflict.\n\nEvery time you rupture and then repair, you are gently rewriting that expectation. You are showing them, in real time, that anger doesn\u2019t end love, that adults come back, that they are still worthy of connection even after a hard moment. You cannot teach this with words alone. You teach it by living it \u2014 which means, paradoxically, that your imperfect moments followed by genuine repair may do more healing than a flawless day ever could.' },
      { heading: 'What repair is \u2014 and what it isn\u2019t', body: 'Repair is not groveling. It\u2019s not endless apologizing, over-explaining, or dissolving the boundary that the moment was about in the first place. A child doesn\u2019t need you to collapse; they need you to reconnect while staying the steady adult. You can absolutely repair the relationship without withdrawing a reasonable limit.\n\nRepair is the simple, sincere act of reaching back across the gap: acknowledging that something happened between you, taking your part in it, and restoring the warmth. That\u2019s it. It can take thirty seconds.' },
      { heading: 'An important boundary: rupture is not the same as harm', body: 'Everything in this article is about ordinary rupture \u2014 the raised voice, the sharp word, the moment your patience ran out. Those moments are human, they\u2019re recoverable, and repair is exactly the right response. But it\u2019s important to be honest about where that ends. Repair is not a fix for a pattern of physical aggression, for rage that frightens your child, or for a home where your child feels genuinely unsafe. If your ruptures are becoming frequent, escalating, or turning physical \u2014 or if you\u2019re scared of your own reactions \u2014 that is not a repair problem, and it\u2019s not a sign you\u2019re beyond help. It\u2019s a sign you need and deserve real support: a therapist, your child\u2019s treatment team, or your caseworker. Reaching out in that situation isn\u2019t failure. It\u2019s the most protective thing a caregiver can do, for your child and for yourself.' },
      { heading: 'How to actually do it', body: 'Start with yourself. You can\u2019t repair from inside a stress state, so the first step is to regulate your own nervous system \u2014 breathe, step away if you need to, let your body come down. Repair attempted while you\u2019re still flooded usually just becomes a second rupture.\n\nReconnect before you explain. Often the most powerful repair is nonverbal at first \u2014 a softened face, a gentle tone, sitting nearby, an offered hand. Safety in the body comes before words.\n\nName it simply and take your part. You don\u2019t need a speech. Something like, \u201cI raised my voice earlier. That was my stress talking, and it wasn\u2019t fair to you. I\u2019m sorry.\u201d Notice that this takes ownership without making your child responsible for your feelings, and without erasing them as a person. Keep it short and honest.\n\nDon\u2019t require a particular response. Your child may not be ready to meet you \u2014 they might shrug, stay guarded, or test whether you really mean it. That\u2019s okay. Repair is something you offer, not something you extract. The offering itself does the work, even if the warmth takes time to return.\n\nLet it be followed by ordinary connection. After repair, you don\u2019t need to keep processing it. Move back into normal life \u2014 a shared task, a snack, a bit of play. The message lands: we\u2019re okay, and we go on.' },
      { heading: 'On timing, and on being human', body: 'Repair is rarely too late. If the moment has passed, you can still come back an hour later, or the next morning, and reconnect. What children internalize is the pattern over time \u2014 that in your home, ruptures reliably get mended.\n\nAnd here\u2019s the freeing part: you don\u2019t have to fear your own imperfection anymore. The occasional lost temper, met with sincere repair, isn\u2019t the thing that harms your child. Withholding repair is. So when you get it wrong \u2014 and you will, because you\u2019re a human being doing one of the hardest jobs there is \u2014 you already know the most important move. You turn back toward them. Every time you do, you\u2019re teaching a child who once had no reason to believe it that love is something that stays.' },
    ],
    citation: 'This article draws on the developmental research of Edward Tronick (the Still Face Experiment) and the concept of \u201cgood enough\u201d parenting from D.W. Winnicott.',
  },
]

const eveningWindDownItems = [
  {
    title: 'Gratitude & Wins Reflection',
    duration: '5 min',
    content: {
      intro: 'Small moments count. You don\u2019t need a good day to find one good thing.',
      prompts: [
        'Name one thing that went right today, however small.',
        'Name one thing you handled better than you would have a year ago.',
        'Name one person or moment you\u2019re grateful for.',
        'Finish this sentence: Today, I showed up by ______.',
      ],
      closing: 'Hard days still have wins. \u201cI kept everyone fed and safe\u201d is enough.',
    },
  },
  {
    title: 'Body Release Sequence',
    duration: '7 min',
    content: {
      intro: 'This guided practice helps your body let go of the day\u2019s tension. Follow along with the video below.',
      note: 'A gentle note before you start: this is an invitation, not a rule. You can keep your eyes open, skip any step, or stop at any time. If tensing your muscles feels uncomfortable, simply breathe slowly instead \u2014 inhale for 4, exhale for 6. The goal is comfort, not doing it perfectly.',
      videoUrl: 'https://www.youtube.com/watch?v=1nZEdqcGVzo',
      videoTitle: 'How to do Progressive Muscle Relaxation \u2014 Therapist Aid, 6:33',
      closing: 'Afterward, take one slow breath and notice any place that feels a little lighter.',
    },
  },
  {
    title: 'Journaling Prompts for Caregivers',
    duration: '10 min',
    content: {
      intro: 'Write freely \u2014 no one else will read this. Pick one prompt or a few.',
      prompts: [
        'What did I carry today that wasn\u2019t mine to carry?',
        'Where did I feel most stretched, and what did I need in that moment?',
        'What did my child teach me today, even in a hard moment?',
        'What am I still holding onto that I could set down before sleep?',
        'If I could tell myself one kind thing right now, what would it be?',
        'What do I want tomorrow to feel like?',
      ],
      closing: 'You don\u2019t have to resolve anything on the page. Getting it out of your head is the point. And if a prompt brings up more than you want to sit with tonight, set it down \u2014 you can come back to it another time.',
    },
  },
  {
    title: 'Sleep Preparation Ritual',
    duration: '5 min',
    content: {
      intro: 'A short, repeatable routine that tells your body the day is done.',
      steps: [
        'Dim the lights and put screens away if you can \u2014 even 30 minutes helps.',
        'Set down tomorrow: jot any lingering to-dos on paper so your mind can release them.',
        'Warm and calm: a warm drink, a shower, or soft socks \u2014 one small comfort.',
        'One slow breath cycle: inhale for 4, exhale for 6, three times.',
        'Close the day: silently tell yourself, I did what I could today. That\u2019s enough.',
      ],
      closing: 'If your mind races once you\u2019re in bed, that\u2019s normal \u2014 return to the slow exhale and let the thoughts drift by. If sleep trouble lasts for weeks or leaves you exhausted during the day, it\u2019s worth checking in with your doctor.',
    },
  },
]

const selfCareItems = [
  {
    title: 'Daily Caregiver Check-In',
    duration: '2 min',
    content: {
      intro: 'A 60-second pulse check. Rate each from 1 (low) to 5 (great).',
      prompts: [
        { label: 'Rest', question: 'How rested do I feel today?' },
        { label: 'Body', question: 'Have I eaten, hydrated, and moved a little?' },
        { label: 'Mood', question: 'What\u2019s my emotional weather right now?' },
        { label: 'Capacity', question: 'How much do I have left in the tank?' },
        { label: 'Connection', question: 'Have I felt supported by anyone today?' },
      ],
      reflection: 'One small thing I can do for myself today:',
      closing: 'If most of your ratings are 1s or 2s, that\u2019s not a failure \u2014 it\u2019s information. Even one small act of care counts. Pick the easiest one and start there.',
    },
  },
  {
    title: 'Weekly Reflection Prompts',
    duration: '10 min',
    content: {
      intro: 'Set aside 5\u201310 minutes. Pick one or two, or answer them all.',
      prompts: [
        'What moment this week felt hardest \u2014 and what got me through it?',
        'When did I feel most like myself?',
        'What did I give more of than I had to give?',
        'Where did I say yes when I wanted to say no?',
        'What\u2019s one thing I\u2019m proud of, even if no one else noticed?',
        'What do I need more of next week? What do I need less of?',
        'Who or what refilled my cup, even a little?',
      ],
      closing: 'You don\u2019t have to fix anything here. Just noticing is enough.\nBefore you close this: name one thing you\u2019ll carry into next week, and one thing you\u2019ll set down.',
    },
  },
  {
    title: 'Compassion Fatigue Check-In',
    duration: '5 min',
    content: {
      intro: 'Compassion fatigue is the cost of caring deeply \u2014 the wear that builds when you absorb another person\u2019s pain day after day. It\u2019s common among caregivers, and it\u2019s not a weakness. This is a moment to check in with yourself, not a test or a diagnosis.',
      scaleIntro: 'Over the past two weeks, how often has each been true? (0 = Never, 1 = Sometimes, 2 = Often, 3 = Almost always)',
      statements: [
        'I feel emotionally drained by the needs of the child I care for.',
        'I have less patience than I used to.',
        'I feel numb, detached, or \u201cchecked out.\u201d',
        'I\u2019m carrying the weight of what this child has been through.',
        'I\u2019m dreading tasks I used to handle easily.',
        'I feel like nothing I do is ever enough.',
        'My sleep is off, or rest doesn\u2019t seem to restore me.',
        'I\u2019ve pulled back from people or activities I used to enjoy.',
      ],
      ranges: [
        { label: 'Lower range', text: 'You\u2019re holding steady. Keep protecting what\u2019s working.' },
        { label: 'Middle range', text: 'Warning signs are showing up. This is a good time to add rest and lean on your support.' },
        { label: 'Higher range', text: 'You\u2019re carrying a lot right now. You deserve support \u2014 reach out to a friend, your doctor, or a counselor this week. You don\u2019t have to do this alone.' },
      ],
      disclaimer: 'This is a self-reflection tool, not clinical care or a diagnosis.',
      resources: 'Want a deeper, validated measure? Foster parents can use the free Professional Quality of Life (ProQOL) measure, designed for people who care for others exposed to trauma. Adoptive and kinship caregivers may prefer the free Caregiver Self-Assessment Questionnaire from the Health in Aging Foundation.',
      crisis: 'If you\u2019re having thoughts of harming yourself, reach out now: call or text 988 (Suicide & Crisis Lifeline, 24/7). You matter.',
    },
  },
  {
    title: 'Burnout Warning Signs',
    duration: 'Reference',
    content: {
      intro: 'Burnout builds slowly. Knowing the signs helps you catch it early. Notice which ones sound familiar.',
      categories: [
        { label: 'In your body', signs: 'Ongoing exhaustion that rest doesn\u2019t fix, headaches or stomach trouble, getting sick more often, changes in sleep or appetite.' },
        { label: 'In your emotions', signs: 'Irritability, feeling overwhelmed, cynicism, hopelessness, crying easily \u2014 or feeling nothing at all.' },
        { label: 'In your thoughts', signs: 'Trouble concentrating, forgetfulness, \u201cI can\u2019t do this anymore,\u201d feeling like a failure no matter what you do.' },
        { label: 'In your behavior', signs: 'Withdrawing from people, snapping at loved ones, letting go of routines or self-care, leaning on food, screens, or substances to cope.' },
      ],
      whenToReach: 'If these signs last more than two weeks, keep getting worse, or you\u2019re having thoughts of hurting yourself, please talk to your doctor, a counselor, or someone you trust. Asking for help is a sign of strength, not weakness.',
      crisis: 'In crisis or thinking about harming yourself? Call or text 988 (Suicide & Crisis Lifeline) anytime, day or night. If someone is in immediate danger, call 911.',
      nextStep: 'One small next step: name one person you could text today, and one thing you can take off your plate this week.',
    },
  },
]

/* ---------- Gratitude Journal types ---------- */

interface MorningEntries {
  grateful1: string
  grateful2: string
  grateful3: string
  grateful4: string
  grateful5: string
  obstacle1: string
  learning1: string
  obstacle2: string
  learning2: string
  obstacle3: string
  learning3: string
}

interface EveningEntries {
  beautiful1: string
  beautiful2: string
  beautiful3: string
  beautiful4: string
  beautiful5: string
  person1: string
  person2: string
  person3: string
  bestPart: string
}

interface SavedEntry {
  id: number
  entry_date: string
  entry_type: 'morning' | 'evening'
  entries: MorningEntries | EveningEntries
  created_at: string
  updated_at: string
}

const emptyMorning: MorningEntries = {
  grateful1: '', grateful2: '', grateful3: '', grateful4: '', grateful5: '',
  obstacle1: '', learning1: '', obstacle2: '', learning2: '', obstacle3: '', learning3: '',
}

const emptyEvening: EveningEntries = {
  beautiful1: '', beautiful2: '', beautiful3: '', beautiful4: '', beautiful5: '',
  person1: '', person2: '', person3: '',
  bestPart: '',
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export default function CaregiverSupport() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [expandedEvening, setExpandedEvening] = useState<string | null>(null)
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null)
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null)
  const [journalTab, setJournalTab] = useState<'morning' | 'evening' | 'past'>('morning')
  const [morning, setMorning] = useState<MorningEntries>({ ...emptyMorning })
  const [evening, setEvening] = useState<EveningEntries>({ ...emptyEvening })
  const [selectedDate, setSelectedDate] = useState(todayStr())
  const [pastEntries, setPastEntries] = useState<SavedEntry[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const [journalOpen, setJournalOpen] = useState(false)
  const [expandedPast, setExpandedPast] = useState<number | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    let cancelled = false
    fetch(`${API_URL}/api/journal/entries?entry_date=${selectedDate}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: SavedEntry[]) => {
        if (cancelled) return
        const m = data.find((e) => e.entry_type === 'morning')
        const ev = data.find((e) => e.entry_type === 'evening')
        setMorning(m ? (m.entries as MorningEntries) : { ...emptyMorning })
        setEvening(ev ? (ev.entries as EveningEntries) : { ...emptyEvening })
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [selectedDate])

  const loadPastEntries = useCallback(async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await fetch(`${API_URL}/api/journal/entries?limit=60`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      setPastEntries(await res.json())
    } catch { /* ignore */ }
  }, [])

  const saveEntry = async (entryType: 'morning' | 'evening') => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      await fetch(`${API_URL}/api/journal/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          entry_date: selectedDate,
          entry_type: entryType,
          entries: entryType === 'morning' ? morning : evening,
        }),
      })
      setSaved(entryType)
      setTimeout(() => setSaved(null), 2000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const deleteEntry = async (id: number) => {
    const token = getToken()
    if (!token) return
    await fetch(`${API_URL}/api/journal/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    loadPastEntries()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-growth-green/5 via-white to-healing-purple/5 flex flex-col">
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/dashboard" className="text-charcoal hover:text-slate-blue">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
            <Heart className="w-5 h-5 text-growth-green" />
            Caregiver Support
          </h1>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading text-charcoal mb-2">
            You matter too
          </h2>
          <p className="text-charcoal-80">
            You cannot pour from an empty cup. Caring for yourself is not selfish; it is essential to caring for your children. Foster and kinship caregiving involves chronic stress, secondary trauma, and emotional labor that most people cannot imagine. When you feel overwhelmed, dysregulated, or close to your limit, that is your nervous system telling you it needs support.
          </p>
        </div>

        <div className="bg-growth-green/10 rounded-xl p-6 mb-8 flex items-start gap-4">
          <Shield className="w-6 h-6 text-growth-green shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-charcoal mb-1">Your Regulation Matters</h3>
            <p className="text-sm text-charcoal-80 leading-relaxed">
              Regulation is contagious. When you co-regulate by staying calm, you help your child's nervous system settle too.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Regulation Videos */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <Play className="w-5 h-5 text-growth-green" />
              Regulation Videos
            </h3>
            <p className="text-sm text-charcoal-80 mb-4">
              Follow along with these guided videos to help calm your nervous system. Each is an invitation &mdash; you can pause, skip, or stop anytime, and keep your eyes open if that feels more comfortable.
            </p>
            <div className="space-y-3">
              {regulationVideos.map((video) => (
                <div key={video.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedVideo(expandedVideo === video.title ? null : video.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-growth-green/10 rounded-lg flex items-center justify-center">
                        <Play className="w-5 h-5 text-growth-green" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{video.title}</h4>
                        <span className="text-xs text-charcoal-70">{video.duration} &middot; {video.source}</span>
                      </div>
                    </div>
                    {expandedVideo === video.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedVideo === video.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-4">
                      <p className="text-sm text-charcoal-80 italic leading-relaxed">{video.caption}</p>
                      <div className="rounded-lg overflow-hidden">
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full aspect-video"
                        />
                      </div>
                      <p className="text-xs text-charcoal-70">Source: {video.source}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Caregiver Education */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-slate-blue" />
              Caregiver Education
            </h3>
            <p className="text-sm text-charcoal-80 mb-2">
              Understanding your own responses helps you show up better for your child.
            </p>
            <p className="text-xs text-charcoal-70 italic mb-4">
              These articles are for education and reflection. They are not medical or mental-health care and are not a diagnosis. If you are struggling, support from a qualified professional can help.
            </p>

            <div className="space-y-3">
              {educationArticles.map((article) => (
                <div key={article.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedArticle(expandedArticle === article.title ? null : article.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-blue/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-slate-blue" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{article.title}</h4>
                        <span className="text-xs text-charcoal-70">{article.duration}</span>
                      </div>
                    </div>
                    {expandedArticle === article.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedArticle === article.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-5">
                      <p className="text-sm text-slate-blue font-medium italic leading-relaxed">{article.subtitle}</p>

                      {article.sections.map((section, idx) => (
                        <div key={idx}>
                          {section.heading && (
                            <h5 className="font-bold text-charcoal mb-2">{section.heading}</h5>
                          )}
                          <p className="text-sm text-charcoal-80 leading-relaxed whitespace-pre-line">{section.body}</p>
                        </div>
                      ))}

                      <div className="bg-slate-blue/5 rounded-lg p-4">
                        <p className="text-xs text-charcoal-70 italic leading-relaxed">{article.citation}</p>
                      </div>

                      <p className="text-xs text-charcoal-70 italic">Caregiver Education is provided by Elhardt Family Wellness / The Healing Home Approach for educational purposes. It is not a substitute for individualized clinical, medical, or mental-health care.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Self-Care Check-In */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <Coffee className="w-5 h-5 text-healing-purple" />
              Self-Care Check-In
            </h3>
            <p className="text-sm text-charcoal-80 mb-2">
              Regular check-ins help you recognize when your own cup is running low.
            </p>
            <p className="text-sm text-charcoal-80 mb-2 leading-relaxed">
              Caring for a child who has been through hard things asks a lot of you &mdash; often more than anyone sees. These check-ins take a minute or two. They&apos;re not a test, and there are no wrong answers. The goal is simple: notice how you&apos;re really doing, so you can respond to your own needs the way you show up for everyone else&apos;s.
            </p>
            <p className="text-xs text-charcoal-70 italic mb-4">
              These tools are for reflection and self-awareness. They are not medical or mental-health care and are not a diagnosis. If you&apos;re struggling, talking with a professional can help.
            </p>

            <div className="space-y-3">
              {selfCareItems.map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedItem(expandedItem === item.title ? null : item.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-healing-purple/10 rounded-lg flex items-center justify-center">
                        <Coffee className="w-5 h-5 text-healing-purple" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{item.title}</h4>
                        <span className="text-xs text-charcoal-70">{item.duration}</span>
                      </div>
                    </div>
                    {expandedItem === item.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedItem === item.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-4">
                      <p className="text-sm text-charcoal-80 leading-relaxed">{item.content.intro}</p>

                      {/* Daily Check-In: rated prompts */}
                      {'prompts' in item.content && Array.isArray(item.content.prompts) && typeof item.content.prompts[0] === 'object' && 'label' in (item.content.prompts[0] as Record<string, unknown>) && (
                        <div className="space-y-3">
                          {(item.content.prompts as Array<{label: string; question: string}>).map((p) => (
                            <div key={p.label} className="bg-healing-purple/5 rounded-lg p-4 flex items-start gap-3">
                              <span className="font-bold text-healing-purple text-sm min-w-[80px]">{p.label}:</span>
                              <span className="text-sm text-charcoal-80">{p.question}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Weekly Reflection: string prompts */}
                      {'prompts' in item.content && Array.isArray(item.content.prompts) && typeof item.content.prompts[0] === 'string' && (
                        <ul className="space-y-2">
                          {(item.content.prompts as string[]).map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-80">
                              <span className="text-healing-purple mt-0.5">&#8226;</span>
                              <span className="leading-relaxed">{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {'reflection' in item.content && (
                        <div className="bg-sky-blue-bg rounded-lg p-4">
                          <p className="text-sm font-medium text-charcoal italic">{(item.content as Record<string, unknown>).reflection as string}</p>
                        </div>
                      )}

                      {/* Compassion Fatigue: scale + statements */}
                      {'scaleIntro' in item.content && (
                        <>
                          <p className="text-sm text-charcoal-80 font-medium">{(item.content as Record<string, unknown>).scaleIntro as string}</p>
                          <div className="space-y-2">
                            {((item.content as Record<string, unknown>).statements as string[]).map((s, idx) => (
                              <div key={idx} className="bg-gray-50 rounded-lg p-3 flex items-start gap-3">
                                <span className="w-6 h-6 bg-healing-purple/10 text-healing-purple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</span>
                                <span className="text-sm text-charcoal-80">{s}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-charcoal-80 font-medium">Add up your answers &mdash; but hold the number loosely. It&apos;s a nudge, not a verdict.</p>
                          <div className="space-y-3">
                            {((item.content as Record<string, unknown>).ranges as Array<{label: string; text: string}>).map((r) => (
                              <div key={r.label} className={`rounded-lg p-4 ${
                                r.label === 'Lower range' ? 'bg-growth-green/10 border border-growth-green/20' :
                                r.label === 'Middle range' ? 'bg-amber-50 border border-amber-200' :
                                'bg-red-50 border border-red-200'
                              }`}>
                                <p className="text-sm"><strong className="text-charcoal">{r.label}:</strong> <span className="text-charcoal-80">{r.text}</span></p>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-charcoal-70 italic">{(item.content as Record<string, unknown>).disclaimer as string}</p>
                          <p className="text-sm text-charcoal-80 leading-relaxed">{(item.content as Record<string, unknown>).resources as string}</p>
                        </>
                      )}

                      {/* Burnout Warning Signs: categories */}
                      {'categories' in item.content && (
                        <>
                          <div className="space-y-3">
                            {((item.content as Record<string, unknown>).categories as Array<{label: string; signs: string}>).map((cat) => (
                              <div key={cat.label} className="bg-gray-50 rounded-lg p-4">
                                <h5 className="font-bold text-charcoal text-sm mb-1">{cat.label}:</h5>
                                <p className="text-sm text-charcoal-80 leading-relaxed">{cat.signs}</p>
                              </div>
                            ))}
                          </div>
                          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                            <h5 className="font-bold text-charcoal text-sm mb-1 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              When to reach out for help:
                            </h5>
                            <p className="text-sm text-charcoal-80 leading-relaxed">{(item.content as Record<string, unknown>).whenToReach as string}</p>
                          </div>
                          <p className="text-sm text-charcoal-80 italic leading-relaxed">{(item.content as Record<string, unknown>).nextStep as string}</p>
                        </>
                      )}

                      {/* Crisis line (appears on compassion fatigue and burnout) */}
                      {'crisis' in item.content && (
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-800 leading-relaxed">{(item.content as Record<string, unknown>).crisis as string}</p>
                          </div>
                        </div>
                      )}

                      {'closing' in item.content && (
                        <div className="bg-healing-purple/5 rounded-lg p-4">
                          <p className="text-sm text-charcoal-80 leading-relaxed whitespace-pre-line">{(item.content as Record<string, unknown>).closing as string}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Evening Wind-Down ---------- */}
          <div>
            <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2 mb-2">
              <Moon className="w-5 h-5 text-sky-blue" />
              Evening Wind-Down
            </h3>
            <p className="text-sm text-charcoal-80 mb-2">
              End your day with intentional practices that support nervous system recovery.
            </p>
            <p className="text-sm text-charcoal-80 mb-4 leading-relaxed">
              After a full day of caring for others, your body and mind need a signal that it&apos;s safe to rest. These practices are invitations, not requirements &mdash; do the ones that help tonight and skip the rest. There&apos;s no wrong way to wind down.
            </p>

            <div className="space-y-3">
              {eveningWindDownItems.map((item) => (
                <div key={item.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setExpandedEvening(expandedEvening === item.title ? null : item.title)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-blue/10 rounded-lg flex items-center justify-center">
                        <Moon className="w-5 h-5 text-sky-blue" />
                      </div>
                      <div>
                        <h4 className="font-bold text-charcoal">{item.title}</h4>
                        <span className="text-xs text-charcoal-70">{item.duration}</span>
                      </div>
                    </div>
                    {expandedEvening === item.title
                      ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                      : <ChevronDown className="w-5 h-5 text-charcoal-70" />
                    }
                  </button>

                  {expandedEvening === item.title && (
                    <div className="border-t border-gray-100 px-5 pb-5 pt-3 space-y-4">
                      <p className="text-sm text-charcoal-80 leading-relaxed">{item.content.intro}</p>

                      {/* Prompts list */}
                      {'prompts' in item.content && (
                        <ul className="space-y-2">
                          {(item.content.prompts as string[]).map((prompt, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-charcoal-80">
                              <span className="text-sky-blue mt-0.5">&#8226;</span>
                              <span className="leading-relaxed">{prompt}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Video embed (Body Release) */}
                      {'videoUrl' in item.content && (
                        <>
                          <p className="text-sm text-charcoal-80 italic leading-relaxed">{(item.content as Record<string, unknown>).note as string}</p>
                          <div className="rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${((item.content as Record<string, unknown>).videoUrl as string).split('v=')[1]}`}
                              title={(item.content as Record<string, unknown>).videoTitle as string}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full aspect-video"
                            />
                          </div>
                          <p className="text-xs text-charcoal-70 italic">{(item.content as Record<string, unknown>).videoTitle as string}</p>
                        </>
                      )}

                      {/* Steps list (Sleep Preparation) */}
                      {'steps' in item.content && (
                        <ol className="space-y-2">
                          {((item.content as Record<string, unknown>).steps as string[]).map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-charcoal-80">
                              <span className="w-6 h-6 bg-sky-blue/10 text-sky-blue rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">{idx + 1}</span>
                              <span className="leading-relaxed">{step}</span>
                            </li>
                          ))}
                        </ol>
                      )}

                      {'closing' in item.content && (
                        <div className="bg-sky-blue/5 rounded-lg p-4">
                          <p className="text-sm text-charcoal-80 leading-relaxed">{(item.content as Record<string, unknown>).closing as string}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Daily Gratitude Journal ---------- */}
          <div>
            <button
              onClick={() => setJournalOpen(!journalOpen)}
              className="w-full flex items-center justify-between mb-2"
            >
              <h3 className="text-xl font-bold font-heading text-charcoal flex items-center gap-2">
                <Pen className="w-5 h-5 text-amber-500" />
                Daily Gratitude Journal
              </h3>
              {journalOpen
                ? <ChevronUp className="w-5 h-5 text-charcoal-70" />
                : <ChevronDown className="w-5 h-5 text-charcoal-70" />
              }
            </button>
            <p className="text-sm text-charcoal-80 mb-4">
              Gratitude rewires your brain toward hope. Save your entries and revisit them whenever you need a reminder of the good.
            </p>

            {journalOpen && (
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
                {/* Date picker */}
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-charcoal-70" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                  />
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  {(['morning', 'evening', 'past'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => { setJournalTab(tab); if (tab === 'past') loadPastEntries() }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        journalTab === tab
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-charcoal-70 hover:bg-gray-200'
                      }`}
                    >
                      {tab === 'morning' ? 'Morning Gratitude' : tab === 'evening' ? 'Evening Gratitude' : 'Past Entries'}
                    </button>
                  ))}
                </div>

                {/* Morning form */}
                {journalTab === 'morning' && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">Morning Gratitude</h4>
                      <p className="text-sm text-charcoal-80 mb-3">Before you begin your day, list 5 things you&apos;re grateful for.</p>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                          <input
                            type="text"
                            value={morning[`grateful${n}` as keyof MorningEntries]}
                            onChange={(e) => setMorning({ ...morning, [`grateful${n}`]: e.target.value })}
                            placeholder={`I'm grateful for...`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal mb-1">What I&apos;m Learning from My Challenges</h4>
                      <p className="text-sm text-charcoal-80 mb-3">List three obstacles and what you&apos;re learning from them.</p>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="mb-3 bg-amber-50 rounded-lg p-3">
                          <input
                            type="text"
                            value={morning[`obstacle${n}` as keyof MorningEntries]}
                            onChange={(e) => setMorning({ ...morning, [`obstacle${n}`]: e.target.value })}
                            placeholder={`Obstacle ${n}...`}
                            className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none bg-white"
                          />
                          <input
                            type="text"
                            value={morning[`learning${n}` as keyof MorningEntries]}
                            onChange={(e) => setMorning({ ...morning, [`learning${n}`]: e.target.value })}
                            placeholder="What I'm learning..."
                            className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none bg-white"
                          />
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => saveEntry('morning')}
                      disabled={saving}
                      className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-600 transition-colors disabled:opacity-50"
                    >
                      {saved === 'morning' ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Morning Entry</>}
                    </button>
                  </div>
                )}

                {/* Evening form */}
                {journalTab === 'evening' && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-charcoal mb-1">Beautiful Things I Saw Today</h4>
                      <p className="text-sm text-charcoal-80 mb-3">List 5 beautiful things you noticed today.</p>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-sky-blue-bg text-slate-blue rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                          <input
                            type="text"
                            value={evening[`beautiful${n}` as keyof EveningEntries]}
                            onChange={(e) => setEvening({ ...evening, [`beautiful${n}`]: e.target.value })}
                            placeholder={`Beautiful thing ${n}...`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal mb-1">People I&apos;m Grateful For</h4>
                      <p className="text-sm text-charcoal-80 mb-3">List 3 people who made your life a little happier today. These could be friends, family or strangers!</p>
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">{n}</span>
                          <input
                            type="text"
                            value={evening[`person${n}` as keyof EveningEntries]}
                            onChange={(e) => setEvening({ ...evening, [`person${n}`]: e.target.value })}
                            placeholder={`Person ${n}...`}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-bold text-charcoal mb-1">The Best Part of My Day</h4>
                      <p className="text-sm text-charcoal-80 mb-3">Choose one moment of your day that made you happy and focus on it for 5 minutes before bed.</p>
                      <textarea
                        value={evening.bestPart}
                        onChange={(e) => setEvening({ ...evening, bestPart: e.target.value })}
                        placeholder="The best part of my day was..."
                        rows={3}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none"
                      />
                    </div>

                    <button
                      onClick={() => saveEntry('evening')}
                      disabled={saving}
                      className="flex items-center gap-2 bg-slate-blue text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-blue-dark transition-colors disabled:opacity-50"
                    >
                      {saved === 'evening' ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Evening Entry</>}
                    </button>
                  </div>
                )}

                {/* Past entries */}
                {journalTab === 'past' && (
                  <div className="space-y-3">
                    {pastEntries.length === 0 && (
                      <p className="text-sm text-charcoal-70 text-center py-4">No journal entries yet. Start writing today!</p>
                    )}
                    {/* Group by date */}
                    {Array.from(new Set(pastEntries.map((e) => e.entry_date))).map((dateStr) => {
                      const dayEntries = pastEntries.filter((e) => e.entry_date === dateStr)
                      return (
                        <div key={dateStr} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                          <button
                            onClick={() => setExpandedPast(expandedPast === dayEntries[0].id ? null : dayEntries[0].id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-amber-500" />
                              <span className="font-bold text-charcoal text-sm">
                                {new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="text-xs text-charcoal-70">
                                ({dayEntries.map((e) => e.entry_type).join(' & ')})
                              </span>
                            </div>
                            {expandedPast === dayEntries[0].id
                              ? <ChevronUp className="w-4 h-4 text-charcoal-70" />
                              : <ChevronDown className="w-4 h-4 text-charcoal-70" />
                            }
                          </button>

                          {expandedPast === dayEntries[0].id && (
                            <div className="border-t border-gray-200 p-4 space-y-4">
                              {dayEntries.map((entry) => (
                                <div key={entry.id}>
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-bold text-charcoal text-sm capitalize">
                                      {entry.entry_type === 'morning' ? 'Morning Gratitude' : 'Evening Gratitude'}
                                    </h5>
                                    <button
                                      onClick={() => deleteEntry(entry.id)}
                                      className="text-red-400 hover:text-red-600 transition-colors"
                                      title="Delete entry"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>

                                  {entry.entry_type === 'morning' && (() => {
                                    const m = entry.entries as MorningEntries
                                    return (
                                      <div className="space-y-2 text-sm text-charcoal-80">
                                        <p className="font-medium text-charcoal">Grateful for:</p>
                                        {[1, 2, 3, 4, 5].map((n) => {
                                          const val = m[`grateful${n}` as keyof MorningEntries]
                                          return val ? <p key={n} className="pl-4">&#8226; {val}</p> : null
                                        })}
                                        {(m.obstacle1 || m.obstacle2 || m.obstacle3) && (
                                          <>
                                            <p className="font-medium text-charcoal mt-2">Challenges & Learnings:</p>
                                            {[1, 2, 3].map((n) => {
                                              const ob = m[`obstacle${n}` as keyof MorningEntries]
                                              const le = m[`learning${n}` as keyof MorningEntries]
                                              return (ob || le) ? (
                                                <div key={n} className="pl-4">
                                                  {ob && <p>Obstacle: {ob}</p>}
                                                  {le && <p className="italic">Learning: {le}</p>}
                                                </div>
                                              ) : null
                                            })}
                                          </>
                                        )}
                                      </div>
                                    )
                                  })()}

                                  {entry.entry_type === 'evening' && (() => {
                                    const ev = entry.entries as EveningEntries
                                    return (
                                      <div className="space-y-2 text-sm text-charcoal-80">
                                        {(ev.beautiful1 || ev.beautiful2 || ev.beautiful3 || ev.beautiful4 || ev.beautiful5) && (
                                          <>
                                            <p className="font-medium text-charcoal">Beautiful things:</p>
                                            {[1, 2, 3, 4, 5].map((n) => {
                                              const val = ev[`beautiful${n}` as keyof EveningEntries]
                                              return val ? <p key={n} className="pl-4">&#8226; {val}</p> : null
                                            })}
                                          </>
                                        )}
                                        {(ev.person1 || ev.person2 || ev.person3) && (
                                          <>
                                            <p className="font-medium text-charcoal">People I&apos;m grateful for:</p>
                                            {[1, 2, 3].map((n) => {
                                              const val = ev[`person${n}` as keyof EveningEntries]
                                              return val ? <p key={n} className="pl-4">&#8226; {val}</p> : null
                                            })}
                                          </>
                                        )}
                                        {ev.bestPart && (
                                          <>
                                            <p className="font-medium text-charcoal mt-2">Best part of the day:</p>
                                            <p className="pl-4 whitespace-pre-wrap">{ev.bestPart}</p>
                                          </>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <SafetyFooter />
    </div>
  )
}

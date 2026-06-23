"""Seed the database with hardcoded content from React components.

This ensures all content is editable from the Admin Dashboard.
Only seeds tables that are empty — won't overwrite user edits.
"""

from .database import get_db


def seed_all_content() -> None:
    """Seed all content tables if they are empty."""
    _seed_scripts()
    _seed_articles()
    _seed_kids_tools()
    _seed_crisis_steps()
    _seed_try_again_steps()


def _table_is_empty(table: str) -> bool:
    with get_db() as conn:
        row = conn.execute(f"SELECT COUNT(*) as cnt FROM {table}").fetchone()
        return row["cnt"] == 0


def _seed_scripts() -> None:
    """Seed the 8 original parent scripts from ScriptsLibrary.tsx."""
    if not _table_is_empty("scripts"):
        return

    scripts = [
        {
            "title": 'When a Child Says "I Hate You"',
            "content": '"I hear you. You\'re feeling really big feelings right now, and that\'s okay. I\'m not going anywhere. When you\'re ready, I\'m right here."',
            "category": "De-escalation",
            "age_group": "All Ages",
            "situation": "When children lash out verbally, they are often testing whether the relationship can survive their biggest feelings. This is attachment behavior, not rejection.\n\nTip: Do not take it personally. Do not mirror the intensity. Your calm, steady presence is the response.",
            "sort_order": 1,
            "active": 1,
        },
        {
            "title": "Before a Difficult Transition",
            "content": '"In five minutes, we\'re going to be done with this and start something new. I know transitions can feel hard. I\'ll be right there with you when it\'s time."',
            "category": "Transitions",
            "age_group": "All Ages",
            "situation": "Children with trauma histories often struggle with transitions because change signals unpredictability. Advance notice and co-regulation reduce the threat response.\n\nTip: Give time warnings: 5 minutes, 2 minutes, 1 minute. Predictability is safety.",
            "sort_order": 2,
            "active": 1,
        },
        {
            "title": "After a Meltdown (Repair)",
            "content": '"That was really hard. For both of us. But we got through it together. I\'m still here, and I still love you. Would you like to talk about what happened, or do you need more time?"',
            "category": "Repair",
            "age_group": "All Ages",
            "situation": "Repair after rupture is one of the most powerful attachment experiences. It teaches children that relationships survive hard moments.\n\nTip: Wait until the child is fully regulated before initiating repair. Regulation before reason.",
            "sort_order": 3,
            "active": 1,
        },
        {
            "title": "Setting a Boundary with Warmth",
            "content": '"I love you AND hitting is not okay. I\'m going to help keep everyone safe. Let\'s find another way to show how angry you are."',
            "category": "Boundaries",
            "age_group": "School Age (6-11)",
            "situation": "Boundaries and warmth are not opposites. Children need both. The \"and\" construction validates the feeling while holding the limit.\n\nTip: Children need both compassion and accountability. Use AND instead of BUT.",
            "sort_order": 4,
            "active": 1,
        },
        {
            "title": "Bedtime Resistance",
            "content": '"I know bedtime can feel hard. Your body needs rest so it can grow strong. I\'m going to stay close. You are safe here. Nothing bad is going to happen while you sleep."',
            "category": "Bedtime",
            "age_group": "Preschool (3-5)",
            "situation": "For children with trauma, bedtime can trigger fear of abandonment, hypervigilance, or memories of unsafe nighttime experiences.\n\nTip: Consistent bedtime routines build predictability. Name the safety explicitly.",
            "sort_order": 5,
            "active": 1,
        },
        {
            "title": "When a Child Lies",
            "content": '"I think what really happened might be different from what you told me. It\'s okay. I\'m not going to be angry. I just want to understand. You\'re safe to tell me the truth."',
            "category": "Connection",
            "age_group": "School Age (6-11)",
            "situation": "Lying in trauma-affected children is often a survival strategy, not a character flaw. They learned that truth could be dangerous.\n\nTip: Create safety for truth-telling. Punishing honesty guarantees more lying.",
            "sort_order": 6,
            "active": 1,
        },
        {
            "title": "First Day of School",
            "content": '"Today might feel a little scary, and that makes total sense. New things are hard. I will be here when you get back. You can do hard things, and I believe in you."',
            "category": "School",
            "age_group": "All Ages",
            "situation": "School transitions activate separation anxiety and fear of the unknown. Naming the fear and affirming the return reduces the threat.\n\nTip: Consider giving the child a small object (a stone, a keychain) to carry as a reminder of connection.",
            "sort_order": 7,
            "active": 1,
        },
        {
            "title": "When a Child Won't Eat",
            "content": '"Your body, your choice about eating. The food is here whenever you\'re ready. There will always be enough food in this home."',
            "category": "Connection",
            "age_group": "Toddler (1-3)",
            "situation": "Food refusal in children from hard places is often about control, trust, or sensory sensitivities. Power struggles around food reinforce scarcity fears.\n\nTip: For children who experienced food insecurity, having access to a snack basket can reduce hoarding and refusal behaviors.",
            "sort_order": 8,
            "active": 1,
        },
    ]

    with get_db() as conn:
        for s in scripts:
            conn.execute(
                """INSERT INTO scripts (title, content, category, age_group, situation, sort_order, active)
                   VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (s["title"], s["content"], s["category"], s["age_group"], s["situation"], s["sort_order"], s["active"]),
            )
        conn.commit()


def _seed_articles() -> None:
    """Seed the 8 articles from LearningLibrary.tsx grouped by topic category."""
    if not _table_is_empty("articles"):
        return

    articles = [
        {
            "title": "What is Developmental Trauma?",
            "summary": "Developmental trauma occurs when a child experiences chronic, repeated adverse experiences during critical periods of brain development. Unlike single-incident trauma, it reshapes the very architecture of the developing brain.",
            "content": "• Trauma impacts brain development, not just behavior\n• The stress response system becomes overactive\n• Behaviors that look \"defiant\" are often survival responses\n• Healing is possible through safe, repeated relational experiences",
            "category": "Understanding Trauma",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 1,
            "active": 1,
        },
        {
            "title": "The ACE Study and What It Means",
            "summary": "The Adverse Childhood Experiences study revealed a direct, dose-response relationship between childhood adversity and long-term health outcomes. Understanding ACEs helps caregivers contextualize behaviors and advocate for appropriate support.",
            "content": "• Higher ACE scores correlate with increased health and behavioral challenges\n• Protective factors (like a stable caregiver) buffer the impact of ACEs\n• ACE scores do not define a child's future\n• Knowing a child's history informs, but should not limit, expectations",
            "category": "Understanding Trauma",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 2,
            "active": 1,
        },
        {
            "title": "Attachment Styles in Children from Hard Places",
            "summary": "Children who have experienced disrupted early relationships often develop insecure or disorganized attachment patterns. Understanding these patterns is the first step toward building new relational templates.",
            "content": "• Secure attachment is earned through consistent, responsive caregiving\n• Insecure patterns are adaptations, not deficits\n• Disorganized attachment reflects the impossibility of the child's early environment\n• New attachment patterns can develop at any age",
            "category": "Attachment Theory",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 3,
            "active": 1,
        },
        {
            "title": "Building Attachment: Practical Strategies",
            "summary": "Attachment is not built through grand gestures. It is built through thousands of small, repeated moments of attunement, repair, and co-regulation.",
            "content": "• Follow the child's lead in play and interaction\n• Narrate your own emotional states\n• Practice repair quickly and consistently after rupture\n• Create predictable rhythms and rituals",
            "category": "Attachment Theory",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 4,
            "active": 1,
        },
        {
            "title": "The Brain in Crisis: What Happens During a Meltdown",
            "summary": "When a child's amygdala fires, the prefrontal cortex goes offline. The child literally cannot think, reason, or learn. Understanding this neurobiology changes how we respond.",
            "content": "• The amygdala activates within milliseconds of perceived threat\n• Cortisol floods the body, preparing for fight, flight, or freeze\n• Reasoning and learning are impossible in this state\n• Co-regulation (your calm) is the bridge back to safety",
            "category": "Regulation and the Nervous System",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 5,
            "active": 1,
        },
        {
            "title": "Co-Regulation: Your Calm Is the Intervention",
            "summary": "Children borrow regulation from regulated adults. Before a child can learn to self-regulate, they must first experience being regulated by someone else. This is the foundation of all behavior change.",
            "content": "• Your nervous system speaks to theirs\n• Calm body, soft voice, slow movements\n• Regulation before reason, always\n• Self-regulation develops from repeated experiences of co-regulation",
            "category": "Regulation and the Nervous System",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 6,
            "active": 1,
        },
        {
            "title": "Behavior Is Communication",
            "summary": "Every behavior serves a function. When children act in ways that puzzle or frustrate adults, they are expressing fear, confusion, or unmet need through the only language their nervous system has access to.",
            "content": '• Ask "What is this behavior telling me?" not "How do I stop this?"\n• The behavior is the symptom, not the problem\n• Punishing the behavior without addressing the need guarantees it will return\n• Understanding the function unlocks the intervention',
            "category": "Understanding Behavior",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 7,
            "active": 1,
        },
        {
            "title": "Identity-Informed Parenting\u2122",
            "summary": "Trauma impacts behavior, but it does not define identity. Identity-Informed Parenting separates the child's actions from their core self, reinforcing who they are becoming rather than labeling what they have done.",
            "content": "• Mistakes are not identity\n• Name the behavior, not the child\n• \"You made a hurtful choice\" vs. \"You are a bad kid\"\n• Belonging is rooted in inherent value",
            "category": "Understanding Behavior",
            "age_group": "All Ages",
            "author": "The Healing Home Approach",
            "sort_order": 8,
            "active": 1,
        },
    ]

    with get_db() as conn:
        for a in articles:
            conn.execute(
                """INSERT INTO articles (title, content, summary, category, age_group, author, sort_order, active)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (a["title"], a["content"], a["summary"], a["category"], a["age_group"], a["author"], a["sort_order"], a["active"]),
            )
        conn.commit()


def _seed_kids_tools() -> None:
    """Seed the 6 kids regulation tools from KidsRegulationTools.tsx into first_aid_cards."""
    with get_db() as conn:
        count = conn.execute(
            "SELECT COUNT(*) as cnt FROM first_aid_cards WHERE category = 'Kids Tool'"
        ).fetchone()["cnt"]
        if count > 0:
            return

    tools = [
        {
            "title": "Belly Breathing for Kids",
            "content": "A fun, guided breathing exercise that helps children calm their nervous system.\n\nHow to do it: Have the child place a stuffed animal on their belly and watch it rise and fall with each breath. In through the nose for 4 counts, out through the mouth for 6 counts.",
            "age_group": "Ages 3-8",
            "category": "Kids Tool",
            "sort_order": 1,
            "active": 1,
        },
        {
            "title": "The Feelings Check-In",
            "content": "Help children identify and name what they are feeling using simple emotion vocabulary.\n\nHow to do it: Use a feelings chart or wheel. Ask: \"Point to the face that matches how you feel inside right now.\" Validate whatever they choose.",
            "age_group": "Ages 4-10",
            "category": "Kids Tool",
            "sort_order": 2,
            "active": 1,
        },
        {
            "title": "Body Scan for Kids",
            "content": "A gentle guided scan that helps children notice where they hold tension and practice relaxation.\n\nHow to do it: Starting at the toes, ask the child to squeeze and release each body part. \"Squeeze your toes tight... now let them go soft like jelly.\" Work up to the head.",
            "age_group": "Ages 5-12",
            "category": "Kids Tool",
            "sort_order": 3,
            "active": 1,
        },
        {
            "title": "The Safe Place Visualization",
            "content": "Guide children through imagining their safest, most calming place. Builds an internal resource for self-regulation.\n\nHow to do it: \"Close your eyes and imagine the safest, calmest place you can think of. What do you see? What do you hear? What does it feel like?\"",
            "age_group": "Ages 5-12",
            "category": "Kids Tool",
            "sort_order": 4,
            "active": 1,
        },
        {
            "title": "Shake It Off",
            "content": "A movement-based regulation tool that helps children release stored physical tension through playful shaking.\n\nHow to do it: \"Let's shake our hands... now our arms... now our whole body! Shake shake shake! Now freeze. Feel how still and calm your body is now.\"",
            "age_group": "Ages 3-10",
            "category": "Kids Tool",
            "sort_order": 5,
            "active": 1,
        },
        {
            "title": "The Calm Down Jar",
            "content": "Watch the glitter settle and breathe. A visual metaphor for how big feelings settle with time.\n\nHow to do it: Fill a jar with water, glitter glue, and fine glitter. Shake it up and say: \"See how the glitter is swirling? That's like your feelings right now. Let's breathe and watch them settle.\"",
            "age_group": "Ages 3-8",
            "category": "Kids Tool",
            "sort_order": 6,
            "active": 1,
        },
    ]

    with get_db() as conn:
        for t in tools:
            conn.execute(
                """INSERT INTO first_aid_cards (title, content, age_group, category, sort_order, active)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (t["title"], t["content"], t["age_group"], t["category"], t["sort_order"], t["active"]),
            )
        conn.commit()


def _seed_crisis_steps() -> None:
    """Seed the 7 de-escalation steps from CrisisMode.tsx into page_content."""
    with get_db() as conn:
        count = conn.execute(
            "SELECT COUNT(*) as cnt FROM page_content WHERE page = 'crisis_steps'"
        ).fetchone()["cnt"]
        if count > 0:
            return

    steps = [
        {
            "title": "Pause and Breathe",
            "instruction": "Before you do anything else, take three slow, deep breaths. You cannot regulate a child from a dysregulated state. Your calm is the intervention.",
            "tip": "Place one hand on your chest. Feel your own heartbeat slow. This is where healing starts.",
        },
        {
            "title": "Assess Safety",
            "instruction": "Is anyone in immediate physical danger? If yes, ensure safety first. Remove dangerous objects, create physical distance if needed, and call for help if the situation requires it.",
            "tip": "Safety is non-negotiable. Everything else can wait until everyone is physically safe.",
        },
        {
            "title": "Get Low and Soft",
            "instruction": "Lower your body to the child's level or below. Soften your face, your voice, and your posture. You are communicating safety with your entire body.",
            "tip": "Children read body language before words. A tall, tense adult feels like a threat to a scared child.",
        },
        {
            "title": "Name What You See",
            "instruction": "Use simple, non-judgmental language: \"I can see you're having a really hard time right now.\" Do not ask why. Do not lecture. Just name what is visible.",
            "tip": "Naming the emotion without judgment tells the child: I see you. I'm not scared of your feelings.",
        },
        {
            "title": "Offer Connection",
            "instruction": "Ask: \"Can I sit with you?\" or \"Would a hug help?\" Accept their answer. If they say no, stay nearby. Your presence is the regulation tool.",
            "tip": "Some children need space before they can accept connection. That's okay. Stay close enough to be found.",
        },
        {
            "title": "Wait for the Wave to Pass",
            "instruction": "A meltdown is a wave. It will crest and fall. Your job is to be the shore. Stay calm, stay present, stay quiet if needed. The teaching moment comes later.",
            "tip": "Regulation before reason. Connection before correction. There is no learning in the storm.",
        },
        {
            "title": "Repair and Reconnect",
            "instruction": "When calm returns, gently reconnect. \"That was really hard. I'm glad we got through it together.\" Then, when ready, reflect gently on what happened.",
            "tip": "Repair teaches children that relationships survive hard moments. This is attachment in action.",
        },
    ]

    with get_db() as conn:
        for i, step in enumerate(steps, 1):
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                (f"crisis_steps", f"step_{i}_title", step["title"], "text", i * 10),
            )
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                (f"crisis_steps", f"step_{i}_instruction", step["instruction"], "textarea", i * 10 + 1),
            )
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                (f"crisis_steps", f"step_{i}_tip", step["tip"], "textarea", i * 10 + 2),
            )
        conn.commit()


def _seed_try_again_steps() -> None:
    """Seed the 7 try-again steps from TryAgainTool.tsx into page_content."""
    with get_db() as conn:
        count = conn.execute(
            "SELECT COUNT(*) as cnt FROM page_content WHERE page = 'try_again_steps'"
        ).fetchone()["cnt"]
        if count > 0:
            return

    steps = [
        {
            "title": "Take a Breath",
            "instruction": "Let's start by taking three deep breaths together. In through your nose... out through your mouth. You're safe.",
            "prompt": "Can you feel your body getting a little calmer?",
            "affirmation": "Great job noticing how your body feels.",
        },
        {
            "title": "Name What Happened",
            "instruction": "Something happened that didn't go the way we wanted. That's okay. Everyone makes mistakes. Let's think about what happened.",
            "prompt": "Can you tell me (or think about) what happened?",
            "affirmation": "Thank you for being honest. That takes courage.",
        },
        {
            "title": "Check Your Body",
            "instruction": "When big feelings come, our bodies feel them too. Maybe tight fists, a fast heart, a hot face, or a tummy ache.",
            "prompt": "Where do you feel it in your body right now?",
            "affirmation": "Your body is giving you important information. Listening to it is a strength.",
        },
        {
            "title": "Name the Feeling",
            "instruction": "Feelings are not good or bad. They are information. Angry, sad, scared, frustrated, embarrassed, confused: all of these are real and valid.",
            "prompt": "What feeling was biggest for you?",
            "affirmation": "All feelings are welcome here. You are more than your hardest moment.",
        },
        {
            "title": "Think About What You Needed",
            "instruction": "Behind every big behavior is an unmet need. Maybe you needed space, help, fairness, connection, or to feel safe.",
            "prompt": "What did you really need in that moment?",
            "affirmation": "Knowing what you need is a powerful skill. You're learning it.",
        },
        {
            "title": "Try Again",
            "instruction": "Now that you know what happened, what you felt, and what you needed, let's think about what you could do differently next time.",
            "prompt": "What's one thing you could try next time?",
            "affirmation": "That's a great plan. Trying again is what brave people do.",
        },
        {
            "title": "Remember Who You Are",
            "instruction": "Mistakes do not define you. You are kind, capable, and growing. This moment does not erase everything good about you.",
            "prompt": "Can you tell me one thing you like about yourself?",
            "affirmation": "You are loved. You are enough. You are more than this moment.",
        },
    ]

    with get_db() as conn:
        for i, step in enumerate(steps, 1):
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                ("try_again_steps", f"step_{i}_title", step["title"], "text", i * 10),
            )
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                ("try_again_steps", f"step_{i}_instruction", step["instruction"], "textarea", i * 10 + 1),
            )
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                ("try_again_steps", f"step_{i}_prompt", step["prompt"], "text", i * 10 + 2),
            )
            conn.execute(
                """INSERT INTO page_content (page, section, content, content_type, sort_order)
                   VALUES (?, ?, ?, ?, ?)""",
                ("try_again_steps", f"step_{i}_affirmation", step["affirmation"], "text", i * 10 + 3),
            )
        conn.commit()

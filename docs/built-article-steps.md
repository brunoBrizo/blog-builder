## Article Generation Pipeline — 7 API Calls

Your cron job should execute these calls sequentially. Each call feeds into the next.

## Call 1: Topic Research & Keyword Discovery

Purpose: Find a trending topic with low-competition long-tail keywords.

Model: sonar-pro  
search_recency_filter: "week"  
web_search_options: { search_context_size: "high" }  
temperature: 0.7  
max_tokens: 2000

System: "You are an SEO keyword researcher for an AI and technology blog.  
Return results as structured JSON."

User: "Find 3 trending AI/tech topics from the past week that have  
high search interest but low competition. For each topic, suggest:  
\- A primary long-tail keyword (5-8 words)  
\- 3 secondary keywords  
\- Search intent (informational/commercial/transactional)  
\- A compelling blog post title optimized for CTR  
Target an international English-speaking audience."

Output: You get a topic \+ keywords. Pick the best one (or automate picking the first).

## Call 2: Competitor Analysis & Content Gap

Purpose: Analyze what's already ranking and find gaps you can fill.

Model: sonar-pro  
web_search_options: { search_context_size: "high" }  
search_recency_filter: "month"  
temperature: 0.3  
max_tokens: 2000

System: "You are an SEO content strategist. Analyze search results  
thoroughly and identify content gaps."

User: "Search for: \[PRIMARY KEYWORD FROM CALL 1\].  
Analyze the top-ranking articles and tell me:  
1\. What key points do ALL top articles cover?  
2\. What are they MISSING that would add unique value?  
3\. What questions do people ask about this topic that aren't well answered?  
4\. What angle or data would make my article the best result?  
Return a structured content brief."

Output: A content gap analysis that makes your article different from everyone else's.

## Call 3: Generate Article Outline

Purpose: Create a detailed, SEO-structured outline before writing.

Model: sonar-pro  
disable_search: true ← no web search needed here, saves cost  
temperature: 0.5  
max_tokens: 1500

System: "You are an expert technical blog writer and SEO specialist."

User: "Using this research, create a detailed article outline:

Title: \[TITLE FROM CALL 1\]  
Primary keyword: \[KEYWORD\]  
Secondary keywords: \[KEYWORDS\]  
Content gaps to fill: \[FROM CALL 2\]  
Unique angle: \[FROM CALL 2\]

Structure the outline with:  
\- H1 title (with primary keyword)  
\- Meta description (under 155 chars, with primary keyword)  
\- 5-8 H2 sections with H3 subsections  
\- Where to naturally place each keyword (mark them)  
\- A FAQ section at the end (for FAQ schema)  
\- Suggested word count per section (total target: 2000-2500 words)  
\- Internal link placeholders: \[INTERNAL LINK: related topic\]"

Output: A complete blueprint for the article.

## Call 4: Write the Full Article

Purpose: Generate the actual article content, section by section.

Model: sonar-pro  
web_search_options: { search_context_size: "high" }  
search_recency_filter: "month"  
temperature: 0.6  
max_tokens: 8000

System: "You are a senior tech writer with 10 years of experience.  
Write like a real person, not like an AI.

STRICT RULES:  
\- Use 'is', 'are', 'has' instead of 'serves as', 'stands as',  
 'boasts', 'features'  
\- Never use: delve, landscape, tapestry, testament, pivotal,  
 crucial, foster, underscore, showcase, vibrant, groundbreaking,  
 nestled, breathtaking, renowned  
\- Never use em dashes (—). Use commas or periods instead  
\- Never use 'It's not just X, it's Y' constructions  
\- Never group things in threes for rhetorical effect  
\- Never start with 'In today's rapidly evolving...'  
\- Never end with 'The future looks bright' or generic conclusions  
\- No emojis. No excessive bold. No inline-header lists  
\- Vary sentence length. Mix short and long.  
\- Have opinions. Say 'I think' when appropriate.  
\- Use specific data and numbers, not 'experts believe'  
\- Use straight quotes, not curly quotes  
\- Don't announce what you're about to do ('Let's dive in',  
 'Here's what you need to know'). Just do it.  
\- Don't hedge excessively. Say 'may' not 'could potentially possibly'  
\- Use sentence case for headings, not Title Case

Write in first person when it adds authenticity. Acknowledge when  
something is uncertain rather than pretending everything is settled."

User: "Write a complete blog article following this outline exactly:

\[FULL OUTLINE FROM CALL 3\]

Requirements:  
\- 2000-2500 words total  
\- Include real, current data and statistics (search the web for them)  
\- Use the primary keyword naturally 4-6 times throughout  
\- Use each secondary keyword at least once  
\- Write a compelling intro that hooks the reader in 2 sentences  
\- End each major section with a practical takeaway  
\- Write the FAQ section with 4-5 questions and concise answers  
\- Format with proper Markdown: \#\# for H2, \#\#\# for H3, \*\*bold\*\*  
 for key terms, bullet lists where appropriate  
\- Include \[Source: title\](url) citations inline for any data claims"

Output: The full article in Markdown with citations.

## Call 5 (NEW): Humanize the Article

Model: sonar-pro  
disable_search: true  
temperature: 0.7 ← slightly higher for personality  
max_tokens: 10000

System: "\[FULL SKILL.md CONTENT\]

AUTHOR VOICE PROFILE:  
You are writing as the author of this blog. Here is the author's  
voice and personality:

\- Name: \[Your name or pen name\]  
\- Background: Full-stack developer building SaaS products. Based  
 in Brazil. Bilingual (Portuguese/Spanish/English). Works with  
 NestJS, React, TypeScript daily.  
\- Tone: Direct, practical, slightly informal. Like a senior dev  
 explaining something to a colleague over coffee. Not academic,  
 not corporate.  
\- Opinions: Not afraid to say when something is overhyped or when  
 a tool actually sucks. Prefers honest takes over diplomatic ones.  
\- Perspective: Sees tech from a builder's perspective, not a  
 journalist's. Cares about 'can I ship this?' more than 'is this  
 theoretically interesting?'  
\- Speech patterns: Uses short sentences when making a point.  
 Occasionally asks rhetorical questions. Says 'honestly' and  
 'look' when being direct. Comfortable saying 'I don't know' or  
 'I haven't tried this yet.'  
\- Never says: 'game-changer', 'exciting times', 'stay tuned',  
 'without further ado', 'in this article we will explore'  
\- Cultural context: Understands building tech products from Latin  
 America, dealing with USD/BRL conversion, working with  
 international APIs from a non-US timezone."

User: "Do two things to this article:

1\. HUMANIZE: Remove all AI writing patterns using the patterns in  
your instructions. Full process: rewrite, self-audit, final clean  
version.

2\. ADD AUTHOR'S TAKE: At the end of the article, before the FAQ  
section, add a section called '\#\# My take' (or a variation that  
fits the article naturally). This section should be 150-250 words  
where the author gives their honest, personal opinion on the  
topic. Rules for this section:  
 \- Write in first person as the author described above  
 \- Include at least one specific personal experience or  
 observation ('I've been using X for 3 months and...' or  
 'When I built Y, I noticed...')  
 \- Include one honest criticism or caveat, not just praise  
 \- End with a practical recommendation, not a vague conclusion  
 \- This section should feel like the most human part of the  
 entire article — opinionated, specific, slightly raw

3\. Also sprinkle the author's voice throughout the article where  
natural. Add 2-3 first-person observations in the body (not just  
the opinion section). Things like 'I tested this and...' or  
'In my experience...' placed where they add credibility.

Return only the final clean version in Markdown. Preserve all  
\[Source: title\](url) citations and code snippets exactly."

\[FULL ARTICLE FROM CALL 4\]

## Call 6: Generate SEO Metadata & Schema

Purpose: Create all the metadata needed for on-page SEO.

Model: sonar-pro  
disable_search: true  
temperature: 0.3  
max_tokens: 1000

System: "You are an SEO metadata specialist. Return valid JSON only."

User: "Generate complete SEO metadata for this article:

Title: \[TITLE\]  
Primary keyword: \[KEYWORD\]  
Article content summary: \[FIRST 500 WORDS OF CALL 4\]

Return JSON with:  
{  
 'meta_title': '(max 60 chars, keyword near start)',  
 'meta_description': '(max 155 chars, keyword \+ call to action)',  
 'slug': '(url-friendly, keyword-based)',  
 'focus_keyword': '',  
 'secondary_keywords': \[\],  
 'og_title': '(for social sharing, can be slightly different)',  
 'og_description': '(for social sharing)',  
 'faq_schema': \[{'question': '', 'answer': ''}\],  
 'article_schema': {  
 'headline': '',  
 'description': '',  
 'keywords': '',  
 'wordCount': 0  
 },  
 'suggested_internal_links': \['topic1', 'topic2'\],  
 'suggested_categories': \['category1'\]  
}"

Output: All metadata ready to inject into your blog's HTML head and structured data.

## Call 7: Translate to Portuguese

Model: sonar-pro  
disable_search: true ← translation doesn't need web search  
temperature: 0.3  
max_tokens: 10000

System: "You are a professional translator specializing in technology  
content. Translate to Brazilian Portuguese (pt-BR). Maintain all  
Markdown formatting, code snippets, and link structures exactly as  
they are. Adapt cultural references for a Brazilian audience.  
Keep technical terms in English when that's the common usage in  
Brazil (e.g., 'machine learning', 'framework', 'deploy').  
Translate the meta_title, meta_description, and slug as well."

User: "Translate this article and its metadata to Brazilian Portuguese:

\[FULL ARTICLE FROM CALL 4\]  
\[METADATA FROM CALL 5\]"

## Call 8: Translate to Spanish

Model: sonar-pro  
disable_search: true  
temperature: 0.3  
max_tokens: 10000

System: "You are a professional translator specializing in technology  
content. Translate to neutral Latin American Spanish (es-419).  
Maintain all Markdown formatting, code snippets, and link structures  
exactly as they are. Keep technical terms in English when that's  
common usage in Latin America. Translate meta_title,  
meta_description, and slug as well."

User: "Translate this article and its metadata to Spanish:

\[FULL ARTICLE FROM CALL 4\]  
\[METADATA FROM CALL 5\]"

## Key API Parameter Cheatsheet

Based on Perplexity's official API docs

| Parameter                  | When to Use                          | Your Values                                                     |
| :------------------------- | :----------------------------------- | :-------------------------------------------------------------- |
| `temperature`              | Higher \= creative, Lower \= factual | 0.3 for metadata/translation, 0.5–0.7 for writing               |
| `max_tokens`               | Cap output length                    | 8000 for article, 1000–2000 for others                          |
| `search_context_size`      | How much web context to pull         | `"high"` for research, not needed for translation               |
| `search_recency_filter`    | Freshness of sources                 | `"week"` for trending, `"month"` for article writing            |
| `disable_search`           | Skip web search to save cost         | `true` for outline, metadata, translations                      |
| `search_domain_filter`     | Control sources                      | Exclude `["-pinterest.com", "-reddit.com"]` for cleaner sources |
| `return_related_questions` | Get follow-up question ideas         | `true` on Call 1 for FAQ inspiration                            |

## Pro Tips

- Call 3 (outline) is the most important call. A bad outline produces a bad article. Invest your prompt engineering time here.
- Use disable_search: true on calls 3, 5, 6, 7 — they don't need web results and it saves \~$0.005–$0.014 per request.
- Don't tweak top_p and temperature together — Perplexity's API works best with minimal parameter overrides. Keep it simple.
- Store the citations from Call 4's search_results response field. Use those as real source links in your article — this is how you get legitimate citations without asking the model to hallucinate URLs.
- Perplexity's docs confirm: never ask for URLs in your prompt. They come automatically in the citations and search_results fields of the response.

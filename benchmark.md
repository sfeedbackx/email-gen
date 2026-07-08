# Model Benchmark — Response Quality & Performance

Comparing **qwen2.5**, **mistral**, and **llama3.1** on 4 email-reply prompts each (12 responses total).

## Summary by Model

| Model | Responses | Avg Words | Min / Max Words | Avg Chars | Avg Duration (ms) | Min / Max Duration (ms) | Avg Speed (words/sec) |
|---|---|---|---|---|---|---|---|
| qwen2.5 | 4 | 38.8 | 21 / 60 | 258.0 | 10,316 | 3,249 / 20,999 | 5.03 |
| mistral | 4 | 59.5 | 42 / 82 | 370.8 | 13,473 | 6,564 / 19,936 | 5.07 |
| llama3.1 | 4 | 67.5 | 54 / 74 | 407.2 | 15,287 | 7,277 / 30,038 | 5.48 |

**Takeaways:**
- **qwen2.5** is the fastest overall and produces the shortest, most concise replies.
- **llama3.1** produces the longest replies and is the slowest on average, but has the highest raw word-generation speed (words/sec) once it gets going.
- **mistral** sits in the middle on both length and latency.

## Per-Response Detail

| Model | Contact | Scenario | Words | Chars | Duration (ms) | Speed (w/s) |
|---|---|---|---|---|---|---|
| qwen2.5 | Sarah Mansour | no-messages | 29 | 198 | 20,999 | 1.38 |
| qwen2.5 | Karim Belhadj | one-exchange | 45 | 323 | 7,939 | 5.67 |
| qwen2.5 | Emma Johnson | no-messages | 21 | 115 | 3,249 | 6.46 |
| qwen2.5 | Mohamed Trabelsi | three-exchanges | 60 | 396 | 9,079 | 6.61 |
| mistral | Sarah Mansour | no-messages | 42 | 254 | 19,936 | 2.11 |
| mistral | Karim Belhadj | one-exchange | 67 | 418 | 11,432 | 5.86 |
| mistral | Emma Johnson | no-messages | 47 | 274 | 6,564 | 7.16 |
| mistral | Mohamed Trabelsi | three-exchanges | 82 | 537 | 15,960 | 5.14 |
| llama3.1 | Sarah Mansour | no-messages | 74 | 462 | 30,038 | 2.46 |
| llama3.1 | Karim Belhadj | one-exchange | 71 | 424 | 10,742 | 6.61 |
| llama3.1 | Emma Johnson | no-messages | 54 | 291 | 7,277 | 7.42 |
| llama3.1 | Mohamed Trabelsi | three-exchanges | 71 | 452 | 13,094 | 5.42 |

## Notes on Methodology

- **Words**: counted by splitting response text on whitespace (includes signature line "Ahmed Benali").
- **Chars**: raw character count of the generated content (may differ slightly from the `messageLength` field in the source data, which appears to include leading whitespace in some `mistral` entries).
- **Duration (ms)**: time taken by the model to generate the full response, as recorded in `durationMs`.
- **Speed (words/sec)**: words ÷ (duration in seconds) — a simple throughput estimate; first-response latency (e.g. cold start) can skew this for short prompts.

## Slowest / Fastest Single Responses

- **Slowest overall:** llama3.1 → Sarah Mansour (30.0s for 74 words)
- **Fastest overall:** qwen2.5 → Emma Johnson (3.2s for 21 words)
- **Best throughput:** llama3.1 → Emma Johnson (7.42 words/sec)

# Computer Atlas — Content Roadmap

> **Status (2026-06-08):** Rings 1 and 2 are both **complete**. The Atlas has **205 topics** (all `status: reviewed`) and **16 learning paths**, 100% connected (`npm run audit:importance` reports `core=91 important=114`, `npm run audit:orphans` reports 100% connected, `lint:content` clean).
>
> - **Ring 1 (Core):** 93/93 ✅
> - **Ring 2 (Important):** 114/114 written and reviewed ✅
> - **Ring 3 (Supplemental):** 0 / ~74 — **this is now the active ring.** See the per-category Supplemental lists below.
>
> The "Ring 2 plan" section below is retained as a record of how Ring 2 was executed.

---

## Ring 2 plan

**Goal:** every topic with `importance: important` in this roadmap exists in `src/content/topics/` with full prose and `status: reviewed`. The first half (creating the files with full drafts) is largely done; the remaining work is (a) writing the 66 missing Important topics and (b) promoting the 47 written drafts to `reviewed`.

### Pre-flight check (done before Ring 2 batches started)

- **`secondaryCategories`?** Still not added. The cross-listed topics (`virtual-memory`, `tls`, `gpu`, plus newer multi-fit ones like `memory-hierarchy`, `interrupt`, `system-call`, `cache-coherence`) are still handled cleanly via `related`/`partOf`. No pain yet — keep deferring until `related` starts feeling abusive.
- **Pagefind index size**: re-measure at ~200 topics (we're at 139). Pagefind ships chunks lazily, so the user-visible cost stays low. **No action needed before ~300 topics.**
- **A-Z index scale**: `/topics/` still renders fine. At ~250 items, consider per-letter sub-pages or always-on filter.
- **CI runtime**: `npm run check && npm run build && npm run lint:content` still completes in well under a minute.

### Remaining Ring 2 work (66 topics) — one category at a time, learner demand first

Work a single category to completion, run the audit gate, then move on. **Started categories (stragglers) first** — they slot into dense, well-linked neighborhoods:

1. Operating Systems — **done:** system-call, context-switch, interrupt, paging, mutex, deadlock. **left:** inode, daemon, shell.
2. Programming Languages — **done:** python, javascript-language, c, rust, go, parsing. **left:** java, syntax-vs-semantics, memory-management.
3. Networks — **done:** osi-model, https, websocket, rest-api, cdn. **left:** gateway, firewall, nat.
4. Databases — **done:** nosql, key-value-store, query-plan, orm. **left:** document-store, etl, data-warehouse, schema-migration.
5. Software Engineering — **done:** unit-test, integration-test, refactoring, technical-debt, agile. **left:** monorepo, semantic-versioning, feature-flag.
6. Computer Architecture — **done:** risc-vs-cisc, cache-coherence, memory-hierarchy. **left:** branch-prediction, out-of-order-execution, simd, dma.
7. Security — **done:** oauth, xss, sql-injection, threat-model, csrf. **left:** vulnerability, zero-trust.
8. Distributed Systems — **done:** cap-theorem, kubernetes, message-queue, eventual-consistency, serverless. **left:** service-mesh, cloud-provider.
9. AI — **done:** gradient-descent, embedding, reinforcement-learning, computer-vision. **left:** natural-language-processing, convolutional-neural-network, attention-mechanism.
10. Foundations — **done:** hexadecimal, hash-table, tree, linked-list, stack-and-queue. **left:** abstraction, complexity-theory, computability, graph-theory, discrete-mathematics, formal-language, automata.

**Then the zero-progress "cleanup" categories** (no Ring 2 topics written yet):

11. Hardware — motherboard, clock, peripheral, ssd, hdd, flash-memory, dram-vs-sram.
12. Operations — observability, slo-sli-sla, blue-green-deployment, canary-deployment, downtime, runbook.
13. History — grace-hopper, dennis-ritchie, eniac, unix-history, free-software-movement, ethics-in-computing.
14. Graphics — ray-tracing, shader, jpeg, png, video-codec.
15. HCI — design-system, usability-test, keyboard-shortcut, touch-interface.
16. Applications — native-vs-web, iot, scientific-computing, spreadsheet.

**Plus a review pass** on the 47 written-but-`draft` Important topics (already-written prose; promote the solid ones to `reviewed`).

### Definition of done for Ring 2

- `audit-importance` reports `important: N / N` for every category.
- `find-orphans` stays ≤ 5 (or ≥ 95%).
- `lint-content` clean.
- Build + Pagefind under 5 s end-to-end.
- Every shipped category has at least one learning path that touches its Important set. (16 paths exist as of 2026-06-08; audit coverage as the remaining Important topics land, and add paths for any category still uncovered.)
- Hub pages still scale (re-measure A-Z page render and Pagefind index size at ~200 topics).

### When to start Ring 3

Once Ring 2 has been 80%+ for at least 30 days. Niche / historical / specialised topics shouldn't be written while widely-used Important topics are still missing.

---

The durable source of truth for what to write next. Each category lists Core (Ring 1), Important (Ring 2), and Supplemental (Ring 3) topics with a hand-assigned `priority` score:

```
priority  =  importance (core=3, important=2, supplemental=1)
           + search demand (high=2, med=1, low=0)
           + graph gap (+1 if it would close ≥3 dangling "Required by" gaps)
```

When you sit down to write, pick the highest-priority unticked item in the highest-priority unfinished ring of the current focus category. Confirm `npm run audit:importance` shows the category status improving after the batch.

Cross-listing convention: a topic appears in exactly one category's filesystem folder but can be referenced in another category's Core list when learners reach for it through that lens. The Ring N audit looks for the slug regardless of folder.

---

## Foundations

### Core (Ring 1)
- [x] bits                          priority: 5   (core+high)
- [x] binary-numbers                priority: 5   (core+high)
- [x] boolean-logic                 priority: 5   (core+high)
- [x] algorithms                    priority: 6   (core+high+gap)
- [x] data-structure                priority: 6   (core+high+gap)
- [x] big-o                         priority: 6   (core+high+gap)
- [x] recursion                     priority: 5   (core+high)

### Important (Ring 2)
- [x] hexadecimal                   priority: 4
- [ ] abstraction                   priority: 4
- [ ] complexity-theory             priority: 4
- [ ] computability                 priority: 3
- [ ] graph-theory                  priority: 3
- [ ] discrete-mathematics          priority: 3
- [ ] formal-language               priority: 3
- [ ] automata                      priority: 3
- [x] hash-table                    priority: 4
- [x] tree                          priority: 4
- [x] linked-list                   priority: 3
- [x] stack-and-queue               priority: 3

### Supplemental (Ring 3)
- [ ] lambda-calculus
- [ ] turing-completeness
- [ ] np-completeness
- [ ] type-theory
- [ ] category-theory

---

## Hardware

### Core (Ring 1)
- [x] logic-gates                   priority: 5
- [x] cpu                           priority: 6   (core+high+gap)
- [x] memory                        priority: 6   (core+high+gap)
- [x] storage                       priority: 5
- [x] transistor                    priority: 4
- [x] gpu                           priority: 5   (core+high; cross-listed in Graphics)
- [x] bus                           priority: 3

### Important (Ring 2)
- [ ] motherboard                   priority: 3
- [ ] clock                         priority: 3
- [ ] peripheral                    priority: 2
- [ ] ssd                           priority: 3
- [ ] hdd                           priority: 2
- [ ] flash-memory                  priority: 2
- [ ] dram-vs-sram                  priority: 2

### Supplemental (Ring 3)
- [ ] fpga
- [ ] asic
- [ ] moore-s-law
- [ ] dennard-scaling
- [ ] tpu

---

## Computer Architecture

### Core (Ring 1)
- [x] instruction-set               priority: 5
- [x] cpu-pipeline                  priority: 4
- [x] cache                         priority: 5   (core+high; appears as supplemental in Hardware)
- [x] register                      priority: 4
- [x] virtual-memory                priority: 5   (cross-listed with OS; primary in OS)

### Important (Ring 2)
- [x] risc-vs-cisc                  priority: 3
- [ ] branch-prediction             priority: 2
- [ ] out-of-order-execution        priority: 2
- [ ] simd                          priority: 2
- [x] cache-coherence               priority: 2
- [x] memory-hierarchy              priority: 3
- [ ] dma                           priority: 2

### Supplemental (Ring 3)
- [ ] superscalar
- [ ] speculative-execution
- [ ] tlb
- [ ] arm-vs-x86
- [ ] systolic-array

---

## Operating Systems

### Core (Ring 1)
- [x] operating-system              priority: 5
- [x] process                       priority: 6   (core+high+gap)
- [x] thread                        priority: 5
- [x] scheduler                     priority: 5
- [x] virtual-memory                priority: 6   (core+high+gap)
- [x] kernel                        priority: 5
- [x] file-system                   priority: 5

### Important (Ring 2)
- [x] system-call                   priority: 4
- [x] context-switch                priority: 3
- [x] interrupt                     priority: 4
- [x] paging                        priority: 3
- [x] mutex                         priority: 3
- [x] deadlock                      priority: 3
- [ ] inode                         priority: 2
- [ ] daemon                        priority: 2
- [ ] shell                         priority: 3

### Supplemental (Ring 3)
- [ ] real-time-os
- [ ] microkernel-vs-monolithic
- [ ] capability-based-security
- [ ] copy-on-write
- [ ] ext4-vs-zfs-vs-btrfs

---

## Programming Languages

### Core (Ring 1)
- [x] programming-language          priority: 5
- [x] compiler                      priority: 5
- [x] interpreter                   priority: 4
- [x] type-system                   priority: 4
- [x] garbage-collection            priority: 4

### Important (Ring 2)
- [x] python                        priority: 4
- [x] javascript-language           priority: 5
- [x] c                             priority: 4
- [x] rust                          priority: 3
- [ ] java                          priority: 3
- [x] go                            priority: 3
- [ ] syntax-vs-semantics           priority: 3
- [x] parsing                       priority: 3
- [ ] memory-management             priority: 3

### Supplemental (Ring 3)
- [ ] haskell
- [ ] lisp
- [ ] forth
- [ ] smalltalk
- [ ] erlang
- [ ] continuation
- [ ] homoiconicity

---

## Software Engineering

### Core (Ring 1)
- [x] version-control               priority: 5
- [x] git                           priority: 5
- [x] testing                       priority: 5
- [x] code-review                   priority: 4
- [x] ci-cd                         priority: 5
- [x] design-pattern                priority: 4

### Important (Ring 2)
- [x] unit-test                     priority: 4
- [x] integration-test              priority: 3
- [x] refactoring                   priority: 3
- [x] technical-debt                priority: 3
- [x] agile                         priority: 3
- [ ] monorepo                      priority: 2
- [ ] semantic-versioning           priority: 2
- [ ] feature-flag                  priority: 2

### Supplemental (Ring 3)
- [ ] mob-programming
- [ ] formal-methods
- [ ] dora-metrics
- [ ] test-driven-development
- [ ] domain-driven-design

---

## Data and Databases

### Core (Ring 1)
- [x] database                      priority: 5
- [x] sql                           priority: 5
- [x] relational-model              priority: 5
- [x] indexing                      priority: 4
- [x] transaction-acid              priority: 4
- [x] normalization                 priority: 3

### Important (Ring 2)
- [x] nosql                         priority: 4
- [x] key-value-store               priority: 3
- [ ] document-store                priority: 3
- [ ] etl                           priority: 3
- [ ] data-warehouse                priority: 3
- [x] query-plan                    priority: 3
- [ ] schema-migration              priority: 3
- [x] orm                           priority: 3

### Supplemental (Ring 3)
- [ ] columnar-store
- [ ] graph-database
- [ ] time-series-database
- [ ] vector-database
- [ ] mvcc

---

## Networks and Internet

### Core (Ring 1)
- [x] ip-address                    priority: 5
- [x] dns                           priority: 5
- [x] http                          priority: 5
- [x] tcp                           priority: 4
- [x] udp                           priority: 4
- [x] packet                        priority: 4
- [x] router                        priority: 3
- [x] tls                           priority: 5   (cross-listed in Security; primary in Networks)

### Important (Ring 2)
- [x] osi-model                     priority: 3
- [x] https                         priority: 3
- [x] websocket                     priority: 3
- [x] rest-api                      priority: 4
- [x] cdn                           priority: 3
- [ ] gateway                       priority: 2
- [ ] firewall                      priority: 3
- [ ] nat                           priority: 2

### Supplemental (Ring 3)
- [ ] bgp
- [ ] mpls
- [ ] anycast
- [ ] quic
- [ ] ipv6

---

## Distributed Systems and Cloud

### Core (Ring 1)
- [x] distributed-system            priority: 4
- [x] consensus                     priority: 4
- [x] replication                   priority: 4
- [x] sharding                      priority: 3
- [x] microservices                 priority: 4
- [x] container                     priority: 5   (core+high)

### Important (Ring 2)
- [x] cap-theorem                   priority: 3
- [x] kubernetes                    priority: 4
- [x] message-queue                 priority: 3
- [x] eventual-consistency          priority: 3
- [ ] service-mesh                  priority: 2
- [ ] cloud-provider                priority: 3
- [x] serverless                    priority: 3

### Supplemental (Ring 3)
- [ ] raft
- [ ] paxos
- [ ] gossip-protocol
- [ ] crdt
- [ ] saga-pattern

---

## Security and Privacy

### Core (Ring 1)
- [x] cryptography                  priority: 5
- [x] public-key-cryptography       priority: 4
- [x] authentication                priority: 5
- [x] authorization                 priority: 4
- [x] password-hashing              priority: 4
- [x] tls                           priority: 5   (cross-listed)

### Important (Ring 2)
- [x] oauth                         priority: 4
- [x] xss                           priority: 3
- [x] sql-injection                 priority: 3
- [x] threat-model                  priority: 3
- [x] csrf                          priority: 2
- [ ] vulnerability                 priority: 3
- [ ] zero-trust                    priority: 3

### Supplemental (Ring 3)
- [ ] elliptic-curve-cryptography
- [ ] post-quantum-cryptography
- [ ] side-channel-attack
- [ ] sandbox

---

## Human-Computer Interaction

### Core (Ring 1)
- [x] user-interface                priority: 4
- [x] ux                            priority: 4
- [x] accessibility                 priority: 4
- [x] gui                           priority: 3
- [x] command-line-interface        priority: 3

### Important (Ring 2)
- [ ] design-system                 priority: 3
- [ ] usability-test                priority: 2
- [ ] keyboard-shortcut             priority: 2
- [ ] touch-interface               priority: 2

### Supplemental (Ring 3)
- [ ] fitts-law
- [ ] gestalt-principles
- [ ] dark-pattern

---

## Graphics and Media

### Core (Ring 1)
- [x] pixel                         priority: 4
- [x] rasterization                 priority: 3
- [x] color-space                   priority: 3
- [x] image-format                  priority: 3
- [x] codec                         priority: 3

### Important (Ring 2)
- [ ] ray-tracing                   priority: 3
- [ ] shader                        priority: 3
- [ ] jpeg                          priority: 2
- [ ] png                           priority: 2
- [ ] video-codec                   priority: 2

### Supplemental (Ring 3)
- [ ] anti-aliasing
- [ ] subpixel-rendering
- [ ] hdr
- [ ] color-management

---

## Artificial Intelligence

### Core (Ring 1)
- [x] machine-learning              priority: 5
- [x] neural-network                priority: 5
- [x] supervised-learning           priority: 4
- [x] training-and-inference        priority: 4
- [x] transformer                   priority: 5
- [x] large-language-model          priority: 5

### Important (Ring 2)
- [x] gradient-descent              priority: 4
- [x] embedding                     priority: 3
- [x] reinforcement-learning        priority: 3
- [x] computer-vision               priority: 3
- [ ] natural-language-processing   priority: 3
- [ ] convolutional-neural-network  priority: 3
- [ ] attention-mechanism           priority: 3

### Supplemental (Ring 3)
- [ ] perceptron
- [ ] support-vector-machine
- [ ] decision-tree
- [ ] hidden-markov-model
- [ ] retrieval-augmented-generation

---

## Applications

### Core (Ring 1)
- [x] web-browser                   priority: 5
- [x] mobile-app                    priority: 4
- [x] embedded-system               priority: 3
- [x] game-engine                   priority: 3

### Important (Ring 2)
- [ ] native-vs-web                 priority: 3
- [ ] iot                           priority: 3
- [ ] scientific-computing          priority: 2
- [ ] spreadsheet                   priority: 2

### Supplemental (Ring 3)
- [ ] electron
- [ ] webassembly
- [ ] progressive-web-app

---

## History and Society

### Core (Ring 1)
- [x] alan-turing                   priority: 4
- [x] turing-machine                priority: 4
- [x] history-of-computing          priority: 4
- [x] ada-lovelace                  priority: 3
- [x] internet-history              priority: 3

### Important (Ring 2)
- [ ] grace-hopper                  priority: 3
- [ ] dennis-ritchie                priority: 3
- [ ] eniac                         priority: 2
- [ ] unix-history                  priority: 3
- [ ] free-software-movement        priority: 3
- [ ] ethics-in-computing           priority: 3

### Supplemental (Ring 3)
- [ ] linus-torvalds
- [ ] tim-berners-lee
- [ ] xerox-parc
- [ ] arpanet

---

## Operations and Reliability

### Core (Ring 1)
- [x] deployment                    priority: 4
- [x] monitoring                    priority: 4
- [x] logging                       priority: 3
- [x] incident-response             priority: 3
- [x] sre                           priority: 3

### Important (Ring 2)
- [ ] observability                 priority: 3
- [ ] slo-sli-sla                   priority: 3
- [ ] blue-green-deployment         priority: 2
- [ ] canary-deployment             priority: 3
- [ ] downtime                      priority: 2
- [ ] runbook                       priority: 2

### Supplemental (Ring 3)
- [ ] chaos-engineering
- [ ] feature-flag-rollout
- [ ] toil
- [ ] error-budget

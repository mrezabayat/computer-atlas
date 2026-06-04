# Computer Atlas — Content Roadmap

> **Status (2026-06-04):** Ring 1 is **complete** — all 93 Core topics across all 16 categories exist (`npm run audit:importance` reports `Ring 1: COMPLETE`, `npm run audit:orphans` reports 100% connected). The Atlas has 92 topics and 10 learning paths.
>
> The active ring is **Ring 2**. See the "Ring 2 plan" section just below.

---

## Ring 2 plan

**Goal:** every topic with `importance: important` in this roadmap exists in `src/content/topics/`, at minimum as a `status: draft` skeleton; ideally with full prose.

### Pre-flight check (done before Ring 2 batches start)

- **`secondaryCategories`?** Not yet. The few cross-listed topics in Ring 1 (`virtual-memory`, `tls`, `gpu`) are handled cleanly via `related`/`partOf`. Ring 2 will add more multi-fit topics (`memory-management`, `interrupt`, `system-call`, `cache-coherence`, etc.); revisit if `related` starts feeling abusive. Decision deferred to mid-Ring 2.
- **Pagefind index size**: at 92 indexed pages the index is 1.2 MB across 116 files; the whole `dist/` is 4.1 MB. Pagefind ships chunks lazily, so even at 1000 pages the user-visible cost is dozens of KB per query. **No action needed before ~300 topics**; re-measure then.
- **A-Z index scale**: `/topics/` renders fine with 92 items. At ~250 items, consider per-letter sub-pages or always-on filter.
- **CI runtime**: `npm run check && npm run build && npm run lint:content` currently completes in well under a minute. Will stay healthy through Ring 2.

### Batch order (mirrors Ring 1 — learner demand first)

The same per-category sequence as Ring 1, since the audience that benefits from "Important" OS topics is the same one that benefited from "Core" OS topics:

1. Operating Systems Important — system-call, context-switch, interrupt, paging, mutex, deadlock, inode, daemon, shell.
2. Programming Languages Important — javascript-language, c, rust, java, go, syntax-vs-semantics, parsing, memory-management.
3. Foundations Important — hexadecimal, abstraction, complexity-theory, hash-table, tree, linked-list, stack-and-queue (+ deeper math topics).
4. Networks Important — osi-model, https, websocket, rest-api, cdn, firewall, gateway, nat.
5. Databases Important — nosql, key-value-store, document-store, etl, data-warehouse, query-plan, schema-migration, orm.
6. Software Engineering Important — unit-test, integration-test, refactoring, technical-debt, agile, monorepo, semantic-versioning, feature-flag.
7. Computer Architecture Important — risc-vs-cisc, branch-prediction, out-of-order-execution, simd, cache-coherence, memory-hierarchy, dma.
8. Security Important — oauth, xss, sql-injection, threat-model, csrf, vulnerability, zero-trust.
9. Distributed Systems Important — cap-theorem, kubernetes, message-queue, eventual-consistency, service-mesh, cloud-provider, serverless.
10. AI Important — gradient-descent, embedding, reinforcement-learning, computer-vision, natural-language-processing, convolutional-neural-network, attention-mechanism.
11. Cleanup batch — Hardware Important (motherboard, clock, etc.), HCI Important, Graphics Important, Apps Important, History Important, Ops Important.

Estimated ~120 topics across ~12 batches.

### Definition of done for Ring 2

- `audit-importance` reports `important: N / N` for every category.
- `find-orphans` stays ≤ 5 (or ≥ 95%).
- `lint-content` clean.
- Build + Pagefind under 5 s end-to-end.
- One additional learning path per shipped category that closely matches its Important set (so ~6 more paths total).
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
- [ ] hexadecimal                   priority: 4
- [ ] abstraction                   priority: 4
- [ ] complexity-theory             priority: 4
- [ ] computability                 priority: 3
- [ ] graph-theory                  priority: 3
- [ ] discrete-mathematics          priority: 3
- [ ] formal-language               priority: 3
- [ ] automata                      priority: 3
- [ ] hash-table                    priority: 4
- [ ] tree                          priority: 4
- [ ] linked-list                   priority: 3
- [ ] stack-and-queue               priority: 3

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
- [ ] risc-vs-cisc                  priority: 3
- [ ] branch-prediction             priority: 2
- [ ] out-of-order-execution        priority: 2
- [ ] simd                          priority: 2
- [ ] cache-coherence               priority: 2
- [ ] memory-hierarchy              priority: 3
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
- [ ] system-call                   priority: 4
- [ ] context-switch                priority: 3
- [ ] interrupt                     priority: 4
- [ ] paging                        priority: 3
- [ ] mutex                         priority: 3
- [ ] deadlock                      priority: 3
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
- [ ] javascript-language           priority: 5
- [ ] c                             priority: 4
- [ ] rust                          priority: 3
- [ ] java                          priority: 3
- [ ] go                            priority: 3
- [ ] syntax-vs-semantics           priority: 3
- [ ] parsing                       priority: 3
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
- [ ] unit-test                     priority: 4
- [ ] integration-test              priority: 3
- [ ] refactoring                   priority: 3
- [ ] technical-debt                priority: 3
- [ ] agile                         priority: 3
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
- [ ] nosql                         priority: 4
- [ ] key-value-store               priority: 3
- [ ] document-store                priority: 3
- [ ] etl                           priority: 3
- [ ] data-warehouse                priority: 3
- [ ] query-plan                    priority: 3
- [ ] schema-migration              priority: 3
- [ ] orm                           priority: 3

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
- [ ] osi-model                     priority: 3
- [ ] https                         priority: 3
- [ ] websocket                     priority: 3
- [ ] rest-api                      priority: 4
- [ ] cdn                           priority: 3
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
- [ ] cap-theorem                   priority: 3
- [ ] kubernetes                    priority: 4
- [ ] message-queue                 priority: 3
- [ ] eventual-consistency          priority: 3
- [ ] service-mesh                  priority: 2
- [ ] cloud-provider                priority: 3
- [ ] serverless                    priority: 3

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
- [ ] oauth                         priority: 4
- [ ] xss                           priority: 3
- [ ] sql-injection                 priority: 3
- [ ] threat-model                  priority: 3
- [ ] csrf                          priority: 2
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
- [ ] gradient-descent              priority: 4
- [ ] embedding                     priority: 3
- [ ] reinforcement-learning        priority: 3
- [ ] computer-vision               priority: 3
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

# Computer Atlas — Content Roadmap

> **Status (2026-06-08):** Rings 1 and 2 are both **complete** for the original 16 categories. The Atlas has **205 topics** (all `status: reviewed`) and **16 learning paths**, 100% connected (`npm run audit:importance` reports `core=91 important=114`, `npm run audit:orphans` reports 100% connected, `lint:content` clean).
>
> - **Ring 1 (Core):** 93/93 ✅ (original categories) + new topics needed for Mathematical Foundations & Low-Latency Systems
> - **Ring 2 (Important):** 114/114 written and reviewed ✅
> - **Ring 3 (Supplemental):** 0 / ~90 — **active for original categories.** New categories (Mathematical Foundations, Low-Latency Systems) start at Ring 1.
>
> **Two new categories added (2026-06-08):** Mathematical Foundations (CS2023 MSF) and Low-Latency Systems (CS2023 SPD/HPC track). These require Ring 1 topics to be written before Ring 3 work begins for them. Two new learning paths needed: `math-for-cs` and `high-performance-systems`.
>
> The "Ring 2 plan" section below is retained as a record of how Ring 2 was executed.

---

## Ring 2 plan

**Goal (achieved 2026-06-08):** every topic with `importance: important` in this roadmap exists in `src/content/topics/` with full prose and `status: reviewed`. All 114 are written and reviewed.

### Pre-flight notes (still relevant for Ring 3)

- **`secondaryCategories`?** Still not added, and still no pain. The cross-listed topics (`virtual-memory`, `tls`, `gpu`, plus multi-fit ones like `memory-hierarchy`, `interrupt`, `system-call`, `cache-coherence`) are handled cleanly via `related`/`partOf`. Keep deferring until `related` starts feeling abusive.
- **Pagefind index size**: **now at 205 topics — a re-measure is due.** Pagefind ships chunks lazily, so the user-visible cost stays low. Re-check before ~300 topics.
- **A-Z index scale**: `/topics/` should be re-checked at 205 items. At ~250, consider per-letter sub-pages or an always-on filter.
- **CI runtime**: re-confirm `npm run check && npm run build && npm run lint:content` timing now that the topic count has grown.

### Execution record — the 66 topics this push added

Ring 2 was completed one category at a time, gating after each with `lint-content`, `find-orphans`, and a reference check (`scripts/check-refs.mjs`). The 48 Important topics that already existed were left in place; this push wrote the remaining 66 — started categories (stragglers in dense neighborhoods) first, then the six zero-progress "cleanup" categories:

1. Operating Systems — inode, daemon, shell
2. Programming Languages — java, syntax-vs-semantics, memory-management
3. Networks — gateway, firewall, nat
4. Databases — document-store, etl, data-warehouse, schema-migration
5. Software Engineering — monorepo, semantic-versioning, feature-flag
6. Computer Architecture — branch-prediction, out-of-order-execution, simd, dma
7. Security — vulnerability, zero-trust
8. Distributed Systems — service-mesh, cloud-provider
9. AI — natural-language-processing, convolutional-neural-network, attention-mechanism
10. Foundations — abstraction, complexity-theory, computability, graph-theory, discrete-mathematics, formal-language, automata
11. Hardware — motherboard, clock, peripheral, ssd, hdd, flash-memory, dram-vs-sram
12. Operations — observability, slo-sli-sla, blue-green-deployment, canary-deployment, downtime, runbook
13. History — grace-hopper, dennis-ritchie, eniac, unix-history, free-software-movement, ethics-in-computing
14. Graphics — ray-tracing, shader, jpeg, png, video-codec
15. HCI — design-system, usability-test, keyboard-shortcut, touch-interface
16. Applications — native-vs-web, iot, scientific-computing, spreadsheet

All 114 Important topics were then promoted from `draft` to `reviewed`.

### Definition of done for Ring 2 — status

- ✅ `audit-importance` reports `important: 114` (every category complete).
- ✅ `find-orphans` reports 100% connected (well within the ≤ 5 / ≥ 95% budget).
- ✅ `lint-content` clean.
- ⚠️ **Not verified this pass:** `astro build` + Pagefind timing — `node_modules` isn't installed locally. Run `npm install && npm run build` to confirm.
- ⚠️ **Learning-path coverage not re-audited:** 16 paths exist; confirm each category's Important set is touched and add paths for any uncovered category.

### Ring 3 is now active

Ring 2 completed on 2026-06-08, so Ring 3 (Supplemental) is the active ring — the original "don't write niche topics while Important ones are missing" gate is now satisfied. Pick the highest-priority Supplemental items from the per-category lists below; the same one-category-at-a-time + audit-gate workflow applies.

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
- [x] abstraction                   priority: 4
- [x] complexity-theory             priority: 4
- [x] computability                 priority: 3
- [x] graph-theory                  priority: 3
- [x] discrete-mathematics          priority: 3
- [x] formal-language               priority: 3
- [x] automata                      priority: 3
- [x] hash-table                    priority: 4
- [x] tree                          priority: 4
- [x] linked-list                   priority: 3
- [x] stack-and-queue               priority: 3

### Important (Ring 2) — additions
- [ ] turing-completeness          priority: 4   (high search demand)
- [ ] np-completeness              priority: 4   (high search demand)

### Supplemental (Ring 3)
- [ ] lambda-calculus
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
- [x] motherboard                   priority: 3
- [x] clock                         priority: 3
- [x] peripheral                    priority: 2
- [x] ssd                           priority: 3
- [x] hdd                           priority: 2
- [x] flash-memory                  priority: 2
- [x] dram-vs-sram                  priority: 2

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
- [x] branch-prediction             priority: 2
- [x] out-of-order-execution        priority: 2
- [x] simd                          priority: 2
- [x] cache-coherence               priority: 2
- [x] memory-hierarchy              priority: 3
- [x] dma                           priority: 2

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
- [x] inode                         priority: 2
- [x] daemon                        priority: 2
- [x] shell                         priority: 3

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
- [x] java                          priority: 3
- [x] go                            priority: 3
- [x] syntax-vs-semantics           priority: 3
- [x] parsing                       priority: 3
- [x] memory-management             priority: 3

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
- [x] monorepo                      priority: 2
- [x] semantic-versioning           priority: 2
- [x] feature-flag                  priority: 2

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
- [x] document-store                priority: 3
- [x] etl                           priority: 3
- [x] data-warehouse                priority: 3
- [x] query-plan                    priority: 3
- [x] schema-migration              priority: 3
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
- [x] gateway                       priority: 2
- [x] firewall                      priority: 3
- [x] nat                           priority: 2

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
- [x] service-mesh                  priority: 2
- [x] cloud-provider                priority: 3
- [x] serverless                    priority: 3

### Supplemental (Ring 3)
- [ ] raft
- [ ] paxos
- [ ] gossip-protocol
- [ ] crdt
- [ ] saga-pattern
- [ ] actor-model
- [ ] mpi-basics
- [ ] openmp

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
- [x] vulnerability                 priority: 3
- [x] zero-trust                    priority: 3

### Supplemental (Ring 3)
- [ ] elliptic-curve-cryptography
- [ ] post-quantum-cryptography
- [ ] side-channel-attack
- [ ] sandbox
- [ ] homomorphic-encryption
- [ ] formal-verification

---

## Human-Computer Interaction

### Core (Ring 1)
- [x] user-interface                priority: 4
- [x] ux                            priority: 4
- [x] accessibility                 priority: 4
- [x] gui                           priority: 3
- [x] command-line-interface        priority: 3

### Important (Ring 2)
- [x] design-system                 priority: 3
- [x] usability-test                priority: 2
- [x] keyboard-shortcut             priority: 2
- [x] touch-interface               priority: 2

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
- [x] ray-tracing                   priority: 3
- [x] shader                        priority: 3
- [x] jpeg                          priority: 2
- [x] png                           priority: 2
- [x] video-codec                   priority: 2

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
- [x] natural-language-processing   priority: 3
- [x] convolutional-neural-network  priority: 3
- [x] attention-mechanism           priority: 3

### Supplemental (Ring 3)
- [ ] perceptron
- [ ] support-vector-machine
- [ ] decision-tree
- [ ] hidden-markov-model
- [ ] retrieval-augmented-generation
- [ ] diffusion-model
- [ ] fine-tuning
- [ ] prompt-engineering
- [ ] multimodal-ai

---

## Applications

### Core (Ring 1)
- [x] web-browser                   priority: 5
- [x] mobile-app                    priority: 4
- [x] embedded-system               priority: 3
- [x] game-engine                   priority: 3

### Important (Ring 2)
- [x] native-vs-web                 priority: 3
- [x] iot                           priority: 3
- [x] scientific-computing          priority: 2
- [x] spreadsheet                   priority: 2

### Supplemental (Ring 3)
- [ ] electron
- [ ] webassembly
- [ ] progressive-web-app
- [ ] edge-computing
- [ ] wasm-runtime
- [ ] real-time-systems

---

## History and Society

### Core (Ring 1)
- [x] alan-turing                   priority: 4
- [x] turing-machine                priority: 4
- [x] history-of-computing          priority: 4
- [x] ada-lovelace                  priority: 3
- [x] internet-history              priority: 3

### Important (Ring 2)
- [x] grace-hopper                  priority: 3
- [x] dennis-ritchie                priority: 3
- [x] eniac                         priority: 2
- [x] unix-history                  priority: 3
- [x] free-software-movement        priority: 3
- [x] ethics-in-computing           priority: 3

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
- [x] observability                 priority: 3
- [x] slo-sli-sla                   priority: 3
- [x] blue-green-deployment         priority: 2
- [x] canary-deployment             priority: 3
- [x] downtime                      priority: 2
- [x] runbook                       priority: 2

### Supplemental (Ring 3)
- [ ] chaos-engineering
- [ ] feature-flag-rollout
- [ ] toil
- [ ] error-budget

---

## Mathematical Foundations

> Path: `math-for-cs` (needs to be created)
>
> CS2023 Knowledge Area: **MSF** (Mathematical and Statistical Foundations). Ring 1 topics here need to be written before this category's Ring 3 work begins.

### Core (Ring 1)
- [ ] linear-algebra               priority: 5   (core+high)
- [ ] probability-statistics       priority: 5   (core+high)
- [ ] calculus-basics              priority: 4
- [ ] set-theory                   priority: 4

### Important (Ring 2)
- [ ] bayesian-inference           priority: 4
- [ ] information-theory           priority: 3
- [ ] numerical-methods            priority: 3
- [ ] linear-programming           priority: 3

### Supplemental (Ring 3)
- [ ] optimization-theory
- [ ] fourier-transform
- [ ] markov-chains
- [ ] game-theory

---

## Low-Latency Systems

> Path: `high-performance-systems` (needs to be created)
>
> CS2023 Knowledge Area: **SPD** extension + HPC track. Covers sub-millisecond execution, hardware-software co-design, and performance engineering. Ring 1 topics here need to be written before this category's Ring 3 work begins.

### Core (Ring 1)
- [ ] cache-line-alignment         priority: 5   (core+high)
- [ ] memory-pool                  priority: 5   (core+high)
- [ ] lock-free-programming        priority: 5   (core+high)

### Important (Ring 2)
- [ ] data-oriented-design         priority: 4
- [ ] core-affinity                priority: 4
- [ ] branchless-programming       priority: 3
- [ ] simd-intrinsics              priority: 3
- [ ] numa-awareness               priority: 3

### Supplemental (Ring 3)
- [ ] huge-pages
- [ ] kernel-bypass
- [ ] rdma
- [ ] ebpf
